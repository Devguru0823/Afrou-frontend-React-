import {
  SET_SETTINGS_DATA
} from "../actions/actionTypes";

const initialState = {
  settings: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SETTINGS_DATA:
      return {
        ...state,
        settings: action.settings
      };
    default: {
      return state;
    }
  }
};

export default reducer;