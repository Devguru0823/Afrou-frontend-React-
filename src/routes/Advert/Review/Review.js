import React, { useEffect, useState } from 'react';
import {
	ThemeProvider,
	Modal,
	Button,
	CircularProgress,
	Snackbar,
	Grid,
} from '@material-ui/core';
import { ArrowBack, ArrowRight, Warning } from '@material-ui/icons';
import { createTheme, makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import './Review.css';
import axios from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import { TrackChanges, People, Timelapse, Payment } from '@material-ui/icons';
import withErrorHandler from '../../../utils/withErrorHandler';
import $ from 'jquery';
import getCookie from '../../../constants/getCookies';

const BASE_URI = axios.defaults.baseURL;
const token = localStorage.getItem('token');
console.log(token);
const config = {
	headers: `Bearer ${token}`,
};
console.log(BASE_URI);

const useStyles = makeStyles((theme) => ({
	dialog: {
		padding: '40px',
	},
	modal: {
		position: 'absolute',
		width: '90%',
		margin: '2px auto 0',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		overflow: 'scroll',
		height: '70%',
		textAlign: 'center',
		maxHeight: '100%',
	},
	icon: {
		color: '#ff7400',
		fontSize: '35px',
		marginRight: '5px',
	},
}));

const theme = createTheme({
	palette: {
		primary: {
			// Purple and green play nicely together.
			main: '#ff0000',
		},
		secondary: {
			main: '#ff7400',
		},
	},
});

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

function Review(props) {
	const [isLoading, setIsLoading] = useState(false);
	const [hasPaid, setHasPaid] = useState(false);
	const [modalStyle] = useState(getModalStyle);
	const [modalOpen, setModalOpen] = useState(false);
	const [snackBarOpen, setSnackBarOpen] = useState(false);
	const [severity, setSeverity] = useState('');

	let unmounted = false;

	useEffect(() => {
		$(window).scrollTop(0);
	});

	const handleCreateAdvert = async () => {
		if (!unmounted) {
			setIsLoading(true);
			// set advert details
			const advert_details = {
				post_id: props.post.id,
				audience_id: props.audience._id,
				goal_id: props.goal_id,
				budget_id: props.budget_id,
				transaction_id: props.transactionID,
			};
			console.log(advert_details);
			const config = {
				headers: {
					authorization: `Bearer ${token}`,
				},
			};
			let response;
			try {
				response = await (
					await axios.post(`advert/create`, advert_details, config)
				).data;
			} catch (error) {
				setIsLoading(false);
				if (error.response) {
					console.log(error.response.data);
					return;
				}
				console.log(error.message);
				setIsLoading(false);
				setSeverity('error');
				setSnackBarOpen(true);
				return;
			}

			setIsLoading(false);
			if (!response) {
				return;
			}
			setSeverity(response.status ? 'success' : 'error');
			setSnackBarOpen(true);
			props.resetCurrent(response.data);
			localStorage.removeItem('selected_post');
		}
	};

	const handleSnackBarClose = () => {
		setSnackBarOpen(false);
	};

	const openPromoModal = () => {
		if (props.hasPaid) {
			return;
		}
		setModalOpen(true);
	};

	const handleClose = () => {
		setModalOpen(false);
	};

	const handleVerifyTransaction = async () => {
		const { orderID } = props;
		if (!orderID) {
			toast('Please make a transaction first', { type: 'info' });
			return;
		}
		setIsLoading(true);
		let verification_response;
		try {
			const config = {
				headers: {
					authorization: `Bearer ${token}`,
				},
			};
			verification_response = await (
				await axios.post('advert/payment/verify', { orderID }, config)
			).data;
		} catch (error) {
			setIsLoading(false);
			toast('Something went wrong', { type: 'error' });
			console.log('an error occured: ', error);
			return;
		}
		setIsLoading(false);
		console.log(verification_response);
		if (verification_response.status) {
			if (verification_response.message !== undefined) {
				toast(verification_response.message, { type: 'success' });
			}
			setHasPaid(true);
			props.handlePayChange(true, verification_response.transaction_id);
			return;
		}
		if (verification_response.error !== undefined) {
			toast(verification_response.error, { type: 'info' });
		}
	};

	function LoadingSpinner() {
		const [{ isPending }] = usePayPalScriptReducer();
		return isPending ? <CircularProgress color="inherit" /> : null;
	}

	function returnChoiceIcon(type) {
		if (type === 'Goal') {
			return <TrackChanges className={classes.icon} />;
		}

		if (type === 'Audience') {
			return <People className={classes.icon} />;
		}

		if (type === 'Budget and Duration') {
			return <Timelapse className={classes.icon} />;
		}
	}

	const classes = useStyles();

	const defaultOptions = {
		'client-id':
			'AZPap2blvLsfRhCkj563OtiznKN8e-gN4ZPsGvmq9OmEBIxETJiufMhWhBEnnQLeQwzLh0k-nnLlEq2H',
		intent: 'capture',
		commit: true,
		vault: false,
	};

	const modalBody = (
		<div style={modalStyle} className={classes.modal}>
			<h2>Select Payment Method</h2>
			<PayPalScriptProvider options={defaultOptions}>
				<LoadingSpinner />
				{isLoading ? <CircularProgress color="inherit" /> : null}
				<PayPalButtons
					style={{ layout: 'vertical' }}
					createOrder={async function(data, actions) {
						data.amount = props.price;
						data.currency = 'USD';
						return fetch(`${BASE_URI}/advert/payment/orders/create`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								authorization: `Bearer ${token}`,
								'xsrf-token': getCookie('A_SHH'),
							},
							body: JSON.stringify(data),
							credentials: 'include',
							mode: 'cors',
						})
							.then(function(res) {
								return res.json();
							})
							.then(function(data) {
								console.log(data);
								props.setOrderId(data.data.order.id);
								return data.data.order.id;
							});
					}}
					onApprove={function(data, actions) {
						const { orderID } = data;
						try {
							setIsLoading(true);
							return fetch(`${BASE_URI}/advert/payment/orders/capture`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									authorization: `Bearer ${token}`,
									'xsrf-token': getCookie('A_SHH'),
								},
								body: JSON.stringify({ orderID }),
								credentials: 'include',
								mode: 'cors',
							})
								.then(async function(res) {
									setIsLoading(false);
									const response = await res.json();
									if (!res.ok) {
										toast('Somethin went wrong', { type: 'error' });
										return;
									}
									if (res.error === 'INSTRUMENT_DECLINED') {
										return actions.restart();
									}
									toast(
										'Transaction complete for ' +
											response.capture.payer.name.given_name,
										{ type: 'success' }
									);
									setHasPaid(true);
									setModalOpen(false);
									props.handlePayChange(true, response.transaction_id);
								})
								.catch((error) => {
									setIsLoading(false);
									console.log(error);
									if (error.error) {
										toast(error.error, { type: 'error' });
										return;
									}
									toast('An error occured', { type: 'error' });
								});
						} catch (error) {
							if (error.response) {
								//axios error
								if (error.response.data.error !== undefined) {
									toast(error.response.data.error, { type: 'error' });
								}
								return;
							}
							console.log(error);
							toast('An error occured', { type: 'error' });
						}
					}}
				/>
			</PayPalScriptProvider>
			<div className="verify-transaction">
				<p>Mistakenly closed the window after clicking pay?</p>
				<ThemeProvider theme={theme}>
					<div className="nextBtnContainer">
						<Button
							variant="contained"
							onClick={handleVerifyTransaction}
							color="secondary"
							id="verifyTransBtn"
						>
							Verify Transaction
						</Button>
					</div>
				</ThemeProvider>
			</div>
		</div>
	);

	return (
		<div className="">
			<div className="">
				<Modal
					className={classes.dialog}
					onClose={handleClose}
					aria-labelledby="payment-modal"
					open={modalOpen}
				>
					{modalBody}
				</Modal>
				<div className="header">
					<h2>Review your advert</h2>
					{/* <span>What results would you like from this advert?</span> */}
				</div>
				<div className="grid-container">
					{props.choices.map((choice) => (
						<div className="choice grid-item" key={choice.type}>
							<div className={classes.icon}>
								{returnChoiceIcon(choice.type)}
							</div>
							<div className="choice-content">
								<p>{choice.type}</p>
								<span>{choice.choice}</span>
							</div>
						</div>
					))}
					<div className="grid-item" onClick={openPromoModal}>
						<div className={classes.icon}>
							<Payment className={classes.icon} />
						</div>
						<div className="choice">
							<p>Payment</p>
							<span style={{ color: props.hasPaid ? '#00ff00' : '#ff0000' }}>
								{' '}
								{props.hasPaid ? 'paid' : 'Pay to continue'}
							</span>
						</div>
						<div className="buttons">
							{props.hasPaid ? null : (
								<ThemeProvider theme={theme}>
									{props.hasPaid ? null : (
										<Warning
											color={props.hasPaid ? '' : 'primary'}
											fontSize="small"
										/>
									)}
								</ThemeProvider>
							)}
						</div>
					</div>
				</div>
				<p id="noteText">
					<b>NOTE:</b> YOUR PROMOTION WILL BE REVIEWED FOR AT LEAST 24 HOURS
					BEFORE IT BECOMES ACTIVE.
				</p>
				<ThemeProvider theme={theme}>
					<div className="nextBtnContainer">
						<Button
							variant="contained"
							disabled={!props.hasPaid}
							onClick={handleCreateAdvert}
							color="secondary"
							id="createPromoBtn"
						>
							{isLoading ? (
								<CircularProgress color="inherit" />
							) : (
								'Create Advert'
							)}
						</Button>
					</div>
				</ThemeProvider>
			</div>
		</div>
	);
}

export default withErrorHandler(Review, axios);
