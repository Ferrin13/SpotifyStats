using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpotifyStats.Models;

namespace SpotifyStats.Services
{
  public interface ISpotifyLibraryService
  {
    bool AreTracksLoaded { get; }
    Task RefreshSpotifyTracks();
    Task<UserLibrarySummaryDto> GetUserTracksSummary();
    Task<List<UserTrackWithFeaturesDto>> GetUserTracks();
  }
}
