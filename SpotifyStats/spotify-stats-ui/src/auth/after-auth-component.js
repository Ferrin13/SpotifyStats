import React from 'react';
import { Redirect } from "react-router-dom";
// import axios from "../services/axios-service"
import {sendAccessCode, authFailed} from "./auth-actions"
import {connect} from 'react-redux'

class AfterAuthComponent extends React.Component {
  componentWillMount() {
    this.parseAndSendCode();
  }

  parseAndSendCode() {
    let search = new URLSearchParams(this.props.location.search)
    let code = search.get('code');
    if(code) {
      this.props.sendAccessCode(code).then(res => console.log("Sent Access Code"))
    } else if(search.get('error')) {
      this.props.authFailed();
    }
   }

  render() {
    return( 
      this.props.authComplete ?
      <Redirect to="/user-tracks"></Redirect>
      : this.props.authFailed && <div style={{display: "flex", justifyContent: "center"}} > AUTHORIZATION FAILED</div>
    );
  }
}

const mapStateToProps = state => {
  return state.authState
}

const mapDispatchToProps = {sendAccessCode, authFailed}

export default connect(mapStateToProps, mapDispatchToProps)(AfterAuthComponent)