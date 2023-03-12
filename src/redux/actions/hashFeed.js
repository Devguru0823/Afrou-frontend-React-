import {
  SET_HASH_FEED,
  UPDATE_HASH_FEED,
  UPDATE_HASH_FEED_COMMENT,
  UPDATE_HASH_FEED_TEXT,
  UPDATE_HASH_FEED_DELETE,
  CLEAR_HASH_FEED,
  UPDATE_HASH_FEED_COMMENT_LIKE,
  UPDATE_HASH_FEED_COMMENT_REPLY,
  UPDATE_HASH_COMMENT_MANIPULATE,
  UPDATE_HASHTAG_FOLLOW
} from './actionTypes';
import axios from '../../utils/axiosConfig';
import {
  uiStartLoading,
  uiStopLoading
} from './ui';
// import { socket } from './socket';
// import CryptoJs from 'crypto-js';

export const fetchHashFeed = (token, pageNumber, hashName) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/posts/hashtag/${hashName}?page=${pageNumber}`, config)
      .then(response => {
        //console.log(response);
        // socket.emit('getEncKeys', {}, (err, obj) => {
        //   if (err) {
        //     console.log(err);
        //     return;
        //   }
        //   const bytesData = CryptoJs.AES.decrypt(response.data.data, obj.k);
        //   const postDetails = JSON.parse(bytesData.toString(CryptoJs.enc.Utf8));
        //   response.data.data = postDetails;
        // });
        dispatch(setFeed(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(setFeed({data: []}));
        dispatch(uiStopLoading());
      });
  }
};


export const postHashComment = (token, comment, user, feeds) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  return dispatch => {
    dispatch(uiStartLoading());
    axios.post('/comments', comment, config)
      .then(response => {
        const newCommentData = {
          ...response.data.data,
          commented_by: {
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image_url: user.profile_image_url,
            user_id: user.user_id
          },
          sub_comments: [],
          my_comment: true
        };
        //console.log(newCommentData.post_id);
        if (newCommentData.comment_parent_id === 0) {
          dispatch(updateHashFeedComment(feeds, newCommentData.post_id, newCommentData));
        } else {
          dispatch(updateHashFeedCommentReply(feeds, newCommentData.post_id, newCommentData.comment_parent_id, newCommentData));
        }
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

export const updateHashFeed = (feeds, id) => {
  return dispatch => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
    dispatch(updateFeed(feedIndex));
  }
};

export const updateHashFeedCommentLike = (feeds, id, commentId) => {
  return dispatch => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
    let commentIndex = newFeeds[feedIndex].comments.findIndex(feed => feed.comment_id === commentId);
    let commentChildIndex = -1;
    if (commentIndex === -1) {
      const comments = newFeeds[feedIndex].comments;
      for (let index = 0; index < comments.length; index++) {
        let commentSubIndex = comments[index].sub_comments.findIndex(feed => feed.comment_id === commentId);
        if (commentSubIndex !== -1) {
          commentIndex = index;
          commentChildIndex = commentSubIndex;
          break;
        }
      }
    }
    dispatch(updateFeedCommentLike(feedIndex, commentIndex, commentChildIndex));
  }
};

export const updateHashFeedComment = (feeds, id, comment) => {
  return dispatch => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
    dispatch(updateFeedComment(feedIndex, comment));
  }
};

export const updateHashFeedCommentReply = (feeds, id, commentId, comment) => {
  return dispatch => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
    const commentIndex = newFeeds[feedIndex].comments.findIndex(feed => feed.comment_id === commentId);
    dispatch(updateFeedCommentReply(feedIndex, commentIndex, comment));
  }
};

export const updateHashFeedPostText = (token, feeds, id, text) => {
  return dispatch => {
    const config = {
      headers: {
        'Authorization': "bearer " + token
      }
    };
    axios.put(`/posts/${id}`, {post_text: text}, config)
      .then(response => {
        //console.log(response);
        const newFeeds = [...feeds];
        const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
        dispatch(updateFeedText(feedIndex, text));
      })
      .catch(err => {
        console.log(err);
      });
  }
};

export const updateHashFeedDelete = (token, feeds, id) => {
  return dispatch => {
    const config = {
      headers: {
        'Authorization': "bearer " + token
      }
    };
    let url = `/posts/${id}`;
    if (typeof id === 'object' && id.hidePost === 'hide post') {
      url = `/posts/${id.id}/hide`;
    }
    axios.delete(url, config)
      .then(response => {
        console.log(response);
        const newFeeds = [...feeds];
        const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
        dispatch(updateFeedDelete(feedIndex));
      })
      .catch(err => {
        console.log(err);
      });
  }
};

export const commentManipulateHash = (token, feeds, postId, commentId, comments, isEdit, text) => {
  return dispatch => {
    const config = {
      headers: {
        'Authorization': "bearer " + token
      }
    };
    if (isEdit) {
      axios.put(`/comments/${commentId}`, text, config)
        .then(response => {
          console.log(response);
          const newFeeds = [...feeds];
          const feedIndex = newFeeds.findIndex(feed => feed.post_id === postId);
          const count = response.data.data ? response.data.data.comment_count : 0;
          dispatch(updateHashCommentDelete(feedIndex, comments, 'edit', count));
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      axios.delete(`/comments/${commentId}`, config)
        .then(response => {
          console.log(response);
          const newFeeds = [...feeds];
          const feedIndex = newFeeds.findIndex(feed => feed.post_id === postId);
          const count = response.data.data ? response.data.data.comment_count : 0;
          dispatch(updateHashCommentDelete(feedIndex, comments, 'delete', count));
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};

const setFeed = data => {
  return {
    type: SET_HASH_FEED,
    feed: data.data,
    nextPage: data.nextPage
  }
};

export const resetHashFeed = () => {
  return {
    type: CLEAR_HASH_FEED
  }
};

const updateFeed = index => {
  return {
    type: UPDATE_HASH_FEED,
    feedIndex: index,
  }
};

const updateFeedComment = (index, comment) => {
  return {
    type: UPDATE_HASH_FEED_COMMENT,
    feedIndex: index,
    comment: comment
  }
};

const updateFeedCommentReply = (index, commentIndex, comment) => {
  return {
    type: UPDATE_HASH_FEED_COMMENT_REPLY,
    feedIndex: index,
    commentIndex: commentIndex,
    comment: comment
  }
};

const updateFeedCommentLike = (index, commentIndex, commentChildIndex) => {
  return {
    type: UPDATE_HASH_FEED_COMMENT_LIKE,
    feedIndex: index,
    commentIndex: commentIndex,
    commentChildIndex: commentChildIndex
  }
};

const updateFeedText = (index, text) => {
  return {
    type: UPDATE_HASH_FEED_TEXT,
    feedIndex: index,
    text: text
  }
};

const updateFeedDelete = index => {
  return {
    type: UPDATE_HASH_FEED_DELETE,
    feedIndex: index
  }
};

const updateHashCommentDelete = (index, comments, type, count) => {
  return {
    type: UPDATE_HASH_COMMENT_MANIPULATE,
    feedIndex: index,
    comments: comments,
    manipulateType: type,
    count: count
  }
};

export const updateHashtagFollow = id => {
  return {
    type: UPDATE_HASHTAG_FOLLOW,
    payload: id
  }
};
