import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // Add Redux Thunk middleware if needed
//import companyReducer from './reducers/companyReducer';
import { composeWithDevTools } from '@redux-devtools/extension';
import {employeeReducer} from './reducers/employeeReducer';
import {studentReducer} from './reducers/studentReducer';

// Combine reducers
const rootReducer = combineReducers({
  employee: employeeReducer,
  student: studentReducer,
});

// Apply middleware(s) if needed
let initialState = {};
const middleware = [thunk];

// Create Redux store with combined reducers and middleware
const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
