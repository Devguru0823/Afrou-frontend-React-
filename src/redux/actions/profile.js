import {
  SET_PROFILE_FEED,
  UPDATE_PROFILE_FEED,
  SET_PROFILE_DETAILS,
  CLEAR_PROFILE_FEED,
  CLEAR_PROFILE_DETAIL,
  UPDATE_PROFILE_FEED_COMMENT,
  SET_PROFILE_IMAGES,
  SET_SUGGESTED_FRIENDS,
  UPDATE_PROFILE_FEED_TEXT,
  UPDATE_PROFILE_FEED_DELETE,
  UPDATE_PROFILE_FEED_COMMENT_LIKE,
  UPDATE_PROFILE_FEED_COMMENT_REPLY,
  UPDATE_PROFILE_COMMENT_MANIPULATE,
  UPDATE_PROFILE_FOLLOW
} from './actionTypes';
import axios from '../../utils/axiosConfig';
import {
  uiStartLoading,
  uiStopLoading
} from './ui';
import { updateUserDetails } from "./auth";
import { socket } from './socket';
import CryptoJs from 'crypto-js';
import { toast } from 'react-toastify';

export const fetchProfileFeed = (token, pageNumber, profileId) => {
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };

  let url = '/profile/posts';
  if (profileId) {
    url = `/profile/${profileId}/posts`;
  }

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`${url}?page=${pageNumber}`, config)
      .then(response => {
        console.log('profile response: ',response);
        if(!response) {
          toast('Something went wrong, please refresh');
          return;
        }
        dispatch(setFeed(response.data));
        dispatch(uiStopLoading());
        // socket.emit('getEncKeys', {}, (err, obj) => {
        //   if (err) {
        //     console.log(err);
        //     return;
        //   }
        //   let profileDetails = [];
        //   try {
        //     const bytesData = CryptoJs.AES.decrypt(response.data.data, obj.k);
        //     profileDetails = JSON.parse(bytesData.toString(CryptoJs.enc.Utf8)); 
        //     console.log('decrypted profile details',profileDetails)
        //   } catch (error) {
        //     console.log(error);
        //   }
        //   response.data.data = profileDetails;
          
        // });
      })
      .catch(err => {
        console.log(err);
        dispatch(setFeed({ data: [] }));
        dispatch(uiStopLoading());
      });
  }
};

export const fetchProfilePhotos = (token, profileId) => {
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };

  let url = '/profile/photos';
  if (profileId) {
    url = `/profile/${profileId}/photos`;
  }

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(url, config)
      .then(response => {
        //console.log(response);
        if(!response) {
          toast('Something went wrong, please refresh');
          return;
        }
        dispatch(setImages(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(setImages({ data: [] }));
        dispatch(uiStopLoading());
      });
  }
};

export const deleteProfilePhotos = (token, profileId) => {
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };

  let url = '/profile/photos';
  if (profileId) {
    url = `/profile/${profileId}/photos`;
  }

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(url, config)
      .then(response => {
        //console.log(response);
        if(!response) {
          toast('Something went wrong, please refresh');
          return;
        }
        dispatch(setImages(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(setImages({ data: [] }));
        dispatch(uiStopLoading());
      });
  }
};

