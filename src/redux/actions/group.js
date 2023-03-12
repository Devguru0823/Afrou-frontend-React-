import {
  SET_OWN_GROUPS,
  SET_OTHER_GROUPS,
  SET_GROUP_FEED,
  UPDATE_GROUP_FEED,
  CLEAR_GROUP_FEED,
  UPDATE_GROUP_FEED_COMMENT,
  UPDATE_GROUP_FEED_TEXT,
  UPDATE_GROUP_FEED_DELETE,
  SET_GROUP_DETAILS,
  SET_INVITATION_LIST,
  SET_GROUP_INVITATIONS,
  UPDATE_GROUP_FEED_COMMENT_LIKE,
  UPDATE_GROUP_FEED_COMMENT_REPLY,
  UPDATE_GROUP_COMMENT_MANIPULATE,
  CLEAR_GROUP_DETAILS,
  SET_GROUP_ID,
  REMOVE_GROUP_ID, UPDATE_GROUP_FOLLOW,

} from './actionTypes';
import {uiStartLoading, uiStopLoading} from "./ui";
import axios from "../../utils/axiosConfig";

export const createNewGroup = (token, data, type) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  return dispatch => {
    dispatch(uiStartLoading());
    axios.post(`/groups`, data, config)
      .then(response => {
        console.log(response);
        if (type) {
          dispatch(setGroupId(response.data.data.group_id));
        }
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

export const fetchGroups = (token, type) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  let url = '/groups/my-groups';
  if (type === 'other') {
    url = '/groups/my-joined-groups'
  }
  if (type === 'invitations') {
    url = '/groups/my-invited-groups'
  }
  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(url, config)
      .then(response => {
        console.log(response.data);
        type === 'own' ?
          dispatch(setOwnGroups(response.data)) :
          type === 'invitations' ?
            dispatch(setGroupInvitations(response.data)) :
            dispatch(setOtherGroups(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

export const fetchGroupData = (token, id) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/groups/${id}`, config)
      .then(response => {
        console.log(response.data);
        dispatch(setGroupDetails(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

export const postGroupImage = (token, file, id, type) => {
  const config = {
    'headers': {'Authorization': "bearer " + token},
    'content-type': 'multipart/form-data'
  };
  return dispatch => {
    dispatch(uiStartLoading());
    const formData = new FormData();
    formData.append('file', file);
    let url = `groups/${id}/update-group-cover`;
    if (type === 'group') {
      url = `groups/${id}/update-group-picture`;
    }
    axios.post(url, formData, config)
      .then(response => {
        dispatch(fetchGroupData(token, id));
      })
      .catch(err => {
        dispatch(uiStopLoading());
        console.log(err);
      });
  }
};

export const updateGroupName = (token, id, data) => {
  const config = {
    'headers': {'Authorization': "bearer " + token}
  };
  return dispatch => {
    dispatch(uiStartLoading());
    axios.put(`/groups/${id}`, data, config)
      .then(() => {
        dispatch(fetchGroupData(token, id));
      })
      .catch(err => {
        dispatch(uiStopLoading());
        console.log(err);
      });
  }
};

export const fetchInvitationList = (token, id) => {
  const config = {
    'headers': {'Authorization': "bearer " + token}
  };
  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/groups/${id}/invite-friends`, config)
      .then(response => {
        dispatch(setInvitationList(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        dispatch(uiStopLoading());
        console.log(err);
      });
  }
};

const setGroupId = id => {
  return {
    type: SET_GROUP_ID,
    groupId: id
  }
};

export const removeGroupId = () => {
  return {
    type: REMOVE_GROUP_ID
  }
};

const setOwnGroups = data => {
  return {
    type: SET_OWN_GROUPS,
    data: data.data
  }
};

const setOtherGroups = data => {
  return {
    type: SET_OTHER_GROUPS,
    data: data.data
  }
};

const setGroupInvitations = data => {
  return {
    type: SET_GROUP_INVITATIONS,
    data: data.data
  }
};

const setGroupDetails = data => {
  return {
    type: SET_GROUP_DETAILS,
    data: data.data
  }
};

const setInvitationList = data => {
  return {
    type: SET_INVITATION_LIST,
    data: data.data
  }
};

/*=====================================*/

export const postGroupFeed = (token, data, id) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };
  return dispatch => {
    dispatch(uiStartLoading());
    axios.post(`/groups/posts/${id}`, data, config)
      .then(response => {
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

export const fetchGroupFeed = (token, pageNumber, profileId) => {
  const config = {
    headers: {'Authorization': "bearer " + token}
  };

  let url = '/groups/posts/';
  if (profileId) {
    url = `/groups/posts/${profileId}`;
  }

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`${url}?page=${pageNumber}`, config)
      .then(response => {
        //console.log(response);
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

export const postGroupComment = (token, comment, user, feeds) => {
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
          my_comment: true,
          sub_comments: []
        };
        //console.log(newCommentData.post_id);
        if (newCommentData.comment_parent_id === 0) {
          dispatch(updateGroupFeedComment(feeds, newCommentData.post_id, newCommentData));
        } else {
          dispatch(updateGroupFeedCommentReply(feeds, newCommentData.post_id, newCommentData.comment_parent_id, newCommentData));
        }
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

export const updateGroupFeedPostText = (token, feeds, id, text) => {
  return dispatch => {
    const config = {
      headers: {
        'Authorization': "bearer " + token
      }
    };
    axios.put(`/posts/${id}`, {post_text: text}, config)
      .then(response => {
        console.log(response);
        const newFeeds = [...feeds];
        const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
        dispatch(updateFeedText(feedIndex, text));
      })
      .catch(err => {
        console.log(err);
      });
  }
};

export const updateGroupFeedDelete = (token, feeds, id) => {
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

export const commentManipulateGroup = (token, feeds, postId, commentId, comments, isEdit, text) => {
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
          dispatch(updateGroupCommentDelete(feedIndex, comments, 'edit', count));
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
          dispatch(updateGroupCommentDelete(feedIndex, comments, 'delete', count));
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};

export const updateGroupFeed = (feeds, id) => {
  return dispatch => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
    dispatch(updateFeed(feedIndex));
  }
};

export const updateGroupFeedComment = (feeds, id, comment) => {
  return dispatch => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
    dispatch(updateFeedComment(feedIndex, comment));
  }
};

export const updateGroupFeedCommentLike = (feeds, id, commentId) => {
  return dispatch => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
    let commentIndex = newFeeds[feedIndex].comments.findIndex(feed => feed.comment_id === commentId);
    let commentChildIndex = -1;
    if (commentIndex === -1) {
      const comments = newFeeds[feedIndex].comments;
      for (let index = 0; index < comments.length; index ++) {
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

export const updateGroupFeedCommentReply = (feeds, id, commentId, comment) => {
  return dispatch => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
    const commentIndex = newFeeds[feedIndex].comments.findIndex(feed => feed.comment_id === commentId);
    dispatch(updateFeedCommentReply(feedIndex, commentIndex, comment));
  }
};

const setFeed = data => {
  return {
    type: SET_GROUP_FEED,
    feed: data.data,
    nextPage: data.nextPage
  }
};

const updateFeedCommentLike = (index, commentIndex, commentChildIndex) => {
  return {
    type: UPDATE_GROUP_FEED_COMMENT_LIKE,
    feedIndex: index,
    commentIndex: commentIndex,
    commentChildIndex: commentChildIndex
  }
};

const updateFeedCommentReply = (index, commentIndex, comment) => {
  return {
    type: UPDATE_GROUP_FEED_COMMENT_REPLY,
    feedIndex: index,
    commentIndex: commentIndex,
    comment: comment
  }
};

const updateFeed = index => {
  return {
    type: UPDATE_GROUP_FEED,
    feedIndex: index,
  }
};

export const resetGroupFeed = () => {
  return {
    type: CLEAR_GROUP_FEED
  }
};

export const resetDetails = () => {
  return {
    type: CLEAR_GROUP_DETAILS
  }
};

const updateFeedComment = (index, comment) => {
  return {
    type: UPDATE_GROUP_FEED_COMMENT,
    feedIndex: index,
    comment: comment
  }
};

const updateFeedText = (index, text) => {
  return {
    type: UPDATE_GROUP_FEED_TEXT,
    feedIndex: index,
    text: text
  }
};

const updateFeedDelete = index => {
  return {
    type: UPDATE_GROUP_FEED_DELETE,
    feedIndex: index
  }
};

const updateGroupCommentDelete = (index, comments, type, count) => {
  return {
    type: UPDATE_GROUP_COMMENT_MANIPULATE,
    feedIndex: index,
    comments: comments,
    manipulateType: type,
    count: count
  }
};

export const updateGroupFollow = id => {
  return {
    type: UPDATE_GROUP_FOLLOW,
    payload: id
  }
};

/*const resetFeed = () => {
  return {
    type: RESET_GROUP_FEED
  }
};*/
