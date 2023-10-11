import {
    STUDENT_FETCH_ALL,
    STUDENT_FETCH_ALL_SUCCESS,
    STUDENT_FETCH_ALL_FAIL,
    STUDENT_SEARCH_BY_SKILLS,
    STUDENT_SEARCH_BY_SKILLS_SUCCESS,
    STUDENT_SEARCH_BY_SKILLS_FAIL,
  } from '../actions/actionTypes';
  
  const initialState = {
    students: [],
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    loading: false,
    error: null,
  };
  
  const studentReducer = (state = initialState, action) => {
    switch (action.type) {
      case STUDENT_FETCH_ALL:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case STUDENT_FETCH_ALL_SUCCESS:
        return {
          ...state,
          loading: false,
          students: action.payload.students,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalStudents: action.payload.totalStudents,
        };
      case STUDENT_FETCH_ALL_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case STUDENT_SEARCH_BY_SKILLS:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case STUDENT_SEARCH_BY_SKILLS_SUCCESS:
        return {
          ...state,
          loading: false,
          students: action.payload.students,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalStudents: action.payload.totalStudents,
        };
      case STUDENT_SEARCH_BY_SKILLS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default studentReducer;
  
  