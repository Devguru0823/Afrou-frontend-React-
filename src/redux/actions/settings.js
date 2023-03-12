import {SET_SETTINGS_DATA} from './actionTypes';
import {uiStartLoading, uiStopLoading, showAlertMessage} from "./ui";
import {updateUserDetails} from "./auth";
import axios from "../../utils/axiosConfig";


export const fetchSettings = token => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get('/profile/settings', config)
      .then(response => {
        dispatch(setSettings(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

export const updateSettings = (token, data, user, isIntro) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };

  return dispatch => {
    dispatch(uiStartLoading());
    axios.put('/profile/settings', data, config)
      .then(response => {
        //console.log(response.data.data);
        dispatch(updateUserDetails(user, response.data.data));
        if (!isIntro) {dispatch(showAlertMessage('Settings updated successfully!'))}
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

const setSettings = data => {
  return {
    type: SET_SETTINGS_DATA,
    settings: data.data
  }
};