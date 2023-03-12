import {
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  INIT_URL,
  UPDATE_USER_DETAILS,
  AUTH_MOBILE
} from '../actions/actionTypes';

const initialState = {
  token: null,
  user: null,
  initURL: '',
  isMobileRegistration: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        token: action.token,
        user: action.user
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        user: null
      };
    case INIT_URL:
      return {
        ...state,
        initURL: action.payload
      };
    case UPDATE_USER_DETAILS:
      return {
        ...state,
        user: action.user
      };
    case AUTH_MOBILE:
      return {
        ...state,
        isMobileRegistration: action.user
      };
    default: {
      return state;
    }
  }
};

export default reducer;
