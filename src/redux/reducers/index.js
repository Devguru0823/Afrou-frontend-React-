import {combineReducers} from "redux";

import {AUTH_LOGOUT} from '../actions/actionTypes';
import Auth from './auth';
import UI from './ui';
import SwaggerFeed from './swaggerFeed';
import TalentFeed from './talentFeed';
import Profile from './profile';
import Friend from './friend';
import Follower from './follower';
import Following from './following';
import CommonFeed from './commonFeed';
import Settings from './settings';
import Market from './market';
import Count from './counts';
import Message from './messages';
import Group from './group';
import FindFriend from './findFriend';
import FindGroup from './findGroup';
import Ads from './ads';
import Hash from './hashtag';
import HashDetails from './hashFeed';
import Entertainment from './entertainment';
import axios from "../../utils/axiosConfig";

const appReducer = combineReducers({
  auth: Auth,
  ui: UI,
  swaggerFeed: SwaggerFeed,
  talentFeed: TalentFeed,
  profile: Profile,
  friend: Friend,
  follower: Follower,
  following: Following,
  commonFeed: CommonFeed,
  settings: Settings,
  market: Market,
  count: Count,
  message: Message,
  group: Group,
  findFriend: FindFriend,
  findGroup: FindGroup,
  ads: Ads,
  hash: Hash,
  hashFeed: HashDetails,
  entertainment: Entertainment
});

const rootReducer = (state, action) => {
  if (action.type === AUTH_LOGOUT) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {'Authorization': "Bearer " + token}
    };
    axios.get('/users/logout', config);
    localStorage.clear()
    state = undefined;
    window.location.href = '/';
  }
  return appReducer(state, action)
};

export default rootReducer;
