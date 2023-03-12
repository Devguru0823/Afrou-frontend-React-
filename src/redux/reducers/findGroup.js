import {
  SET_FIND_GROUPS,
  RESET_FIND_GROUPS
} from '../actions/actionTypes';

const initialState = {
  groups: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FIND_GROUPS:
      return {
        groups: [...action.groups]
      };
    case RESET_FIND_GROUPS:
      return {
        groups: null
      };
    default: {
      return state;
    }
  }
};

export default reducer;