export const postProfileComment = (token, comment, user, feeds) => {
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };
  return dispatch => {
    dispatch(uiStartLoading());
    axios.post('/comments', comment, config)
      .then(response => {
        if(!response) {
          toast('Something went wrong, please refresh');
          return;
        }
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
        if (newCommentData.comment_parent_id === 0) {
          dispatch(updateProfileFeedComment(feeds, newCommentData.post_id, newCommentData));
        } else {
          dispatch(updateProfileFeedCommentReply(feeds, newCommentData.post_id, newCommentData.comment_parent_id, newCommentData));
        }
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

export const fetchProfileDetails = (token, profileId) => {
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };

  let url = '/profile';
  if (profileId) {
    url = `/profile/${profileId}`;
  }

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(url, config)
      .then(response => {
        // console.log(response.data);
        if(!response || (response && !response.data)) {
          toast('Something went wrong, please refresh');
          return;
        }
        socket.emit('getEncKeys', {}, (err, obj) => {
          if (err) {
            console.log(err);
            return;
          }
          let profileDetails;
          try {
            const bytesData = CryptoJs.AES.decrypt(response.data.data, obj.k);
            profileDetails = JSON.parse(bytesData.toString(CryptoJs.enc.Utf8)); 
          } catch (error) {
            console.log(error);
          }
          response.data.data = profileDetails;
          dispatch(setProfileDetails(response.data));
          dispatch(uiStopLoading());
        });
      })
      .catch(err => {
        console.log(err);
        //dispatch(setFeed({data: []}));
        dispatch(uiStopLoading());
      });
  }
};

export const fetchSuggestedFriends = token => {
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get('profile/suggested-people', config)
      .then(response => {
        //console.log(response);
        dispatch(setSuggestedFriends(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  }
};

export const updateProfileFeedPostText = (token, feeds, id, text) => {
  return dispatch => {
    const config = {
      headers: {
        'Authorization': "bearer " + token
      }
    };
    axios.put(`/posts/${id}`, { post_text: text }, config)
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

export const updateProfileFeedDelete = (token, feeds, id) => {
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

export const commentManipulateProfile = (token, feeds, postId, commentId, comments, isEdit, text) => {
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
          dispatch(updateProfileCommentDelete(feedIndex, comments, 'edit'));
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
          dispatch(updateProfileCommentDelete(feedIndex, comments, 'delete'));
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};

export const updateProfileCover = (file, type, user, token) => {
  const config = {
    'headers': { 'Authorization': "bearer " + token },
    'content-type': 'multipart/form-data'
  };
  return dispatch => {
    dispatch(uiStartLoading());
    const formData = new FormData();
    formData.append('file', file);
    let url = `profile/update-profile-cover`;
    axios.post(url, formData, config)
      .then(response => {
        dispatch(updateUserDetails(user, response.data.data));
      })
      .catch(() => {
        dispatch(uiStopLoading());
      });
  }
};

export const updateProfileFeed = (feeds, id) => {
  return dispatch => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
    dispatch(updateFeed(feedIndex));
  }
};

export const updateProfileFeedCommentLike = (feeds, id, commentId) => {
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

export const updateProfileFeedCommentReply = (feeds, id, commentId, comment) => {
  return dispatch => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
    const commentIndex = newFeeds[feedIndex].comments.findIndex(feed => feed.comment_id === commentId);
    dispatch(updateFeedCommentReply(feedIndex, commentIndex, comment));
  }
};

export const updateProfileFeedComment = (feeds, id, comment) => {
  return dispatch => {
    const newFeeds = [...feeds];
    const feedIndex = newFeeds.findIndex(feed => feed.post_id === id);
    dispatch(updateFeedComment(feedIndex, comment));
  }
};

const setFeed = data => {
  return {
    type: SET_PROFILE_FEED,
    feed: data.data,
    nextPage: data.nextPage
  }
};

const updateFeedCommentLike = (index, commentIndex, commentChildIndex) => {
  return {
    type: UPDATE_PROFILE_FEED_COMMENT_LIKE,
    feedIndex: index,
    commentIndex: commentIndex,
    commentChildIndex: commentChildIndex
  }
};

const updateFeedCommentReply = (index, commentIndex, comment) => {
  return {
    type: UPDATE_PROFILE_FEED_COMMENT_REPLY,
    feedIndex: index,
    commentIndex: commentIndex,
    comment: comment
  }
};

const setImages = data => {
  return {
    type: SET_PROFILE_IMAGES,
    images: data.data,
  }
};

const updateFeed = index => {
  return {
    type: UPDATE_PROFILE_FEED,
    feedIndex: index,
  }
};

const setProfileDetails = data => {
  return {
    type: SET_PROFILE_DETAILS,
    profileData: data.data
  }
};

export const resetProfileFeed = () => {
  return {
    type: CLEAR_PROFILE_FEED
  }
};

export const resetProfileDetail = () => {
  return {
    type: CLEAR_PROFILE_DETAIL
  }
};

const updateFeedComment = (index, comment) => {
  return {
    type: UPDATE_PROFILE_FEED_COMMENT,
    feedIndex: index,
    comment: comment
  }
};

const setSuggestedFriends = data => {
  return {
    type: SET_SUGGESTED_FRIENDS,
    data: data.data
  }
};

const updateFeedText = (index, text) => {
  return {
    type: UPDATE_PROFILE_FEED_TEXT,
    feedIndex: index,
    text: text
  }
};

const updateFeedDelete = index => {
  return {
    type: UPDATE_PROFILE_FEED_DELETE,
    feedIndex: index
  }
};

const updateProfileCommentDelete = (index, comments, type) => {
  return {
    type: UPDATE_PROFILE_COMMENT_MANIPULATE,
    feedIndex: index,
    comments: comments,
    manipulateType: type
  }
};

export const updateProfileFollow = id => {
  return {
    type: UPDATE_PROFILE_FOLLOW,
    payload: id
  }
};
