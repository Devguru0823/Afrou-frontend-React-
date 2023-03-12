import {
  CLEAR_HASH_FEED,
  SET_HASH_FEED,
  UPDATE_HASH_FEED,
  UPDATE_HASH_FEED_COMMENT,
  UPDATE_HASH_FEED_DELETE,
  UPDATE_HASH_FEED_TEXT,
  UPDATE_HASH_FEED_COMMENT_LIKE,
  UPDATE_HASH_FEED_COMMENT_REPLY,
  UPDATE_HASH_COMMENT_MANIPULATE,
  UPDATE_HASHTAG_FOLLOW
} from '../actions/actionTypes';

const initialState = {
  feed: [],
  nextPage: null,
  hasMorePage: true
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HASH_FEED:
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
    case UPDATE_HASH_FEED:
      const feed = state.feed[action.feedIndex];
      feed.liked = !feed.liked;
      feed.like_count = feed.liked ? feed.like_count + 1 : feed.like_count - 1;
      return state;
    case UPDATE_HASH_FEED_COMMENT:
      const commentfeed = state.feed[action.feedIndex];
      //console.log(commentfeed);
      commentfeed.comments.unshift(action.comment);
      commentfeed.comment_count = commentfeed.comment_count + 1;
      return state;
    case UPDATE_HASH_FEED_COMMENT_REPLY:
      const commentfeedReply = state.feed[action.feedIndex];
      commentfeedReply.comments[action.commentIndex].sub_comments.unshift(action.comment);
      commentfeedReply.comment_count = commentfeedReply.comment_count + 1;
      return state;
    case UPDATE_HASH_FEED_COMMENT_LIKE:
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
    case CLEAR_HASH_FEED:
      return {
        ...state,
        feed: [],
        hasMorePage: true,
        nextPage: null
      };
    case UPDATE_HASH_FEED_TEXT:
      const textFeed = [...state.feed];
      const singleFeed = {...state.feed[action.feedIndex], post_text: action.text};
      textFeed.splice(action.feedIndex, 1, singleFeed);
      return {
        ...state,
        feed: textFeed
      };
    case UPDATE_HASH_FEED_DELETE:
      const deleteFeed = [...state.feed];
      deleteFeed.splice(action.feedIndex, 1);
      return {
        ...state,
        feed: deleteFeed
      };
    case UPDATE_HASH_COMMENT_MANIPULATE:
      const newCommentFeed = [...state.feed];
      newCommentFeed[action.feedIndex].comments = [...action.comments];
      if (action.manipulateType === 'delete') {
        newCommentFeed[action.feedIndex].comment_count = action.count;
      }
      return {
        ...state,
        feed: newCommentFeed
      };
    case UPDATE_HASHTAG_FOLLOW:
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
