import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Swal from '@sweetalert/with-react';

import { toastOptions } from '../constants/toastOptions';

const withErrorHandler = (WrappedComponent, axios, props) => {
	return class extends Component {
		state = {
			error: null,
			loggedOut: false,
		};

		componentWillMount() {
			const loggedInUser = JSON.parse(localStorage.getItem('user'));
			if (
				loggedInUser &&
				loggedInUser.profile_image_url === 'profile_default.jpg'
			) {
				setInterval(this.uploadProfilePic, 600000);
			}
			this.reqInterceptor = axios.interceptors.request.use((req) => {
				this.setState({ error: null });
				return req;
			});
			this.resInterceptor = axios.interceptors.response.use(
				(res) => {
					if (this.state.loggedOut) {
						this.setState({ loggedOut: false });
					}
					return res;
				},
				(error) => {
					console.log('ERROR!', error.response);

					if (!error) {
						return error;
					}

					if (error.message === 'Network Error') {
						toast.error(
							`A ${error.message} Occured, please refresh and try again`,
							toastOptions
						);
						return error;
					}

					if (
						error.response.data.message === 'invalid jwt token' ||
						(error.response.status === 401 &&
							error.response.data.message === 'UNAUTHORIZED')
					) {
						this.props.history.replace('/logout');
						return error;
					}

					if (error.response && error.response.status === 403) {
						if (!this.state.loggedOut) {
							// this.props.history.replace('/logout');
							toast.error('Session Expired', toastOptions);
							localStorage.clear();
							window.location.href = '/';
						}
						this.setState({ loggedOut: true });
						toast.error(
							'Forbidden! Please login again to continue',
							toastOptions
						);
						return error;
					}

					if (
						error.response &&
						error.response.data.message === 'AN ERROR OCCURED'
					) {
						toast('Session expired', toastOptions);
						this.props.history.replace('/logout');
					}

					if (
						error.response &&
						error.response.data &&
						error.response.data.message === 'Invalid Password'
					) {
						let loginTrials =
							localStorage.getItem('login_trials') &&
							Number.parseInt(localStorage.getItem('login_trials')) < 5
								? Number.parseInt(localStorage.getItem('login_trials')) + 1
								: Number.parseInt(localStorage.getItem('login_trials'));
						if (!loginTrials) {
							localStorage.setItem('login_trials', 1);
							this.showTrailDialog();
							return;
						}

						if (loginTrials && loginTrials < 5) {
							localStorage.setItem('login_trials', loginTrials);
							this.showTrailDialog();
							return error;
						}

						if (loginTrials && loginTrials > 5) {
							// TODO: call function to block account
						}

						if (loginTrials && loginTrials === 5) {
							Swal({
								icon: 'error',
								button: 'Ok',
								text: 'Your account has been blocked',
							}).then(() => {
								this.props.history.push('/2fa');
							});
							axios
								.post('/users/block', {
									username: localStorage.getItem('username'),
								})
								.then((response) => {
									console.log(response.data);
									if (!response) {
										toast('Something went wrong', toastOptions);
										return;
									}
									if (response.data.status) {
										return;
									}
								})
								.catch((err) => {
									console.log(err.response);
									if (err.response) {
										toast(err.response.data.message, toastOptions);
										return;
									}
									toast('Something went wrong', toastOptions);
								});
						}

						return error;
					}

					if (error.response.data.message === 'redirect to 2fa') {
						localStorage.setItem('user_id', error.response.data.user_id);
						this.props.history.push('/2fa');
					}
					if (error.response && error.response.status === 404) {
						this.props.history.push('/not-found');
					} else if (
						error.response &&
						error.response.data.message === 'Invalid Token'
					) {
						if (!this.state.loggedOut) {
							this.props.history.replace('/logout');
						}
						this.setState({ loggedOut: true });
						toast.error(
							'Session expired! Please login again to continue',
							toastOptions
						);
					} else if (
						error.response &&
						error.response.data.message === 'Invalid Verification Token'
					) {
						setTimeout(() => {
							this.props.history.replace('/not-found');
							toast.error(error.response.data.message, toastOptions);
						}, 4000);
					} else if (
						error.response &&
						error.response.data.message instanceof Object
					) {
						let errMsg;
						for (const key in error.response.data.message) {
							errMsg = error.response.data.message[key];
						}
						toast.error(errMsg, toastOptions);
						return error;
					} else if (error.response && error.response.data.message) {
						toast.error(error.response.data.message, toastOptions);
						return error;
					} else {
						toast.error(
							'Something unexpected happened! Please try again or login',
							toastOptions
						);
					}
				}
			);
		}

		uploadProfilePic() {
			Swal({
				icon: 'info',
				button: 'Ok',
				text: 'Please upload a profile picture',
			});
		}

		showTrailDialog() {
			const trails = Number.parseInt(localStorage.getItem('login_trials'));
			Swal({
				icon: 'warning',
				button: 'Ok',
				text: `You have ${5 - trails} attempt(s) left`,
			});
		}

		componentWillUnmount() {
			//console.log('Will Unmount', this.reqInterceptor, this.resInterceptor);
			axios.interceptors.request.eject(this.reqInterceptor);
			axios.interceptors.response.eject(this.resInterceptor);
		}

		render() {
			return <WrappedComponent {...this.props} />;
		}
	};
};

export default withErrorHandler;
