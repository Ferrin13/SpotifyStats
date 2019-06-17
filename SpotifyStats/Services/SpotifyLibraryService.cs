using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Identity.UI.Pages.Internal.Account;
using Microsoft.Extensions.Configuration;
using SpotifyStats.Models;
using SpotifyStats.Utilities;

namespace SpotifyStats.Services
{
  public class SpotifyLibraryService: ISpotifyLibraryService
  {
    private readonly IConfiguration _config;
    private readonly ISpotifyAuthService _spotifyAuth;

    private const string SPOTIFY_USER_TRACKS_PATH = "/v1/me/tracks";
    private const string SPOTIFY_TRACK_FEATURES_PATH = "/v1/audio-features";
    private const int USER_TRACKS_PER_REQUEST_MAX = 50;

    private AsyncLazy<List<UserTrackWithFeaturesDto>> _tracksWithFeatures;

    public bool AreTracksLoaded => _tracksWithFeatures != null;

    public SpotifyLibraryService(IConfiguration config, ISpotifyAuthService spotifyAuth)
    {
      _config = config;
      _spotifyAuth = spotifyAuth;
      _tracksWithFeatures = new AsyncLazy<List<UserTrackWithFeaturesDto>>(async () => await loadSpotifyTracks());
    }

    public async Task RefreshSpotifyTracks()
    {
      var tracksWithFeatures = await loadSpotifyTracks();
      _tracksWithFeatures = new AsyncLazy<List<UserTrackWithFeaturesDto>>(async() => await loadSpotifyTracks());
    }

    public async Task<UserLibrarySummaryDto> GetUserTracksSummary()
    {
      var tracksWithFeatures = await _tracksWithFeatures;

      var singleArtistPerSong = tracksWithFeatures
        .SelectMany(twf => twf.Track.ArtistNames.Select(a => new Tuple<string, UserTrackWithFeaturesDto>(a, twf))).ToList();

      var favArtist = singleArtistPerSong.GroupBy(tuple => tuple.Item1)
        .OrderByDescending(g => g.Count())
        .Select(g => g.Key).FirstOrDefault();

      var libraryInfo = new UserLibraryInfoDto()
      {
        FavoriteArtistName = favArtist,
        SongsPerArtist = (double)singleArtistPerSong.Count() / singleArtistPerSong.GroupBy(tuple => tuple.Item1).Count(),
        ShortestSongName = tracksWithFeatures.OrderBy(twf => twf.Track.DurationMs).Select(twf => twf.Track.Name).First(),
        LongestSongName = tracksWithFeatures.OrderByDescending(twf => twf.Track.DurationMs).Select(twf => twf.Track.Name).First()
      };

      var tracksAverages = new UserTracksAveragesDto()
      {
        AcousticnessAverage = getTrackFeatureAverage(tracksWithFeatures, twf => twf.Features.Acousticness),
        DanceabilityAverage = getTrackFeatureAverage(tracksWithFeatures, twf => twf.Features.Danceability),
        EnergyAverage = getTrackFeatureAverage(tracksWithFeatures, twf => twf.Features.Energy),
        InstrumentalnessAverage = getTrackFeatureAverage(tracksWithFeatures, twf => twf.Features.Instrumentalness),
        LengthMsAverage = getTrackFeatureAverage(tracksWithFeatures, twf => twf.Track.DurationMs),
        LoudnessAverage = getTrackFeatureAverage(tracksWithFeatures, twf => twf.Features.Loudness),
        PopularityAverage = getTrackFeatureAverage(tracksWithFeatures, twf => twf.Track.Popularity),
        TempoAverage = getTrackFeatureAverage(tracksWithFeatures, twf => twf.Features.Tempo),
        ValenceAverage = getTrackFeatureAverage(tracksWithFeatures, twf => twf.Features.Valence)
      };

      var librarySummaryDto = new UserLibrarySummaryDto()
      {
        LibraryInfo = libraryInfo,
        TrackAverages = tracksAverages
      };

      return librarySummaryDto;
    }

    public async Task<List<UserTrackWithFeaturesDto>> GetUserTracks()
    {
      return await _tracksWithFeatures;
    }

    private async Task<List<UserTrackWithFeaturesDto>> loadSpotifyTracks()
    {
      var tracksWithFeatures = new List<UserTrackWithFeaturesDto>();
      var offset = 0;
      SpotifyUserLibraryTracksDto tracksPart;
      do
      {
        tracksPart = await getUserTracks(offset, USER_TRACKS_PER_REQUEST_MAX);
        var trackFeatures = await getTrackFeatures(tracksPart.Items.Select(i => i.Track.Id));
        var joinedTracks = tracksPart.Items.Select(i => i.Track.ToTrack(i.Added_At, int.Parse(_config["ImageMinHeight"])))
          .Join(trackFeatures.Audio_Features.Select(tf => tf.ToUserTrackFeatures()),
            userTrack => userTrack.Id,
            trackFeature => trackFeature.Id,
            (ut, tf) => new UserTrackWithFeaturesDto() { Track = ut, Features = tf });
        tracksWithFeatures.AddRange(joinedTracks);
        offset += USER_TRACKS_PER_REQUEST_MAX;
      } while (!string.IsNullOrEmpty(tracksPart.Next));

      return tracksWithFeatures;
    }

    private double getTrackFeatureAverage(IEnumerable<UserTrackWithFeaturesDto> featuresList, Func<UserTrackWithFeaturesDto, double> fieldSelector)
    {
      return featuresList.Select(fieldSelector).Average();
    }



    private async Task<SpotifyUserLibraryTracksDto> getUserTracks(int offset, int limit)
    {
      var query = HttpUtility.ParseQueryString(string.Empty); //This actually returns a special kind of private class with a proper ToString, not just a NamedValueCollection
      query["offset"] = offset.ToString();
      query["limit"] = limit.ToString();
      return await nonNullAuthorizedSpotifyRequest<SpotifyUserLibraryTracksDto>($"{SPOTIFY_USER_TRACKS_PATH}?{query}");
    }

    private async Task<SpotifyTrackFeatureListDto> getTrackFeatures(IEnumerable<string> trackIds)
    {
      var uri = $"{SPOTIFY_TRACK_FEATURES_PATH}/?ids={string.Join(",", trackIds)}";
      return await nonNullAuthorizedSpotifyRequest<SpotifyTrackFeatureListDto>(uri);
    }

    private async Task<T> nonNullAuthorizedSpotifyRequest<T>(string path)
    {
      if (string.IsNullOrWhiteSpace(_spotifyAuth.AccessToken)) { throw new InvalidOperationException("Access token is null"); }

      if (_spotifyAuth.IsTokenExpired())
      {
        await _spotifyAuth.RefreshAccessToken();
      }

      using (var httpClient = new HttpClient())
      {
        HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Get, $"{_config["BaseSpotifyApiUrl"]}{path}");
        msg.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _spotifyAuth.AccessToken);

        var response = await httpClient.SendAsync(msg);

        if (!response.IsSuccessStatusCode) return default(T);

        var result = await response.Content.ReadAsAsync<T>();
        if (result == null) throw new Exception("Result from request was null"); //Can't use null coalesce

        return result;
      }
    }
  }
}
