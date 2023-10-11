import axios from 'axios';
import {  
  STUDENT_FETCH_ALL, 
  STUDENT_FETCH_ALL_SUCCESS, 
  STUDENT_FETCH_ALL_FAIL, 
  STUDENT_SEARCH_BY_SKILLS, 
  STUDENT_SEARCH_BY_SKILLS_SUCCESS, 
  STUDENT_SEARCH_BY_SKILLS_FAIL } from '../constants/studentConstants';

export const fetchAllStudentsAction = (page, limit) => async (dispatch) => {
  dispatch({ type: STUDENT_FETCH_ALL });
  try {
    const { data } = await axios.get(`/api/students/all?page=${page}&limit=${limit}`);
    dispatch({
      type: STUDENT_FETCH_ALL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: STUDENT_FETCH_ALL_FAIL,
      payload: error.response.data.error,
    });
  }
};

export const searchStudentsBySkills = (skills, page, limit) => async (dispatch) => {
  dispatch({ type: STUDENT_SEARCH_BY_SKILLS });
  try {
    const { data } = await axios.get(`/api/students?skills=${skills}&page=${page}&limit=${limit}`);
    dispatch({
      type: STUDENT_SEARCH_BY_SKILLS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: STUDENT_SEARCH_BY_SKILLS_FAIL,
      payload: error.response.data.error,
    });
  }
};
