using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpotifyStats.Models;

namespace SpotifyStats.Services
{
  public interface ISpotifyAuthService
  {
    string AccessToken { get;  }
    Task<bool> AcquireAccessToken(string accessCode);
    Task<bool> RefreshAccessToken();
    bool IsTokenExpired();
  }
}
