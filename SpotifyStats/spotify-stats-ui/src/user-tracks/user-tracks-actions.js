import axios from "../services/axios-service"

export const REQUEST_TRACKS_WITH_FEATURES = "user-tracks:Request Tracks With Features";
export const RECEIVE_TRACKS_WITH_FEATURES = "user-tracks:Receive Tracks With Features";

export const REQUEST_TRACKS_SUMMARY = "user-tracks:Request User Summary";
export const RECEIVE_TRACKS_SUMMARY = "user-tracks:Receive User Summary";
export const TOGGLE_SHOW_TRACKS_SUMMARY = "user-tracks:Toggle Show User Summary";

export const SORT_TRACKS_BY = "user-tracks:Sort Tracks By"
export const SET_SORT_OBJECT_LIST = "user-tracks:Set Sorted Object List"

const basicActionCreator = (type) => payload => ({type, payload}) 

const requestTracksWithFeatures = () => ({type: REQUEST_TRACKS_WITH_FEATURES})
const receiveTracksWithFeatures = basicActionCreator(RECEIVE_TRACKS_WITH_FEATURES)
export const fetchTracksWithFeatures = () => dispatch => {
  dispatch(requestTracksWithFeatures())
  return axios.get(`/spotify/user-tracks`)
    .then(json => dispatch(receiveTracksWithFeatures(json.data)))
}

const requestTracksSummary = () => ({type: REQUEST_TRACKS_SUMMARY})
const receiveTracksSummary = basicActionCreator(RECEIVE_TRACKS_SUMMARY)
export const fetchTracksSummary = () => dispatch => {
  dispatch(requestTracksSummary())
  return axios.get(`/spotify/tracks-summary`)
    .then(json => dispatch(receiveTracksSummary(json.data)))
}
export const toggleTracksSummary = () => ({ type: TOGGLE_SHOW_TRACKS_SUMMARY })

export const sortTracksBy = basicActionCreator(SORT_TRACKS_BY)
export const setSortObjectList = basicActionCreator(SET_SORT_OBJECT_LIST) //Needed for React-Table
