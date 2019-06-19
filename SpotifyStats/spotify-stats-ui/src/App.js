import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";
import AfterAuthComponent from './AfterAuthComponent';
import UserTrackComponent from './UserTracksComponent';
var Config = require('./config')

function AppRouter() {
  return(
    <Router>
      <Route path="/" exact component={AppBase}/>
      <Route path="/after-auth" exact component={AfterAuthComponent}/>
      <Route path="/user-tracks" exact component={UserTrackComponent}/>
    </Router>
  )
}

class AppBase extends React.Component {
  constructor(props) {
    super(props);
    this.routeChange = this.routeChange.bind(this);
  }

  routeChange() {
    const querystring = require('querystring');
    // let client_id = '9283b48f67a94757b9c9a6f1e01f1599';
    let client_id = Config.clientId;
    let redirect_uri = `${Config.baseUrl}/after-auth`;
    let response_type = 'code'; 
    let scope = "user-top-read user-read-recently-played user-read-private user-read-email user-library-read"
    let queryParams = querystring.stringify({client_id, redirect_uri, response_type, scope});
    let path = `${Config.spotifyAccountsUrl}/authorize?${queryParams}`;
    window.location.href = path;
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col">
            <div style={{display: "flex", justifyContent: "center", padding: "25px"}}>
              <button className="btn-large btn-primary auth-button" onClick={this.routeChange}>
                Login To Spotify
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <AppRouter/>,
  document.getElementById('root')
);


export default AppRouter;
