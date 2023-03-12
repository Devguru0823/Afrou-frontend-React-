import {
  SET_FOLLOWERS
} from '../actions/actionTypes';

const initialState = {
  followers: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FOLLOWERS:
      return {
        followers: action.followers
      };
    default: {
      return state;
    }
  }
};

export default reducer;
