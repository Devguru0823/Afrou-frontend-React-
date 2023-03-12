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
} from "./actionTypes";

export const uiStartLoading = () => {
  return {
    type: UI_START_LOADING
  };
};

export const uiStopLoading = () => {
  return {
    type: UI_STOP_LOADING
  };
};

export const uiShowSidebar = () => {
  return {
    type: SHOW_SIDEBAR
  };
};

export const uiHideSidebar = () => {
  return {
    type: HIDE_SIDEBAR
  };
};

export const uiShowRightSidebar = () => {
  return {
    type: SHOW_RIGHT_SIDEBAR
  };
};

export const uiHideRightSidebar = () => {
  return {
    type: HIDE_RIGHT_SIDEBAR
  };
};

export const showAlertMessage = message => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};

export const hideAlertMessage = () => {
  return {
    type: HIDE_MESSAGE,
  };
};

export const showSlider = selectedPost => {
  return {
    type: SHOW_SLIDER,
    payload: selectedPost || 0
  }
};

export const hideSlider = () => {
  return {
    type: HIDE_SLIDER
  }
};
