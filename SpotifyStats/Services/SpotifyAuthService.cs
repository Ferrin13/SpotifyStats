using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection.Metadata;
using System.Security.Authentication;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using SpotifyStats.Models;

namespace SpotifyStats.Services
{
  public class SpotifyAuthService : ISpotifyAuthService
  {
    private const string FORM_ENCODED_HEADER_STRING = "application/x-www-form-urlencoded";

    private DateTime _tokenAcquisitionTime;
    private SpotifyAuthorizationDto _spotifyAuthorizationDto;

    private readonly IConfiguration _config; 
    public SpotifyAuthService(IConfiguration config)
    {
      _config = config;
    }

    public string AccessToken => _spotifyAuthorizationDto?.Access_Token;
    public async Task<bool> AcquireAccessToken(string accessCode)
    {
      var requestBody = new List<KeyValuePair<string, string>>()
      {
        new KeyValuePair<string, string>("grant_type", "authorization_code"),
        new KeyValuePair<string, string>("code", accessCode),
        new KeyValuePair<string, string>("redirect_uri", _config["AfterAuthRedirectUrl"])
      };

      using (var httpClient = new HttpClient())
      {
        var msg = tokenRequestMessage(requestBody);
        var response = await httpClient.SendAsync(msg);

        if (!response.IsSuccessStatusCode)
        {
          throw new AuthenticationException(
            $"Could not get status code with following request parameters:" +
            $"ACCESS CODE: {accessCode}" +
            $"REDIRECT_URL: {_config["AfterAuthRedirectUrl"]}" +
            $"AUTHORIZATION_HEADER: {msg.Headers.Authorization.Parameter}" +
            $"Response Text: {await response.Content.ReadAsStringAsync()}"
          );
          //return false;
        }

        _tokenAcquisitionTime = DateTime.Now;
        _spotifyAuthorizationDto = await response.Content.ReadAsAsync<SpotifyAuthorizationDto>();
        return true;

      }
    }

    public async Task<bool> RefreshAccessToken()
    {
      if(_spotifyAuthorizationDto == null) { throw new InvalidOperationException("Authorization object is null"); }

      var requestBody = new List<KeyValuePair<string, string>>()
      {
        new KeyValuePair<string, string>("grant_type", "refresh_token"),
        new KeyValuePair<string, string>("refresh_token", _spotifyAuthorizationDto.Refresh_Token),
      };

      using (var httpClient = new HttpClient())
      {
        var msg = tokenRequestMessage(requestBody);
        var response = await httpClient.SendAsync(msg);

        if (!response.IsSuccessStatusCode) { return false; }

        _tokenAcquisitionTime = DateTime.Now;
        _spotifyAuthorizationDto = await response.Content.ReadAsAsync<SpotifyAuthorizationDto>();
        return true;
      }
    }

    public bool IsTokenExpired()
    {
      if (_spotifyAuthorizationDto == null) { throw new InvalidOperationException("Authorization object is null"); }

      if (!int.TryParse(_spotifyAuthorizationDto.Expires_In, out var timeoutSecs))
      {
        throw new FormatException ("Could not parse Authorization expires_in field to int");
      };
      return _tokenAcquisitionTime.AddSeconds(timeoutSecs) < DateTime.Now;
    }

    private HttpRequestMessage tokenRequestMessage(List<KeyValuePair<string, string>> requestBody)
    {
      var clientKeyString = $"{_config["SpotifyClientId"]}:{_config["SPOTIFY_STATS_SPOTIFY_CLIENT_SECRET"]}";
      var encodedClientKey = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(clientKeyString));

      HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, _config["SpotifyTokenEndpoint"]);
      msg.Headers.Authorization = new AuthenticationHeaderValue("Basic", encodedClientKey);

      var content = new FormUrlEncodedContent(requestBody);
      content.Headers.ContentType = new MediaTypeHeaderValue(FORM_ENCODED_HEADER_STRING);
      msg.Content = content;

      return msg;
    }
  }
}
