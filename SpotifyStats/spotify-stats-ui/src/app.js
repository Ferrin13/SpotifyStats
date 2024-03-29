import React from 'react';

var config = require('./config')

const redirectToSpotify = () => {
  const querystring = require('querystring');
  //Variable names need to exactly match header names
  let client_id = config.clientId;
  let redirect_uri = `${config.baseUrl}/after-auth`;
  let response_type = 'code'; 
  let scope = "user-top-read user-read-recently-played user-read-private user-read-email user-library-read"
  let queryParams = querystring.stringify({client_id, redirect_uri, response_type, scope});
  let path = `${config.spotifyAccountsUrl}/authorize?${queryParams}`;
  window.location.href = path;
}

function AppBase() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col">
          <div style={{display: "flex", justifyContent: "center", padding: "25px"}}>
            <button className="btn-large btn-primary auth-button" onClick={redirectToSpotify}>
              Login To Spotify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppBase
