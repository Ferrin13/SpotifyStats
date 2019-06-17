import React from 'react';
import { Redirect } from "react-router-dom";
import axios from "./Services/AxiosService"

class AfterAuthComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {authFailed: false, authComplete: false}
    this.parseAndSendCode = this.parseAndSendCode.bind(this);
    this.getBasicInfo = this.getBasicInfo.bind(this);
  }

  componentWillMount() {
    this.parseAndSendCode();
  }

  sendCode(code) {
    return axios.post('/spotify-auth/receive-code', JSON.stringify({code: code}));
  }

  parseAndSendCode() {
    let search = new URLSearchParams(this.props.location.search)
    let code = search.get('code');
    if(code) {
      this.sendCode(code)
      .then(res => this.setState({authComplete: true}))
    } else if(search.get('error')) {
      this.setState({authFailed: true})
    }
   }

  fetchBasicInfo() {
    axios.get('/spotify/basic-info')
    .then(response => console.log("Response is: ", response))
  }

  getBasicInfo() {
    this.fetchBasicInfo();
  }

  render() {

    return( 
      this.state.authComplete ? 
      <Redirect to="/user-tracks"></Redirect>
      : this.state.authFailed && <div> AUTHORIZATION FAILED</div>
    );
  }
}

export default AfterAuthComponent