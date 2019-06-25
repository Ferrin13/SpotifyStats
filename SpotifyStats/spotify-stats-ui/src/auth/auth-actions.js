import axios from "../services/axios-service"

export const BEGIN_SEND_ACCESS_CODE = "auth-action: Begin sending the auth code"
export const ON_COMPLETE_SEND_ACCESS_CODE = "auth-action: Completed sending the auth code"
export const AUTH_FAILED = "auth-action: Failed to authorize"

const beginSendCode = () => ({type: BEGIN_SEND_ACCESS_CODE})
const onCompleteSendCode = () => ({type: ON_COMPLETE_SEND_ACCESS_CODE})
export const authFailed = () => ({type: AUTH_FAILED})

export const sendAccessCode = code => dispatch => {
  dispatch(beginSendCode())
  return axios.post('/spotify-auth/receive-code', JSON.stringify({code: code}))
      .then(res => dispatch(onCompleteSendCode()))
}