// import axios from 'axios';
// import {
//   COMPANY_CREATE,
//   COMPANY_CREATE_SUCCESS,
//   COMPANY_CREATE_FAIL,
//   COMPANY_FETCH_ALL,
//   COMPANY_FETCH_ALL_SUCCESS,
//   COMPANY_FETCH_ALL_FAIL,
//   COMPANY_UPDATE,
//   COMPANY_UPDATE_SUCCESS,
//   COMPANY_UPDATE_FAIL,
//   COMPANY_DELETE,
//   COMPANY_DELETE_SUCCESS,
//   COMPANY_DELETE_FAIL,
//   COMPANY_RESET,
// } from '../constants/companyConstants';

// // Create a new company
// export const createCompany = (companyData) => async (dispatch) => {
//   try {
//     const { data } = await axios.post('/api/companies', companyData);
//     dispatch({
//       type: COMPANY_CREATE_SUCCESS,
//       payload: data,
//     });
//   } catch (error) {
//     dispatch({
//       type: COMPANY_CREATE_FAIL,
//       payload: error.response.data.error,
//     });
//   }
// };

// // Fetch all companies
// export const fetchAllCompanies = () => async (dispatch) => {
//   dispatch({ type: COMPANY_FETCH_ALL });
//   try {
//     const { data } = await axios.get('/api/companies');
//     dispatch({
//       type: COMPANY_FETCH_ALL_SUCCESS,
//       payload: data,
//     });
//   } catch (error) {
//     dispatch({
//       type: COMPANY_FETCH_ALL_FAIL,
//       payload: error.response.data.error,
//     });
//   }
// };

// // Update a company by ID
// export const updateCompany = (companyId, companyData) => async (dispatch) => {
//   try {
//     const { data } = await axios.put(`/api/companies/${companyId}`, companyData);
//     dispatch({
//       type: COMPANY_UPDATE_SUCCESS,
//       payload: { companyId, companyData: data },
//     });
//   } catch (error) {
//     dispatch({
//       type: COMPANY_UPDATE_FAIL,
//       payload: error.response.data.error,
//     });
//   }
// };

// // Delete a company by ID
// export const deleteCompany = (companyId) => async (dispatch) => {
//   try {
//     await axios.delete(`/api/companies/${companyId}`);
//     dispatch({
//       type: COMPANY_DELETE_SUCCESS,
//       payload: companyId,
//     });
//   } catch (error) {
//     dispatch({
//       type: COMPANY_DELETE_FAIL,
//       payload: error.response.data.error,
//     });
//   }
// };

// // Reset company state
// export const resetCompany = () => ({
//   type: COMPANY_RESET,
// });
