import {
  SET_ENTERTAINMENT_LIST,
  RESET_ENTERTAINMENT_LIST,
  ENTERTAINMENT_LOADING_START,
  ENTERTAINMENT_LOADING_END
} from '../actions/actionTypes';

const initialState = {
  feed: [],
  nextPage: null,
  hasMorePage: true,
  isLoading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ENTERTAINMENT_LIST:
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
    case RESET_ENTERTAINMENT_LIST:
      return {
        ...state,
        feed: [],
        hasMorePage: true,
        nextPage: null
      };
    case ENTERTAINMENT_LOADING_START:
      return {
        ...state,
        isLoading: true
      };
    case ENTERTAINMENT_LOADING_END:
      return {
        ...state,
        isLoading: false
      };
    default: {
      return state;
    }
  }
};

export default reducer;
