import {
  SET_OWN_GROUPS,
  SET_OTHER_GROUPS,
  SET_GROUP_FEED,
  UPDATE_GROUP_FEED,
  UPDATE_GROUP_FEED_COMMENT,
  CLEAR_GROUP_FEED,
  UPDATE_GROUP_FEED_TEXT,
  UPDATE_GROUP_FEED_DELETE,
  RESET_GROUP_FEED,
  SET_GROUP_DETAILS,
  SET_INVITATION_LIST,
  SET_GROUP_INVITATIONS,
  UPDATE_GROUP_FEED_COMMENT_LIKE,
  UPDATE_GROUP_FEED_COMMENT_REPLY,
  UPDATE_GROUP_COMMENT_MANIPULATE,
  CLEAR_GROUP_DETAILS,
  SET_GROUP_ID, REMOVE_GROUP_ID,
  UPDATE_GROUP_FOLLOW
} from '../actions/actionTypes';

const initialState = {
  ownGroups: [],
  otherGroups: [],
  groupInvitations: [],
  feed: [],
  hasMorePage: true,
  nextPage: null,
  groupDetail: null,
  inviteList: null,
  groupId: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_OWN_GROUPS:
      return {
        ...state,
        ownGroups: action.data
      };
    case SET_OTHER_GROUPS:
      return {
        ...state,
        otherGroups: action.data
      };
    case SET_GROUP_INVITATIONS:
      return {
        ...state,
        groupInvitations: action.data
      };
    case SET_GROUP_FEED:
      if (action.feed.length === 0) {
        return {
          ...state,
          hasMorePage: false
        }
      }
      return {
        ...state,
        feed: state.nextPage !== action.nextPage ?
          [...state.feed, ...action.feed] :
          state.feed,
        nextPage: action.nextPage,
      };
    case UPDATE_GROUP_FEED:
      const feed = state.feed[action.feedIndex];
      feed.liked = !feed.liked;
      feed.like_count = feed.liked ? feed.like_count + 1 : feed.like_count - 1;
      return state;
    case UPDATE_GROUP_FEED_COMMENT:
      const commentfeed = state.feed[action.feedIndex];
      //console.log(commentfeed);
      commentfeed.comments.unshift(action.comment);
      commentfeed.comment_count = commentfeed.comment_count + 1;
      return state;
    case UPDATE_GROUP_FEED_COMMENT_REPLY:
      const commentfeedReply = state.feed[action.feedIndex];
      commentfeedReply.comments[action.commentIndex].sub_comments.unshift(action.comment);
      commentfeedReply.comment_count = commentfeedReply.comment_count + 1;
      return state;
    case UPDATE_GROUP_FEED_COMMENT_LIKE:
      const newState = {...state};
      const newFeed = [...newState.feed];
      const newComments = [...newFeed[action.feedIndex].comments];
      let commentfeedLikes = newComments[action.commentIndex];
      if (action.commentChildIndex !== -1) {
        commentfeedLikes = commentfeedLikes.sub_comments[action.commentChildIndex];
        newFeed[action.feedIndex].comments[action.commentIndex].sub_comments[action.commentChildIndex] = {
          ...commentfeedLikes,
          liked: commentfeedLikes.liked !== true
        };
        return {
          ...state,
          feed: [...newFeed]
        };
      }
      newFeed[action.feedIndex].comments[action.commentIndex] = {
        ...commentfeedLikes,
        liked: commentfeedLikes.liked !== true
      };
      return {
        ...state,
        feed: [...newFeed]
      };
    case CLEAR_GROUP_FEED:
      return {
        ...state,
        feed: [],
        hasMorePage: true,
        nextPage: null,
      };
    case CLEAR_GROUP_DETAILS:
      return {
        ...state,
        inviteList: null,
        groupDetail: null
      };
    case UPDATE_GROUP_FEED_TEXT:
      const textFeed = [...state.feed];
      const singleFeed = {...state.feed[action.feedIndex], post_text: action.text};
      textFeed.splice(action.feedIndex, 1, singleFeed);
      return {
        ...state,
        feed: textFeed
      };
    case UPDATE_GROUP_FEED_DELETE:
      const deleteFeed = [...state.feed];
      deleteFeed.splice(action.feedIndex, 1);
      return {
        ...state,
        feed: deleteFeed
      };
    case RESET_GROUP_FEED:
      return {
        ...state,
        feed: [],
        hasMorePage: true,
        nextPage: null
      };
    case SET_GROUP_DETAILS:
      return {
        ...state,
        groupDetail: action.data
      };
    case SET_INVITATION_LIST:
      return {
        ...state,
        inviteList: action.data
      };
    case UPDATE_GROUP_COMMENT_MANIPULATE:
      const newCommentFeed = [...state.feed];
      newCommentFeed[action.feedIndex].comments = [...action.comments];
      if (action.manipulateType === 'delete') {
        newCommentFeed[action.feedIndex].comment_count = action.count;
      }
      return {
        ...state,
        feed: newCommentFeed
      };
    case SET_GROUP_ID: {
      return {
        ...state,
        groupId: action.groupId
      }
    }
    case REMOVE_GROUP_ID: {
      return {
        ...state,
        groupId: null
      }
    }
    case UPDATE_GROUP_FOLLOW:
      const swaggerFollowFeed = [...state.feed];
      const newSwaggerFollowFeed = swaggerFollowFeed.map(feed => {
        const newFeed = {...feed};
        if (newFeed.user_id === action.payload) {
          newFeed.following = !newFeed.following;
          return newFeed;
        } else {
          return newFeed;
        }
      });
      return {
        ...state,
        feed: newSwaggerFollowFeed
      };
    default: {
      return state;
    }
  }
};

export default reducer;