import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import userTracksReducer from './user-tracks/user-tracks-reducers'
import authReducer from './auth/auth-reducers'

const baseReducer = combineReducers({
  authState: authReducer,
  userTracksState: userTracksReducer
})

const store = createStore(
  baseReducer,
  {},
  compose(
    applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      createLogger() // neat middleware that logs actions
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store 