using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Policy;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SpotifyStats.Models;
using SpotifyStats.Services;

namespace SpotifyStats.Controllers
{
  [Route("api/spotify")]
  [EnableCors("AllowAny")]
  [ApiController]
  public class SpotifyController: ControllerBase
  {
    private readonly ISpotifyLibraryService _spotifyLibrary;

    public SpotifyController(ISpotifyLibraryService spotifyLibrary)
    {
      _spotifyLibrary = spotifyLibrary;
    }

    [HttpGet("user-tracks")]
    public async Task<ActionResult<List<UserTrackWithFeaturesDto>>> GetUserTracks()
    {
      var tracks = await _spotifyLibrary.GetUserTracks();
      return Ok(tracks);
    }

    [HttpGet("tracks-summary")]
    public async Task<ActionResult<UserLibrarySummaryDto>> GetUserTracksSummary()
    {
      var summary = await _spotifyLibrary.GetUserTracksSummary();
      return summary;
    }
  }
}
