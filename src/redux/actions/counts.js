import { SET_COUNT, SET_MESSAGES_LIST } from './actionTypes';
import axios from '../../utils/axiosConfig';
import { socket } from './socket';

export const startNotificationListener = {
	start(dispatch) {
		socket.on('notification', (data) => {
			console.log('new notification: ', data);
			if (data.counters) {
				console.log('counters exists..');
				dispatch(setCounts(data.counters));
				if (data.messages) {
					console.log('messages  exists..');
					dispatch(setFeed(data.messages));
				}
			}
		});

		socket.on('getnotificationcounter', (counters) => {
			console.log('setting notfication counters');
			dispatch(setCounts(counters.data));
		});
	},
};

export const getNotifications = (user_id) => {
	return (dispatch) => {
		socket.emit('getnotificationcounter', { user_id }, (err, data) => {
			if (err) {
				console.log(err);
				return;
			}
			console.log(data);
			dispatch(setCounts(data.data));
		});
	};
};

export const fetchCounts = (token) => {
	const config = {
		headers: { Authorization: 'bearer ' + token },
	};
	return (dispatch) => {
		axios
			.get(`/notifications/counter`, config)
			.then((response) => {
				// console.log(response.data.data);
				dispatch(setCounts(response.data.data));
			})
			.catch((err) => {
				console.log(err);
			});
	};
};

const setCounts = (counts) => {
	return {
		type: SET_COUNT,
		counts: counts,
	};
};

const setFeed = (data) => {
	return {
		type: SET_MESSAGES_LIST,
		feed: data,
	};
};
