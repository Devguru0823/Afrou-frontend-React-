import {SET_FIND_FRIENDS, RESET_FIND_FRIENDS} from './actionTypes';
import {uiStartLoading, uiStopLoading} from "./ui";
import axios from "../../utils/axiosConfig";

export const fetchFindFriends = (token, term) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  let searchTerm = '';
  if (term) {
    searchTerm = term
  }
  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/profile/find-friends?search=${searchTerm}`, config)
      .then(response => {
        console.log(response);
        dispatch(setFriends(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

const setFriends = data => {
  return {
    type: SET_FIND_FRIENDS,
    friends: data.data
  }
};

export const resetFindFriends = () => {
  return {
    type: RESET_FIND_FRIENDS
  }
};