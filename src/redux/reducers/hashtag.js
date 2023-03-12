import {
  RESET_HASHTAG_LIST,
  SET_HASHTAG_LIST,
  SET_SUGGESTED_HASHTAGS,
  RESET_SUGGESTED_HASHTAGS,
  UPDATE_HASHTAG_LIST,
  FOLLOW_START_LOADING,
  FOLLOW_STOP_LOADING,
  SET_HASHTAG_DETAILS,
  RESET_HASHTAG_DETAILS
} from '../actions/actionTypes';

const initialState = {
  feed: [],
  nextPage: null,
  hasMorePage: true,
  suggestedHashTags: null,
  followLoading: false,
  hashtagDetails: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HASHTAG_LIST:
      if (action.feed.length === 0) {
        return {
          ...state,
          hasMorePage: false
        }
      }
      return {
        ...state,
        feed: state.nextPage !== action.nextPage ?
          [...state.feed, ...action.feed] :
          state.feed,
        nextPage: action.nextPage,
      };
    case UPDATE_HASHTAG_LIST:
      const newState = {...state};
      const newFeed = {
        ...state.feed[action.feedIndex],
        followed_by_me: !state.feed[action.feedIndex].followed_by_me,
        followers: state.feed[action.feedIndex].followed_by_me
          ? state.feed[action.feedIndex].followers.filter(elem => elem !== action.userId)
          : [...state.feed[action.feedIndex].followers, action.userId]
      };
      newState.feed[action.feedIndex] = newFeed;
      return JSON.parse(JSON.stringify(newState));
    case RESET_HASHTAG_LIST:
      return {
        ...state,
        feed: [],
        hasMorePage: true,
        nextPage: null
      };
    case FOLLOW_START_LOADING:
      return {
        ...state,
        followLoading: action.payload
      };
    case FOLLOW_STOP_LOADING:
      return {
        ...state,
        followLoading: false
      };
    case SET_SUGGESTED_HASHTAGS:
      return {
        ...state,
        suggestedHashTags: action.data
      };
    case RESET_SUGGESTED_HASHTAGS:
      return {
        ...state,
        suggestedHashTags: null
      };
    case SET_HASHTAG_DETAILS:
      return {
        ...state,
        hashtagDetails: action.data
      };
    case RESET_HASHTAG_DETAILS:
      return {
        ...state,
        hashtagDetails: null
      };
    default: {
      return state;
    }
  }
};

export default reducer;
