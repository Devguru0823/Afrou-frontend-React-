import {
  RESET_MARKET_ITEM,
  SET_MARKET_FEED,
  SET_MARKET_ITEM
} from './actionTypes';
import axios from '../../utils/axiosConfig';
import {
  uiStartLoading,
  uiStopLoading
} from './ui';

export const fetchMarketFeed = (token, searchTerm, category) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };

  let search = '';
  if (searchTerm) {
    search = searchTerm;
  }

  let categoryName = '';
  if (category) {
    categoryName = category;
  }

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/market?search=${search}&category=${categoryName}`, config)
      .then(response => {
        //console.log(response);
        dispatch(setFeed(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(setFeed({data: []}));
        dispatch(uiStopLoading());
      });
  }
};

export const fetchMarketItem = (token, id) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/market/${id}`, config)
      .then(response => {
        //console.log(response);
        dispatch(setItem(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

const setFeed = data => {
  return {
    type: SET_MARKET_FEED,
    feed: data.data
  }
};

const setItem = data => {
  return {
    type: SET_MARKET_ITEM,
    feed: data.data
  }
};

export const resetMarketItem = () => {
  return {
    type: RESET_MARKET_ITEM
  }
};
