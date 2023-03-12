import {
  SET_SWAGGER_FEED,
  UPDATE_SWAGGER_FEED,
  UPDATE_SWAGGER_FEED_COMMENT,
  UPDATE_SWAGGER_FEED_TEXT,
  UPDATE_SWAGGER_FEED_DELETE,
  CLEAR_SWAGGER_FEED,
  UPDATE_SWAGGER_FEED_COMMENT_LIKE,
  UPDATE_SWAGGER_FEED_COMMENT_REPLY,
  UPDATE_SWAGGER_COMMENT_MANIPULATE,
  UPDATE_SWAGGER_FOLLOW,
} from "./actionTypes";
import axios from "../../utils/axiosConfig";
import { uiStartLoading, uiStopLoading } from "./ui";
// import CryptoJs from 'crypto-js';
import { socket } from './socket';
import { toast } from 'react-toastify';

export const fetchSwaggerFeed = (token, pageNumber) => {
  const config = {
    headers: { Authorization: "bearer " + token },
  };
  return (dispatch) => {
    dispatch(uiStartLoading());
    return axios
      .get(`/posts/afroswagger?page=${pageNumber}`, config)
      .then((response) => {
        //console.log(response);
        if(!response) {
          toast('something went wrong: ', { type: 'error', position: 'top-center' });
          return;
        }
        dispatch(setFeed(response.data));
        dispatch(uiStopLoading());
        return response;
      })
      .catch((err) => {
        console.log(err);
        dispatch(setFeed({ data: [] }));
        dispatch(uiStopLoading());
      });
  };
};

export const postSwaggerComment = (token, comment, user, feeds) => {
  const config = {
    headers: { Authorization: "bearer " + token },
  };
  return (dispatch) => {
    dispatch(uiStartLoading());
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    socket.emit('postcomment', { comment, user_id: loggedInUser.user_id }, (err, response) => {
      if(err) {
       console.log(err);
       dispatch(uiStopLoading());
       return; 
      }

      const newCommentData = {
        ...response.data,
        commented_by: {
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image_url: user.profile_image_url,
          user_id: user.user_id,
        },
        sub_comments: [],
        my_comment: true,
      };
      //console.log(newCommentData.post_id);
      if (newCommentData.comment_parent_id === 0) {
        dispatch(
          updateSwaggerFeedComment(
            feeds,
            newCommentData.post_id,
            newCommentData
          )
        );
      } else {
        dispatch(
          updateSwaggerFeedCommentReply(
            feeds,
            newCommentData.post_id,
            newCommentData.comment_parent_id,
            newCommentData
          )
        );
      }
      dispatch(uiStopLoading());

    });
    // axios
    //   .post("/comments", comment, config)
    //   .then((response) => {
    //     const newCommentData = {
    //       ...response.data.data,
    //       commented_by: {
    //         first_name: user.first_name,
    //         last_name: user.last_name,
    //         profile_image_url: user.profile_image_url,
    //         user_id: user.user_id,
    //       },
    //       sub_comments: [],
    //       my_comment: true,
    //     };
    //     //console.log(newCommentData.post_id);
    //     if (newCommentData.comment_parent_id === 0) {
    //       dispatch(
    //         updateSwaggerFeedComment(
    //           feeds,
    //           newCommentData.post_id,
    //           newCommentData
    //         )
    //       );
    //     } else {
    //       dispatch(
    //         updateSwaggerFeedCommentReply(
    //           feeds,
    //           newCommentData.post_id,
    //           newCommentData.comment_parent_id,
    //           newCommentData
    //         )
    //       );
    //     }
    //     dispatch(uiStopLoading());
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     dispatch(uiStopLoading());
    //   });
  };
};

export const updateSwaggerFeed = (feeds, id) => {
  return (dispatch) => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex((feed) => feed.post_id === id);
    dispatch(updateFeed(feedIndex));
  };
};

export const updateSwaggerFeedCommentLike = (feeds, id, commentId) => {
  return (dispatch) => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex((feed) => feed.post_id === id);
    let commentIndex = newFeeds[feedIndex].comments.findIndex(
      (feed) => feed.comment_id === commentId
    );
    let commentChildIndex = -1;
    if (commentIndex === -1) {
      const comments = newFeeds[feedIndex].comments;
      for (let index = 0; index < comments.length; index++) {
        let commentSubIndex = comments[index].sub_comments.findIndex(
          (feed) => feed.comment_id === commentId
        );
        if (commentSubIndex !== -1) {
          commentIndex = index;
          commentChildIndex = commentSubIndex;
          break;
        }
      }
    }
    dispatch(updateFeedCommentLike(feedIndex, commentIndex, commentChildIndex));
  };
};

