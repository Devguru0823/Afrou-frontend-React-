import {SET_FOLLOWINGS} from './actionTypes';
import {uiStartLoading, uiStopLoading} from "./ui";
import axios from "../../utils/axiosConfig";

export const fetchFollowings = token => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/profile/followings`, config)
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
    type: SET_FOLLOWINGS,
    followings: data.data
  }
};
