import {
  SET_PROFILE_DETAILS,
  SET_PROFILE_FEED,
  UPDATE_PROFILE_FEED,
  CLEAR_PROFILE_FEED,
  UPDATE_PROFILE_FEED_COMMENT,
  SET_PROFILE_IMAGES,
  SET_SUGGESTED_FRIENDS,
  UPDATE_PROFILE_FEED_TEXT,
  UPDATE_PROFILE_FEED_DELETE,
  UPDATE_PROFILE_FEED_COMMENT_LIKE,
  UPDATE_PROFILE_FEED_COMMENT_REPLY,
  UPDATE_PROFILE_COMMENT_MANIPULATE,
  CLEAR_PROFILE_DETAIL,
  UPDATE_PROFILE_FOLLOW
} from '../actions/actionTypes';

const initialState = {
  feed: [],
  profileDetails: {},
  nextPage: null,
  hasMorePage: true,
  images: undefined,
  suggestedFriends: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE_FEED:
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
    case SET_PROFILE_IMAGES:
      return {
        ...state,
        images: action.images
      };
    case UPDATE_PROFILE_FEED:
      const feed = state.feed[action.feedIndex];
      feed.liked = !feed.liked;
      feed.like_count = feed.liked ? feed.like_count + 1 : feed.like_count - 1;
      return state;
    case UPDATE_PROFILE_FEED_COMMENT:
      const commentfeed = state.feed[action.feedIndex];
      //console.log(commentfeed);
      commentfeed.comments.unshift(action.comment);
      commentfeed.comment_count = commentfeed.comment_count + 1;
      return state;
    case UPDATE_PROFILE_FEED_COMMENT_REPLY:
      const commentfeedReply = state.feed[action.feedIndex];
      commentfeedReply.comments[action.commentIndex].sub_comments.unshift(action.comment);
      commentfeedReply.comment_count = commentfeedReply.comment_count + 1;
      return state;
    case UPDATE_PROFILE_FEED_COMMENT_LIKE:
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
    case SET_PROFILE_DETAILS:
      return {
        ...state,
        profileDetails: action.profileData
      };
    case SET_SUGGESTED_FRIENDS:
      return {
        ...state,
        suggestedFriends: action.data
      };
    case CLEAR_PROFILE_FEED:
      return {
        ...state,
        feed: [],
        hasMorePage: true,
        nextPage: null,
        images: undefined
      };
    case CLEAR_PROFILE_DETAIL:
      return {
        ...state,
        profileDetails: {}
      };
    case UPDATE_PROFILE_FEED_TEXT:
      const textFeed = [...state.feed];
      const singleFeed = {...state.feed[action.feedIndex], post_text: action.text};
      textFeed.splice(action.feedIndex, 1, singleFeed);
      return {
        ...state,
        feed: textFeed
      };
    case UPDATE_PROFILE_FEED_DELETE:
      const deleteFeed = [...state.feed];
      deleteFeed.splice(action.feedIndex, 1);
      return {
        ...state,
        feed: deleteFeed
      };
    case UPDATE_PROFILE_COMMENT_MANIPULATE:
      const newCommentFeed = [...state.feed];
      newCommentFeed[action.feedIndex].comments = [...action.comments];
      if (action.manipulateType === 'delete') {
        newCommentFeed[action.feedIndex].comment_count = newCommentFeed[action.feedIndex].comment_count - 1;
      }
      return {
        ...state,
        feed: newCommentFeed
      };
    case UPDATE_PROFILE_FOLLOW:
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
