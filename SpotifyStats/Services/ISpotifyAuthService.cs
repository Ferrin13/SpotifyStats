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
    Task AcquireAccessToken(string accessCode);
    Task RefreshAccessToken();
    bool IsTokenExpired();
  }
}
