import {SET_FIND_GROUPS, RESET_FIND_GROUPS} from './actionTypes';
import {uiStartLoading, uiStopLoading} from "./ui";
import axios from "../../utils/axiosConfig";

export const fetchFindGroups = (token, term) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  let searchTerm = '';
  if (term) {
    searchTerm = term
  }
  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/groups/find?search=${searchTerm}`, config)
      .then(response => {
        console.log(response.data.data);
        dispatch(setGroups(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

const setGroups = data => {
  return {
    type: SET_FIND_GROUPS,
    groups: data.data
  }
};

export const resetFindGroups = () => {
  return {
    type: RESET_FIND_GROUPS
  }
};