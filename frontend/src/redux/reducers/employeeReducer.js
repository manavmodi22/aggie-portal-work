import {
  EMPLOYEES_FETCH_BY_COMPANY_NAME,
  EMPLOYEES_FETCH_BY_COMPANY_NAME_SUCCESS,
  EMPLOYEES_FETCH_BY_COMPANY_NAME_FAIL,
} from "../constants/employeeConstants";

const initialState = {
  employees: [],
  currentPage: 1,
  totalPages: 1,
  totalEmployees: 0,
  loading: false,
  error: null,
};

const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case EMPLOYEES_FETCH_BY_COMPANY_NAME:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case EMPLOYEES_FETCH_BY_COMPANY_NAME_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: action.payload.employees,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalEmployees: action.payload.totalEmployees,
      };
    case EMPLOYEES_FETCH_BY_COMPANY_NAME_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default employeeReducer;
