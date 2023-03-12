import {
  SET_MOST_POPULAR_FEED,
  CLEAR_MOST_POPULAR_FEED,
  SET_POST_DETAILS,
  UPDATE_POST_DETAILS_TEXT,
  CLEAR_POST_DETAIL
} from '../actions/actionTypes';

const initialState = {
  mostPopularFeed: null,
  details: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MOST_POPULAR_FEED:
      return {
        ...state,
        mostPopularFeed: action.feed
      };
    case CLEAR_MOST_POPULAR_FEED:
      return {
        ...state,
        mostPopularFeed: null
      };
    case SET_POST_DETAILS:
      if (JSON.stringify(state.details) !== JSON.stringify(action.details)) {
        return {
          ...state,
          details:
            {
              ...action.details,
              comments: [
                ...action.details.comments
              ]
            }
        };
      }
      return state;
    case UPDATE_POST_DETAILS_TEXT:
      const newDetails = {...state.details};
      newDetails.post_text = action.text;
      return {
        ...state,
        details: newDetails
      };
    case CLEAR_POST_DETAIL:
      return {
        ...state,
        details: null
      };
    default: {
      return state;
    }
  }
};

export default reducer;