export const updateSwaggerFeedComment = (feeds, id, comment) => {
  return (dispatch) => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex((feed) => feed.post_id === id);
    dispatch(updateFeedComment(feedIndex, comment));
  };
};

export const updateSwaggerFeedCommentReply = (
  feeds,
  id,
  commentId,
  comment
) => {
  return (dispatch) => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex((feed) => feed.post_id === id);
    const commentIndex = newFeeds[feedIndex].comments.findIndex(
      (feed) => feed.comment_id === commentId
    );
    dispatch(updateFeedCommentReply(feedIndex, commentIndex, comment));
  };
};

export const updateSwaggerFeedPostText = (token, feeds, id, text) => {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: "bearer " + token,
      },
    };
    axios
      .put(`/posts/${id}`, { post_text: text }, config)
      .then((response) => {
        //console.log(response);
        const newFeeds = [...feeds];
        const feedIndex = newFeeds.findIndex((feed) => feed.post_id === id);
        dispatch(updateFeedText(feedIndex, text));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const updateSwaggerFeedDelete = (token, feeds, id) => {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: "bearer " + token,
      },
    };
    let url = `/posts/${id}`;
    if (typeof id === "object" && id.hidePost === "hide post") {
      url = `/posts/${id.id}/hide`;
    }
    axios
      .delete(url, config)
      .then((response) => {
        console.log(response);
        const newFeeds = [...feeds];
        const feedIndex = newFeeds.findIndex((feed) => feed.post_id === id);
        dispatch(updateFeedDelete(feedIndex));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const commentManipulateSwagger = (
  token,
  feeds,
  postId,
  commentId,
  comments,
  isEdit,
  text
) => {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: "bearer " + token,
      },
    };
    if (isEdit) {
      axios
        .put(`/comments/${commentId}`, text, config)
        .then((response) => {
          console.log(response);
          const newFeeds = [...feeds];
          const feedIndex = newFeeds.findIndex(
            (feed) => feed.post_id === postId
          );
          const count = response.data.data
            ? response.data.data.comment_count
            : 0;
          dispatch(
            updateSwaggerCommentDelete(feedIndex, comments, "edit", count)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .delete(`/comments/${commentId}`, config)
        .then((response) => {
          console.log(response);
          const newFeeds = [...feeds];
          const feedIndex = newFeeds.findIndex(
            (feed) => feed.post_id === postId
          );
          const count = response.data.data
            ? response.data.data.comment_count
            : 0;
          dispatch(
            updateSwaggerCommentDelete(feedIndex, comments, "delete", count)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
};

const setFeed = (data) => {
  return {
    type: SET_SWAGGER_FEED,
    feed: data.data,
    nextPage: data.nextPage,
  };
};

export const resetSwaggerFeed = () => {
  return {
    type: CLEAR_SWAGGER_FEED,
  };
};

const updateFeed = (index) => {
  return {
    type: UPDATE_SWAGGER_FEED,
    feedIndex: index,
  };
};

const updateFeedComment = (index, comment) => {
  return {
    type: UPDATE_SWAGGER_FEED_COMMENT,
    feedIndex: index,
    comment: comment,
  };
};

const updateFeedCommentReply = (index, commentIndex, comment) => {
  return {
    type: UPDATE_SWAGGER_FEED_COMMENT_REPLY,
    feedIndex: index,
    commentIndex: commentIndex,
    comment: comment,
  };
};

const updateFeedCommentLike = (index, commentIndex, commentChildIndex) => {
  return {
    type: UPDATE_SWAGGER_FEED_COMMENT_LIKE,
    feedIndex: index,
    commentIndex: commentIndex,
    commentChildIndex: commentChildIndex,
  };
};

const updateFeedText = (index, text) => {
  return {
    type: UPDATE_SWAGGER_FEED_TEXT,
    feedIndex: index,
    text: text,
  };
};

const updateFeedDelete = (index) => {
  return {
    type: UPDATE_SWAGGER_FEED_DELETE,
    feedIndex: index,
  };
};

const updateSwaggerCommentDelete = (index, comments, type, count) => {
  return {
    type: UPDATE_SWAGGER_COMMENT_MANIPULATE,
    feedIndex: index,
    comments: comments,
    manipulateType: type,
    count: count,
  };
};

export const updateSwaggerFollow = (id) => {
  return {
    type: UPDATE_SWAGGER_FOLLOW,
    payload: id,
  };
};
