// import {
//     COMPANY_CREATE,
//     COMPANY_CREATE_SUCCESS,
//     COMPANY_CREATE_FAIL,
//     COMPANY_FETCH_ALL,
//     COMPANY_FETCH_ALL_SUCCESS,
//     COMPANY_FETCH_ALL_FAIL,
//     COMPANY_UPDATE,
//     COMPANY_UPDATE_SUCCESS,
//     COMPANY_UPDATE_FAIL,
//     COMPANY_DELETE,
//     COMPANY_DELETE_SUCCESS,
//     COMPANY_DELETE_FAIL,
//     COMPANY_RESET,
//   } from '../actions/actionTypes';
  
//   const initialState = {
//     companies: [], // Store a list of companies
//     loading: false, // Indicates whether an async operation is in progress
//     error: null, // Stores error messages in case of failure
//   };
  
//   const companyReducer = (state = initialState, action) => {
//     switch (action.type) {
//       case COMPANY_CREATE:
//       case COMPANY_FETCH_ALL:
//       case COMPANY_UPDATE:
//       case COMPANY_DELETE:
//         return {
//           ...state,
//           loading: true,
//           error: null,
//         };
  
//       case COMPANY_CREATE_SUCCESS:
//         return {
//           ...state,
//           loading: false,
//           companies: [...state.companies, action.payload],
//         };
  
//       case COMPANY_FETCH_ALL_SUCCESS:
//         return {
//           ...state,
//           loading: false,
//           companies: action.payload,
//         };
  
//       case COMPANY_UPDATE_SUCCESS:
//         const updatedCompanies = state.companies.map((company) =>
//           company.companyID === action.payload.companyId
//             ? { ...company, ...action.payload.companyData }
//             : company
//         );
  
//         return {
//           ...state,
//           loading: false,
//           companies: updatedCompanies,
//         };
  
//       case COMPANY_DELETE_SUCCESS:
//         const remainingCompanies = state.companies.filter(
//           (company) => company.companyID !== action.payload
//         );
  
//         return {
//           ...state,
//           loading: false,
//           companies: remainingCompanies,
//         };
  
//       case COMPANY_CREATE_FAIL:
//       case COMPANY_FETCH_ALL_FAIL:
//       case COMPANY_UPDATE_FAIL:
//       case COMPANY_DELETE_FAIL:
//         return {
//           ...state,
//           loading: false,
//           error: action.payload,
//         };
  
//       case COMPANY_RESET:
//         return {
//           ...initialState,
//         };
  
//       default:
//         return state;
//     }
//   };
  
//   export default companyReducer;
  