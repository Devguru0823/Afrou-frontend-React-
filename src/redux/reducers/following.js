import {
  SET_FOLLOWINGS
} from '../actions/actionTypes';

const initialState = {
  followings: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FOLLOWINGS:
      return {
        followings: action.followings
      };
    default: {
      return state;
    }
  }
};

export default reducer;
