import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import userTracksReducer from './user-tracks/user-tracks-reducers'

const reducerTest = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_VALS':
      return {"val1": action.vals[0], "val2": action.vals[1]}
    default: 
      return state
  }
}

const baseReducer = combineReducers({
  testVals: reducerTest, 
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