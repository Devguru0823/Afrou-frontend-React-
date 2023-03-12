import {
  SET_MESSAGES_LIST,
  SET_MESSAGES_DATA,
  RESET_MESSAGES_DATA
} from '../actions/actionTypes';

const initialState = {
  feed: [],
  detail: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGES_LIST:
      return {
        ...state,
        feed: action.feed
      };
    case SET_MESSAGES_DATA:
      if (JSON.stringify(action.detail) !== JSON.stringify(state.detail)) {
        return {
          ...state,
          detail: action.detail
        };
      } else {
        return state;
      }
    case RESET_MESSAGES_DATA:
      return {
        ...state,
        detail: null
      };
    default: {
      return state;
    }
  }
};

export default reducer;
