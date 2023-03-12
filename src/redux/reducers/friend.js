import {
  SET_FRIENDS
} from '../actions/actionTypes';

const initialState = {
  friends: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FRIENDS:
      return {
        friends: action.friends
      };
    default: {
      return state;
    }
  }
};

export default reducer;
