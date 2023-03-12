// jshint esversion:8
import {
	SET_MOST_POPULAR_FEED,
	SET_POST_DETAILS,
	UPDATE_POST_DETAILS_TEXT,
	CLEAR_MOST_POPULAR_FEED,
	CLEAR_POST_DETAIL
} from './actionTypes';
import axios from '../../utils/axiosConfig';
import { uiStartLoading, uiStopLoading } from './ui';
// import { socket } from './socket';
// import CryptoJs from 'crypto-js';

export const postFeed = (token, data) => {
	const config = {
		headers: { Authorization: 'bearer ' + token }
	};
	return (dispatch) => {
		dispatch(uiStartLoading());
		axios
			.post('/posts', data, config)
			.then((response) => {
				dispatch(uiStopLoading());
			})
			.catch((err) => {
				console.log(err);
				dispatch(uiStopLoading());
			});
	};
};

export const postLike = (token, id) => {
	const config = {
		headers: { Authorization: 'bearer ' + token }
	};
	const loggedInUser = JSON.parse(localStorage.getItem('user'));
	console.log(loggedInUser.user_id);
	return (dispatch) => {
		dispatch(uiStartLoading());
		axios
			.post('/likes', { post_id: id, author_id: loggedInUser.user_id }, config)
			.then((response) => {
				// console.log(response);
				dispatch(uiStopLoading());
			})
			.catch((err) => {
				console.log(err);
				dispatch(uiStopLoading());
			});
	};
};

export const postCommentLike = (token, id) => {
	const config = {
		headers: { Authorization: 'bearer ' + token }
	};
	const loggedInUser = JSON.parse(localStorage.getItem('user'));
	return (dispatch) => {
		dispatch(uiStartLoading());
		axios
			.post(
				'/likes',
				{
					comment_id: id,
					like_type: 'comment',
					author_id: loggedInUser.user_id
				},
				config
			)
			.then((response) => {
				// console.log(response);
				dispatch(uiStopLoading());
			})
			.catch((err) => {
				console.log(err);
				dispatch(uiStopLoading());
			});
	};
};

export const postComment = (token, comment) => {
	const config = {
		headers: { Authorization: 'bearer ' + token }
	};
	return (dispatch) => {
		dispatch(uiStartLoading());
		axios
			.post('/comments', comment, config)
			.then((response) => {
				// console.log(response);
				dispatch(uiStopLoading());
			})
			.catch((err) => {
				console.log(err);
				dispatch(uiStopLoading());
			});
	};
};

export const fetchMostPopular = (token, type) => {
	const config = {
		headers: { Authorization: 'bearer ' + token }
	};
	let url = '/posts/most-popular';
	if (type) {
		url = `/posts/most-popular?type=${type}`;
	}
	return (dispatch) => {
		dispatch(uiStartLoading());
		return axios
			.get(url, config)
			.then((response) => {
				//console.log(response.data);
				// socket.emit('getEncKeys', {}, (err, obj) => {
				//   if (err) {
				//     console.log(err);
				//     return;
				//   }
				//   let postDetails = [];
				//   try {
				//     const bytesData = CryptoJs.AES.decrypt(response.data.data, obj.k);
				//     postDetails = JSON.parse(bytesData.toString(CryptoJs.enc.Utf8));
				//   } catch (error) {
				//     console.log(error);
				//   }
				//   response.data.data = postDetails;
				// });
				dispatch(setMostPopular(response.data.data));
				dispatch(uiStopLoading());
				return response;
			})
			.catch((err) => {
				console.log(err);
				dispatch(uiStopLoading());
			});
	};
};

export const fetchPostDetails = (token, id) => {
	const config = {
		headers: { Authorization: 'bearer ' + token }
	};
	return (dispatch) => {
		dispatch(uiStartLoading());
		axios
			.get(`/posts/${id}`, config)
			.then((response) => {
				// socket.emit('getEncKeys', {}, (err, obj) => {
				//   if (err) {
				//     console.log(err);
				//     return;
				//   }
				//   let postDetails;
				//   try {
				//     const bytesData = CryptoJs.AES.decrypt(response.data.data, obj.k);
				//     postDetails = JSON.parse(bytesData.toString(CryptoJs.enc.Utf8));
				//   } catch (error) {
				//     console.log(error);
				//   }
				//   response.data.data = postDetails;
				// });
				dispatch(setPostDetails(response.data.data));
				dispatch(uiStopLoading());
			})
			.catch((err) => {
				console.log(err.response);
				dispatch(uiStopLoading());
			});
	};
};

export const updatePostDetailText = (token, id, text) => {
	return (dispatch) => {
		const config = {
			headers: {
				Authorization: 'bearer ' + token
			}
		};
		dispatch(uiStartLoading());
		axios
			.put(`/posts/${id}`, { post_text: text }, config)
			.then(() => {
				dispatch(uiStopLoading());
				dispatch(updateFeedText(text));
			})
			.catch((err) => {
				dispatch(uiStopLoading());
				console.log(err);
			});
	};
};

export const commentManipulatePostDetail = (
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
				Authorization: 'bearer ' + token
			}
		};
		if (isEdit) {
			axios
				.put(`/comments/${commentId}`, text, config)
				.then((response) => {
					// console.log(response);
					dispatch(fetchPostDetails(token, postId));
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			axios
				.delete(`/comments/${commentId}`, config)
				.then((response) => {
					// console.log(response);
					dispatch(fetchPostDetails(token, postId));
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
};

const updateFeedText = (text) => {
	return {
		type: UPDATE_POST_DETAILS_TEXT,
		text: text
	};
};

export const setMostPopular = (posts) => {
	return {
		type: SET_MOST_POPULAR_FEED,
		feed: posts
	};
};

export const resetMostPopular = () => {
	return {
		type: CLEAR_MOST_POPULAR_FEED
	};
};

export const resetPostDetail = () => {
	return {
		type: CLEAR_POST_DETAIL
	};
};

export const setPostDetails = (posts) => {
	return {
		type: SET_POST_DETAILS,
		details: posts
	};
};
