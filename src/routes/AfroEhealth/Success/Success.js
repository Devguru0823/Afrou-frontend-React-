import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/axiosConfig';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import './Success.css';

export default function SuccessPage(props) {
	const query = useQuery();

	const gateway = query.get('gateway');
	const orderID = query.get('orderId');
	const amount = query.get('amount');
	const status = query.get('status');
	const tx_ref = query.get('tx_ref');
	const transaction_id = query.get('transaction_id');

	const [paymentStatus, setPaymentStatus] = useState('');
	const [processor_response, setProcessorResponse] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	const history = useHistory();

	useEffect(() => {
		let ismounted = true;
		if (ismounted) {
			(async () => {
				window.scrollTo(0, 0);
				let response = {};

				if (status === 'cancelled') {
					alert('Payment cancelled');
					return history.push('/ehealth');
				}

				// send request to verify transaction
				try {
					setIsLoading(true);
					let endpoint = '';
					let post_data = {};
					if (gateway === 'paypal') {
						endpoint = `/ehealth/subscribe?gateway=${gateway}&amount=${amount}&orderID=${orderID}`;
					} else {
						endpoint = '/ehealth/subscribe';
						post_data = {
							status,
							tx_ref,
							transaction_id,
						};
					}
					response = await (
						await axios.post(endpoint, {
							payment: {
								...post_data,
							},
						})
					).data;
				} catch (error) {
					setIsLoading(false);
					setError(true);
					toast('Could not verify payment', {
						type: 'error',
						position: 'top-center',
					});
					return;
				}

				console.log(response);

				setIsLoading(false);

				if (!response) {
					setError(true);
					return toast('Could not verify payment, please refresh page', {
						type: 'error',
						position: 'top-center',
					});
				}

				if (!response.status) {
					setPaymentStatus(response.data.status);
					setProcessorResponse(response.data.processor_response);
					return;
				}

				setPaymentStatus(response.data.status);
				if (gateway === 'paypal') {
					setProcessorResponse(
						`Payment complete for ${response.data.payer.name.given_name} ${response.data.payer.name.surname}`
					);
				} else {
					setProcessorResponse(response.data.processor_response);
				}
			})();
		}

		return () => (ismounted = false);
	}, []);

	const useStyles = makeStyles((theme) => ({
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff',
		},
	}));

	const handleCloseBackdrop = () => {
		if (isLoading) {
			return;
		}
		setIsLoading(false);
	};

	const handleBtnClick = () => {
		props.history.push('/ehealth');
	};

	const classes = useStyles();

	return (
		<>
			<Backdrop
				className={classes.backdrop}
				open={isLoading}
				onClick={handleCloseBackdrop}
			>
				<CircularProgress color="inherit" />
			</Backdrop>

			<div class="main-container">
				<div class="top-container">
					{paymentStatus === 'successful' || paymentStatus === 'COMPLETED' ? (
						<i class="fa fa-check-circle-o bigger-size" aria-hidden="true"></i>
					) : paymentStatus === 'pending' ? (
						<i class="fa fa-circle-exclamation"></i>
					) : (
						<i class="fa fa-xmark"></i>
					)}
				</div>

				<div class="bottom-container">
					<h1>{paymentStatus.toUpperCase()}</h1>
					<p>
						{processor_response}.
						{paymentStatus === 'successful'
							? 'An invoice receipt will be sent to your mail, please do well to check. Thanks!'
							: null}
					</p>
					{error ? (
						<button onClick={() => window.location.reload()}>Refresh</button>
					) : (
						<button onClick={handleBtnClick}>Dismiss</button>
					)}
					{/* <button onClick={handleBtnClick}>Dismiss</button> */}
				</div>
			</div>
		</>
	);
}

function useQuery() {
	return new URLSearchParams(useLocation().search);
}
