import {BEGIN_SEND_ACCESS_CODE, ON_COMPLETE_SEND_ACCESS_CODE, AUTH_FAILED} from './auth-actions'

const initialState = {
  authCompleted: false,
  authFailed: false
}

function authReducer(state = initialState, {type, payload}) {
  switch(type) {
    case BEGIN_SEND_ACCESS_CODE: 
      return {
        ...state,
        authComplete: false
      }
    case ON_COMPLETE_SEND_ACCESS_CODE:
      return {
        ...state,
        authComplete: true
      }
    case AUTH_FAILED:
      return {
        ...state,
        authFailed: true
      }
    default: 
      return state;
  }
}

export default authReducer