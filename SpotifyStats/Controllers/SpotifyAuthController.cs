using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Configuration;
using SpotifyStats.Models;
using SpotifyStats.Services;

namespace SpotifyStats.Controllers
{
  [Route("api/spotify-auth")]
  [EnableCors("AllowAny")]
  [ApiController]
  public class SpotifyAuthController : ControllerBase
  {
    private readonly IConfiguration _config;
    private readonly ISpotifyAuthService _spotifyAuth;

    public SpotifyAuthController(IConfiguration config, ISpotifyAuthService spotifyAuth) : base()
    {
      _config = config;
      _spotifyAuth = spotifyAuth;
    }

    [HttpPost("receive-code")]
    public async Task<ActionResult> ReceiveCode([FromBody]CodeObject codeObject)
    {
      var accessCode = codeObject.Code;
      var acquiredToken = await _spotifyAuth.AcquireAccessToken(accessCode);

      return acquiredToken ? (ActionResult) Ok() : BadRequest("Could not acquire access token with given code"); //This should have some more granular response types
    }
   
    public class CodeObject
    {
      public string Code { get; set; }
    }
  }
}