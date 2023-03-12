// jshint esversion: 9
import {
	AUTH_SUCCESS,
	AUTH_LOGOUT,
	INIT_URL,
	UPDATE_USER_DETAILS,
	AUTH_MOBILE,
} from './actionTypes';
import axios from '../../utils/axiosConfig';
import { uiStartLoading, uiStopLoading, showAlertMessage } from './ui';
import { socket } from './socket';
import CryptoJs from 'crypto-js';
import { toast } from 'react-toastify';

export const setInitUrl = (url) => {
	return {
		type: INIT_URL,
		payload: url,
	};
};

export const onTryAuth = (authData, authMode) => {
	localStorage.setItem('username', authData.username);
	return (dispatch) => {
		dispatch(uiStartLoading());
		let url = '/users/register';
		authData.register_device_detail = JSON.parse(
			localStorage.getItem('login_device_detail')
		);
		if (authMode === 'login' || authMode === 'google') {
			url = '/users/login';
			authData.login_device_detail = JSON.parse(
				localStorage.getItem('login_device_detail')
			);
			delete authData.register_device_detail;
		}
		if (authMode === 'email') {
			url = '/users/verify-email';
			authMode = 'login';
		}
		if (authMode === 'mobile') {
			url = '/users/verify-phone';
			authMode = 'login';
		}
		axios
			.post(url, authData)
			.then((response) => {
				if (!response) {
					toast('A network error occured, please refresh!', {
						position: 'top-center',
						type: 'warning',
					});
					dispatch(uiStopLoading());
					return;
				}

				console.log('response data: ', response.data);
				if (response.data.message === 'redirect to 2fa') {
					localStorage.setItem('user_id', response.data.user_id);
					window.location.href = '/2fa';
					return;
				}

				if (authMode === 'login' || authMode === 'google') {
					socket.emit('getEncKeys', {}, (err, obj) => {
						if (err) {
							console.log(err);
							return;
						}
						const bytesData = CryptoJs.AES.decrypt(response.data.user, obj.k);
						const userDetails = JSON.parse(
							bytesData.toString(CryptoJs.enc.Utf8)
						);
						response.data.user = userDetails;
						localStorage.setItem('token', response.data.token);
						// change this later on
						localStorage.setItem(
							'user',
							JSON.stringify(response.data.user.user_id)
						);
						localStorage.removeItem('login_trials');
						dispatch(authSuccess(response.data));
						dispatch(uiStopLoading());
					});
					const loggedInUser = JSON.parse(localStorage.getItem('user'));
					socket.emit(
						'getsocketid',
						{ user_id: loggedInUser.user_id },
						function(err, data) {
							if (err) {
								console.log(err);
								return;
							}
							console.log('socket id updated: ', data);
						}
					);
				}
				if (authMode === 'signup') {
					if (response.data.registered_with === 'contact_number') {
						dispatch(
							showAlertMessage(
								'Success! Please check your mobile to activate your account'
							)
						);
						dispatch(authOtpCheck(authData.username));
					} else {
						dispatch(
							showAlertMessage(
								'Success! Please check your email to activate your account'
							)
						);
					}
				}
				dispatch(uiStopLoading());
			})
			.catch((err) => {
				//console.log(err);
				//dispatch(showAlertMessage('Registration Successful'));
				dispatch(uiStopLoading());
			});
	};
};

export const authSuccess = (authData) => {
	return {
		type: AUTH_SUCCESS,
		token: authData.token,
		user: authData.user,
	};
};

const authOtpCheck = (user) => {
	return {
		type: AUTH_MOBILE,
		user: user,
	};
};

export const authLogout = () => {
	return {
		type: AUTH_LOGOUT,
	};
};

export const checkAuthState = () => {
	return (dispatch) => {
		const token = localStorage.getItem('token');
		const user = JSON.parse(localStorage.getItem('user'));
		const authData = { token: token, user: user };
		if (token) {
			dispatch(authSuccess(authData));
			const config = {
				headers: { Authorization: 'bearer ' + token },
			};
			axios
				.get('/profile', config)
				.then((response) => {
					//console.log(response.data);
					socket.emit('getEncKeys', {}, (err, obj) => {
						if (err) {
							console.log(err);
							return;
						}
						const bytesData = CryptoJs.AES.decrypt(response.data.data, obj.k);
						const userDetails = JSON.parse(
							bytesData.toString(CryptoJs.enc.Utf8)
						);
						response.data.data = userDetails;
						dispatch(updateUserDetails(user, response.data.data));
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
};

export const updateUserDetails = (user, newData) => {
	const updatedUser = { ...user, ...newData };
	const stringUser = JSON.stringify(updatedUser);
	try {
		localStorage.setItem('user', updatedUser.user_id);
	} catch (error) {
		console.log(error);
		toast(
			'Please make sure you are not in a private tab for best performance',
			{ type: 'warning', position: 'top-center' }
		);
	}
	return {
		type: UPDATE_USER_DETAILS,
		user: updatedUser,
	};
};
