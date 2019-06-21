import {REQUEST_TRACKS_WITH_FEATURES, RECEIVE_TRACKS_WITH_FEATURES, REQUEST_TRACKS_SUMMARY,
  RECEIVE_TRACKS_SUMMARY, TOGGLE_SHOW_TRACKS_SUMMARY, SORT_TRACKS_BY, SET_SORT_OBJECT_LIST} from './user-tracks-actions'

const initialState = {
  tracksLoading: true,
  summaryLoading: true,
  showSummary: true
}

function userTracksReducer(state = initialState, {type, payload}) {
  const setProp = (propName) => ({
    ...state,
    [propName]: payload
  })

  switch(type) {
    case REQUEST_TRACKS_WITH_FEATURES: return setProp("tracksLoading")
    case RECEIVE_TRACKS_WITH_FEATURES: 
      return {
        ...state,
        tracksWithFeatures: payload,
        tracksLoading: false
      }
    case REQUEST_TRACKS_SUMMARY: return setProp("summaryLoading")
    case RECEIVE_TRACKS_SUMMARY: 
      return {
        ...state,
        userTracksSummary: payload,
        summaryLoading: false
      }
    case TOGGLE_SHOW_TRACKS_SUMMARY:
      return {
        ...state,
        showSummary: !state.showSummary
      }
    case SORT_TRACKS_BY:
      var desc = !state.sortDescDictionary ||
        state.sortDescDictionary[payload] == null ? true : state.sortDescDictionary[payload]
      return {
        ...state,
        sortObjectList: [{id: payload, desc: desc}],
        sortDescDictionary : {
          [payload]: !desc
        }
      }
    case SET_SORT_OBJECT_LIST: return setProp("sortObjectList")  
    default: return state;
  }
}

export default userTracksReducer

