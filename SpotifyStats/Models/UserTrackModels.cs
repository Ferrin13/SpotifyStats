using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpotifyStats.Models
{
  public class UserTrackDto
  {
    public DateTime AddedAt { get; set; }
    public string[] ArtistNames { get; set; }
    public int DurationMs { get; set; }
    public string Href { get; set; }
    public string Id { get; set; }
    public SpotifyImageDto Image { get; set; }
    public string Name { get; set; }
    public int Popularity { get; set; }
    public string PreviewUrl { get; set; }
    public string ReleaseDate { get; set; }
    public string Uri { get; set; }
  }

  public class UserTrackWithFeaturesDto 
  {
    public UserTrackDto Track { get; set; }
    public UserTrackFeaturesDto Features { get; set; }
  }

  public class UserTrackFeaturesDto {
    public double Danceability { get; set; }
    public double Energy { get; set; }
    public int Key { get; set; }
    public double Loudness { get; set; }
    public int Mode { get; set; }
    public double Speechiness { get; set; }
    public double Acousticness { get; set; }
    public double Instrumentalness { get; set; }
    public double Liveness { get; set; }
    public double Valence { get; set; }
    public double Tempo { get; set; }
    public string Id { get; set; }
  }

  public class UserLibrarySummaryDto
  {
    public UserLibraryInfoDto LibraryInfo { get; set; }
    public UserTracksAveragesDto TrackAverages { get; set; }
  }

  public class UserTracksAveragesDto
  {
    public double AcousticnessAverage { get; set; }
    public double DanceabilityAverage { get; set; }
    public double EnergyAverage { get; set; }
    public double InstrumentalnessAverage { get; set; }
    public double LengthMsAverage { get; set; }
    public double LoudnessAverage { get; set; }
    public double PopularityAverage { get; set; }
    public double TempoAverage { get; set; }
    public double ValenceAverage { get; set; }
  }

  public class UserLibraryInfoDto
  {
    public string FavoriteArtistName { get; set; }
    public double SongsPerArtist { get; set; }
    public string ShortestSongName { get; set; }
    public string LongestSongName { get; set; }
  }
}
