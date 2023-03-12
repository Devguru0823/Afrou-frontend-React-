import React, { useEffect, useState } from 'react';
import DetailSection from '../Home/DetailSection';
import Footer from '../../components/Footer/Footer';
import './TwoFactor.css';
import axios from '../../utils/axiosConfig';
import Swal from '@sweetalert/with-react';
import { toast } from 'react-toastify';
import { CircularProgress } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { checkAuthState } from '../../redux/actions';
import { connect } from 'react-redux';
import withErrorHandler from '../../utils/withErrorHandler';

function TwoFactor(props) {
	const [mode, setMode] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const user_id = localStorage.getItem('user_id');
		const username = localStorage.getItem('username');

		if (!user_id || !username) {
			props.history.replace('/');
			return;
		}

		if (user_id && username) {
			localStorage.removeItem('username');
		}
	}, []);

	const query = useQuery();

	function handleModeChange(ev) {
		setMode(ev.target.value);
	}

	async function handleContinue() {
		if (!mode) {
			Swal({
				icon: 'warning',
				title: 'Error',
				text: 'Please select a method',
			});
			return;
		}
		setIsLoading(true);
		const user_id = Number.parseInt(localStorage.getItem('user_id'));
		const login_device_detail = JSON.parse(
			localStorage.getItem('login_device_detail')
		);
		const data = {
			id: user_id,
			username: localStorage.getItem('username'),
			login_device_detail,
		};
		let response;
		try {
			response = await (await axios.post(`/users/2fa/${mode}`, data)).data;
		} catch (error) {
			setIsLoading(false);
			toast(error.message, { position: 'top-center', type: 'error' });
			return;
		}

		setIsLoading(false);

		if (!response) {
			toast('Something went wrong', { position: 'top-center', type: 'error' });
			return;
		}

		if (response.status) {
			if (mode === 'email') {
				Swal({
					title: 'Enter OTP',
					text: `Please enter the otp sent to your mail`,
					content: 'input',
					button: {
						text: 'Submit!',
						closeModal: false,
					},
				}).then((token) => {
					if (!token) {
						return Swal('OTP is required!');
					}

					axios
						.post(`/users/2fa/${mode}/verify`, {
							token,
							user_id,
							login_device_detail,
						})
						.then((response) => {
							console.log(response);
							if (!response) {
								return Swal('An error occured!');
							}

							if (!response.data.status) {
								return Swal(response.data.message);
							}

							if (!response.data.status) {
								Swal({
									icon: 'error',
									title: 'Error',
									text: response.data.message,
								});
							}

							if (response.data.status) {
								localStorage.setItem('token', response.data.access_token);
								localStorage.setItem(
									'user',
									JSON.stringify(response.data.user)
								);
								Swal({
									icon: 'success',
									title: 'Success',
									text: 'Token valid!',
								}).then(() => {
									props.checkAuthState();
									props.history.push('/afroswagger');
								});
							}
						})
						.catch((err) => {
							console.log(err);
							if (err.response && err.repsonse.data) {
								return Swal(err.response.data.message);
							}
							return Swal(err.message);
						});
				});
				return;
			}

			if (mode === 'phone') {
				Swal({
					title: 'Enter OTP',
					text: `Please enter the otp sent to your registered number`,
					content: 'input',
					button: {
						text: 'Submit!',
						closeModal: false,
					},
				}).then((token) => {
					if (!token) {
						return Swal('OTP is required!');
					}

					axios
						.post(`/users/2fa/${mode}/verify`, {
							token,
							user_id,
							login_device_detail,
						})
						.then((response) => {
							console.log(response);
							if (!response) {
								return Swal('An error occured!');
							}

							if (!response.data.status) {
								return Swal(response.data.message);
							}

							if (!response.data.status) {
								Swal({
									icon: 'error',
									title: 'Error',
									text: response.data.message,
								});
							}

							if (response.data.status) {
								localStorage.setItem('token', response.data.access_token);
								localStorage.setItem(
									'user',
									JSON.stringify(response.data.user)
								);
								Swal({
									icon: 'success',
									title: 'Success',
									text: 'Token valid!',
								}).then(() => {
									props.checkAuthState();
									props.history.push('/afroswagger');
								});
							}
						})
						.catch((err) => {
							console.log(err);
							if (err.response && err.repsonse.data) {
								return Swal(err.response.data.message);
							}
							return Swal(err.message);
						});
				});
				return;
			}

			// if (mode === 'authenticator') {
			//   Swal({
			//     title: 'Google Authenticator',
			//     text: `
			//     To use the google authenticator, download the app and create a new issuer with the following details \n
			//         Name: ${response.issuer} \n
			//         Secret: ${response.secret} \n

			//         Once done, copy and paste the token before it expires in the input box below.
			//     NOTE: If you have done the steps above before, don't repeat it. Just go to the google authenticator and copy the token.
			//     `,
			//     content: "input",
			//     button: {
			//       text: "Submit!",
			//       closeModal: false,
			//     },
			//   }).then((token) => {
			//     if (!token) {
			//       return Swal('A token is required!');
			//     }

			//     axios.post(`/users/2fa/${mode}/verify`, { token, user_id, login_device_detail })
			//       .then((response) => {
			//         console.log(response);
			//         if (!response) {
			//           return Swal("An error occured!");
			//         }

			//         if (!response.data.status) {
			//           return Swal(response.data.message);
			//         }

			//         if (response.data.status) {
			//           localStorage.setItem('token', response.data.access_token);
			//           localStorage.setItem('user', JSON.stringify(response.data.user));
			//           Swal({
			//             icon: 'success',
			//             title: 'Success',
			//             text: 'Token valid!'
			//           }).then(() => {
			//             props.checkAuthState();
			//             props.history.push('/afroswagger');
			//           });
			//         }
			//       }).catch((err) => {
			//         console.log(err);
			//         if (err.response && err.repsonse.data) {
			//           return Swal(err.response.data.message);
			//         }
			//         return Swal(err.message);
			//       })
			//   })
			// }
		}
	}

	return (
		<>
			<div className="two-fa-container">
				<div className="two-fa-header">
					<h2>Two Factor Authentication</h2>
					<span className="sub-text">to continue, select one:</span>
				</div>
				<div className="two-fa-options">
					<div className="option">
						<label htmlFor="email">Email</label>
						<input
							type="radio"
							name="mode"
							id="email"
							value="email"
							onChange={handleModeChange}
						/>
					</div>
					{/* <div className="option">
            <label htmlFor="authenticator">Google Authenticator</label>
            <input type="radio" id="authenticator" name="mode" value="authenticator" onChange={handleModeChange} />
          </div> */}
					<div className="option">
						<label htmlFor="phone">Phone</label>
						<input
							type="radio"
							id="phone"
							name="mode"
							value="phone"
							onChange={handleModeChange}
						/>
					</div>
				</div>
				<button
					type="button"
					disabled={isLoading}
					className="continueBtn"
					onClick={handleContinue}
				>
					{isLoading ? <CircularProgress /> : 'Continue'}
				</button>
			</div>
			<DetailSection />
			<Footer idName="homefooter" />
		</>
	);
}

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const mapStateToProps = (state) => {
	return {
		isLoading: state.isLoading,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		checkAuthState: () => dispatch(checkAuthState()),
	};
};

export default withErrorHandler(
	connect(mapStateToProps, mapDispatchToProps)(TwoFactor),
	axios
);
