import {
  ENTERTAINMENT_LOADING_START,
  ENTERTAINMENT_LOADING_END,
  RESET_ENTERTAINMENT_LIST,
  SET_ENTERTAINMENT_LIST
} from './actionTypes';
import axios from '../../utils/axiosConfig';

export const fetchEntertainmentList = (token, pageNumber = 1) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  return dispatch => {
    dispatch(entertainmentLoadingStart());
    axios.get(`/posts/entertainment?page=${pageNumber}`, config)
      .then(response => {
        console.log(response);
        dispatch(setFeed(response.data));
        dispatch(entertainmentLoadingEnd());
      })
      .catch(err => {
        console.log(err);
        dispatch(setFeed({data: []}));
        dispatch(entertainmentLoadingEnd());
      });
  }
};

const setFeed = data => {
  return {
    type: SET_ENTERTAINMENT_LIST,
    feed: data.data,
    nextPage: data.nextPage
  }
};

export const resetEntertainmentList = () => {
  return {
    type: RESET_ENTERTAINMENT_LIST
  }
};

export const entertainmentLoadingStart = () => {
  return {
    type: ENTERTAINMENT_LOADING_START
  }
};

export const entertainmentLoadingEnd = () => {
  return {
    type: ENTERTAINMENT_LOADING_END
  }
};
