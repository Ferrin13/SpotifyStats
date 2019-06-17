using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpotifyStats.Controllers;

namespace SpotifyStats.Models
{

  public class SpotifyAuthorizationDto
  {
    public string Access_Token { get; set; }
    public string Token_Type { get; set; }
    public string Expires_In { get; set; }
    public string Refresh_Token { get; set; }
    public string Scope { get; set; }
  }

  public class SpotifyBasicInfoDto
  {
    public string Display_Name { get; set; }
    public string Email { get; set; }
    public string Product { get; set; }
    public string Uri { get; set; }

  }

  public class SpotifyUserLibraryTracksDto
  {
    public string Href { get; set; }
    public SpotifyItemDto[] Items { get; set; }
    public int Limit { get; set; }
    public string Next { get; set; }
    public int Offset { get; set; }
    public string Previous { get; set; }
    public int Total { get; set; }
  }

  public class SpotifyItemDto
  {
    public DateTime Added_At { get; set; }
    public SpotifyTrackDto Track { get; set; }
  }

  public class SpotifyTrackDto
  {
    public SpotifyAlbumDto Album { get; set; }
    public int Duration_Ms { get; set; }
    public string Href { get; set; }
    public string Id { get; set; }
    public SpotifyImageDto[] Images { get; set; }
    public string Name { get; set; }
    public int Popularity { get; set; }
    public string Preview_Url { get; set; }
    public string Uri { get; set; }

    public UserTrackDto ToTrack(DateTime addedAt, int imageMinHeightPx)
    {
      return new UserTrackDto()
      {
        AddedAt = addedAt,
        ArtistNames = Album?.Artists.Select(a => a.Name).ToArray(),
        DurationMs = Duration_Ms,
        Href = Href,
        Id = Id,
        Image = Album?.Images?.OrderBy(i => i.Height).FirstOrDefault(i => i.Height >= imageMinHeightPx),
        Name = Name,
        Popularity = Popularity,
        PreviewUrl = Preview_Url,
        ReleaseDate = Album?.Release_Date,
        Uri = Uri
      };
    }
  }

  public class SpotifyAlbumDto
  {
    public SpotifyArtistDto[] Artists { get; set; }
    public string Id { get; set; }
    public SpotifyImageDto[] Images { get; set; }
    public string Name { get; set; }
    public string Release_Date { get; set; } //Making string because not all dates are well formed (Some are only years)
  }

  public class SpotifyArtistDto
  {
    public string Id { get; set; }
    public string Name { get; set; }  
  }

  public class SpotifyImageDto
  {
    public int Height { get; set; }
    public string Url { get; set; }
    public int Width { get; set; }
  }

  public class SpotifyTrackFeaturesDto
  {
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

    public UserTrackFeaturesDto ToUserTrackFeatures()
    {
      return new UserTrackFeaturesDto()
      {
        Danceability = Danceability,
        Energy = Energy,
        Key = Key,
        Loudness = Loudness,
        Mode = Mode,
        Speechiness = Speechiness,
        Acousticness = Acousticness,
        Instrumentalness = Instrumentalness,
        Liveness = Liveness,
        Valence = Valence,
        Tempo = Tempo,
        Id = Id
      };
    }
  }

  public class SpotifyTrackFeatureListDto
  {
    public SpotifyTrackFeaturesDto[] Audio_Features { get; set; }
  }
}
