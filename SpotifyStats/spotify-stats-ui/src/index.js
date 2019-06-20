import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import AppBase from './App';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AfterAuthComponent from './AfterAuthComponent';
import UserTrackComponent from './UserTracksComponent';

import './index.css';
// import 'bootstrap/dist/css/bootstrap.css';
import './BootstrapThemes/Darkly/bootstrap.css';
import 'react-table/react-table.css'



const appRouter = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={AppBase}/>
        <Route exact path="/after-auth" component={AfterAuthComponent}/>
        <Route exact path="/user-tracks" component={UserTrackComponent}/>
        <Route component={() => <div style={{display: "flex", justifyContent: "center"}}>NOT FOUND</div>}/>
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(appRouter, document.getElementById('root'));


if(module.hot) {
  module.hot.accept();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
