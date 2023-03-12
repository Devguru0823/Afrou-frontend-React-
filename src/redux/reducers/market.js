import {
  RESET_MARKET_ITEM,
  SET_MARKET_FEED,
  SET_MARKET_ITEM
} from '../actions/actionTypes';

const initialState = {
  feed: [],
  item: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MARKET_FEED:
      return {
        ...state,
        feed: action.feed
      };
    case SET_MARKET_ITEM:
      return {
        ...state,
        item: action.feed
      };
      case RESET_MARKET_ITEM:
      return {
        ...state,
        item: {}
      };
    default: {
      return state;
    }
  }
};

export default reducer;
