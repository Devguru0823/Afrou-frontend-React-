import {
  UI_START_LOADING,
  UI_STOP_LOADING,
  SHOW_MESSAGE,
  HIDE_MESSAGE,
  SHOW_SIDEBAR,
  HIDE_SIDEBAR,
  SHOW_RIGHT_SIDEBAR,
  HIDE_RIGHT_SIDEBAR,
  SHOW_SLIDER,
  HIDE_SLIDER
} from "../actions/actionTypes";

const initialState = {
  isLoading: false,
  showMessage: false,
  alertMessage: '',
  showSidebar: false,
  showRightSidebar: false,
  sliderVisible: false,
  selectedPost: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UI_START_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case UI_STOP_LOADING:
      return {
        ...state,
        isLoading: false
      };
    case SHOW_SIDEBAR:
      return {
        ...state,
        showSidebar: true
      };
    case HIDE_SIDEBAR:
      return {
        ...state,
        showSidebar: false
      };
    case SHOW_RIGHT_SIDEBAR:
      return {
        ...state,
        showRightSidebar: true
      };
    case HIDE_RIGHT_SIDEBAR:
      return {
        ...state,
        showRightSidebar: false
      };
    case SHOW_MESSAGE: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessage: true
      }
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        alertMessage: '',
        showMessage: false
      }
    }
    case SHOW_SLIDER: {
      return {
        ...state,
        sliderVisible: true,
        selectedPost: action.payload
      }
    }
    case HIDE_SLIDER: {
      return {
        ...state,
        sliderVisible: false,
        selectedPost: 0
      }
    }
    default:
      return {...state}
  }
};

export default reducer;
