import {SET_FRIENDS} from './actionTypes';
import {uiStartLoading, uiStopLoading} from "./ui";
import axios from "../../utils/axiosConfig";

export const fetchFriends = token => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  let url = '/profile/friends';

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(url, config)
      .then(response => {
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
    type: SET_FRIENDS,
    friends: data.data
  }
};
