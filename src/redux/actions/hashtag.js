import {
  SET_HASHTAG_LIST,
  UPDATE_HASHTAG_LIST,
  RESET_HASHTAG_LIST,
  SET_SUGGESTED_HASHTAGS,
  FOLLOW_START_LOADING,
  FOLLOW_STOP_LOADING,
  RESET_SUGGESTED_HASHTAGS,
  SET_HASHTAG_DETAILS,
  RESET_HASHTAG_DETAILS
} from './actionTypes';
import axios from '../../utils/axiosConfig';
import {
  uiStartLoading,
  uiStopLoading
} from './ui';

export const fetchHashTagList = (token, pageNumber = 1, search) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  const searchQuery = search || '';
  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/hashtags?page=${pageNumber}&search=${searchQuery}`, config)
      .then(response => {
        console.log(response);
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

export const fetchSuggestedHashtags = token => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get('hashtags/trending', config)
      .then(response => {
        //console.log(response);
        dispatch(setSuggestedHashTags(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

const setSuggestedHashTags = data => {
  return {
    type: SET_SUGGESTED_HASHTAGS,
    data: data.data
  }
};

export const fetchHashtagDetails = (token, name) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/hashtags/${name}`, config)
      .then(response => {
        dispatch(setHashTagDetails(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

const setHashTagDetails = data => {
  return {
    type: SET_HASHTAG_DETAILS,
    data: data
  }
};

export const resetHashTagDetails = () => {
  return {
    type: RESET_HASHTAG_DETAILS,
  }
};

export const updateHashTagList = (token, feeds, id, userId) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  const newFeeds = [...feeds];
  const feedIndex = newFeeds.findIndex(feed => feed.hashtag_id === id);
  const hashName = newFeeds[feedIndex].hashtag_slug;
  const type = newFeeds[feedIndex].followed_by_me ? 'unfollow' : 'follow';

  return dispatch => {
    dispatch(followStartLoading(id));
    axios.post(`hashtags/${type}`, {hashtag: hashName}, config)
      .then(() => {
        //console.log(response);
        dispatch(updateFeed(feedIndex, userId));
        dispatch(followStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(followStopLoading());
      });
  };
};

const setFeed = data => {
  return {
    type: SET_HASHTAG_LIST,
    feed: data.data,
    nextPage: data.nextPage
  }
};

export const resetHashTagList = () => {
  return {
    type: RESET_HASHTAG_LIST
  }
};

const updateFeed = (index, userId) => {
  return {
    type: UPDATE_HASHTAG_LIST,
    feedIndex: index,
    userId: userId
  }
};

const followStartLoading = id => {
  return {
    type: FOLLOW_START_LOADING,
    payload: id
  }
};

const followStopLoading = () => {
  return {
    type: FOLLOW_STOP_LOADING
  }
};

export const resetSuggestedHashtags = () => {
  return {
    type: RESET_SUGGESTED_HASHTAGS
  }
};
