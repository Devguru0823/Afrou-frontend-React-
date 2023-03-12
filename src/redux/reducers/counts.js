import {
  SET_COUNT
} from '../actions/actionTypes';

const initialState = {
  notificationCount: null,
  notifications: null,
  navCounters: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUNT:
      return {
        notificationCount: action.counts.notification_count,
        notifications: action.counts.notifications,
        navCounters: action.counts.navCounters
      };
    default: {
      return state;
    }
  }
};

export default reducer;
