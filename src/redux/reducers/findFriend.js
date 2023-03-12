import {
  SET_FIND_FRIENDS,
  RESET_FIND_FRIENDS
} from '../actions/actionTypes';

const initialState = {
  friends: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FIND_FRIENDS:
      return {
        friends: [...action.friends]
      };
    case RESET_FIND_FRIENDS:
      return {
        friends: null
      };
    default: {
      return state;
    }
  }
};

export default reducer;
