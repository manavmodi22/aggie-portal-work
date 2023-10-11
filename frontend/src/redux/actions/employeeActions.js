import axios from 'axios';
import {
  EMPLOYEES_FETCH_BY_COMPANY_NAME,
  EMPLOYEES_FETCH_BY_COMPANY_NAME_SUCCESS,
  EMPLOYEES_FETCH_BY_COMPANY_NAME_FAIL,
} from '../constants/employeeConstants';

export const fetchEmployeesByCompanyNameAction = (companyName, page, limit) => async (dispatch) => {
  dispatch({ type: EMPLOYEES_FETCH_BY_COMPANY_NAME });
  try {
    const { data } = await axios.get(`/api/employees/company/${companyName}?page=${page}&limit=${limit}`);
    dispatch({
      type: EMPLOYEES_FETCH_BY_COMPANY_NAME_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: EMPLOYEES_FETCH_BY_COMPANY_NAME_FAIL,
      payload: error.response.data.error,
    });
  }
};
