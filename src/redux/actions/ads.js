import { SET_ADS } from './actionTypes';
import axios from "../../utils/axiosConfig";

export const fetchAds = token => {
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };
  return dispatch => {
    axios.get(`adverts/mobile-ads`, config)
      .then(response => {
        console.log(response.data.data);
        dispatch(setAds(response.data.data));
      })
      .catch(err => {
        console.log(err);
      });
  }
};

const setAds = ads => {
  return {
    type: SET_ADS,
    ads: ads
  }
};