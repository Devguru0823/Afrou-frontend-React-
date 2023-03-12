import {SET_FOLLOWERS} from './actionTypes';
import {uiStartLoading, uiStopLoading} from "./ui";
import axios from "../../utils/axiosConfig";

export const fetchFollowers = (token, type) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  let url = '/profile/followers';
  if (type === 'requestList') {
    url = '/profile/follow-requests'
  }
  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(url, config)
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
    type: SET_FOLLOWERS,
    followers: data.data
  }
};
