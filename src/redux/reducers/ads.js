import {
  SET_ADS
} from '../actions/actionTypes';

const initialState = {
  ads: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ADS:
      return {
        ...state,
        ads: [...action.ads]
      };
    default: {
      return state;
    }
  }
};

export default reducer;
