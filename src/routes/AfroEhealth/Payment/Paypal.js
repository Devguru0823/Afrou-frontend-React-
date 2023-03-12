import React from 'react';

import { CircularProgress } from '@material-ui/core';
import { toast } from 'react-toastify';
import getCookie from '../../../constants/getCookies';
import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import axios from '../../../utils/axiosConfig';
import { useState } from 'react';

const BASE_URI = axios.defaults.baseURL;

function LoadingSpinner() {
	const [{ isPending }] = usePayPalScriptReducer();
	return isPending ? <CircularProgress color="inherit" /> : null;
}

export default function Paypal(props) {
	// states
	const [isLoading, setIsLoading] = useState(false);

	const { price, currency } = props;
	const defaultOptions = {
		'client-id':
			'AZPap2blvLsfRhCkj563OtiznKN8e-gN4ZPsGvmq9OmEBIxETJiufMhWhBEnnQLeQwzLh0k-nnLlEq2H',
		intent: 'capture',
		commit: true,
		vault: false,
	};

	const user = JSON.parse(localStorage.getItem('user'));

	return (
		<PayPalScriptProvider options={defaultOptions}>
			<LoadingSpinner />
			{isLoading ? <CircularProgress color="inherit" /> : null}
			<PayPalButtons
				style={{ layout: 'vertical' }}
				createOrder={async function(data, actions) {
					data.amount = price;
					data.currency = currency;
					data.customer = {
						email: user ? user.email : props.patientDetails.email,
						first_name: user
							? user.first_name
							: props.patientDetails.first_name,
						last_name: user ? user.last_name : props.patientDetails.last_name,
						phone_number:
							user && user.phone
								? user.phone
								: props.patientDetails.phone
								? props.patientDetails.phone
								: undefined,
						isNewCustomer: !JSON.parse(localStorage.getItem('user')),
						user_id: user ? user.user_id : undefined,
					};
					data.plan_id = props.plan._id;
					return fetch(`${BASE_URI}/payment/paypal/orders/`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
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
							return data.data.order.id;
						})
						.catch((err) => {
							toast('An error occured while processing your request', {
								type: 'error',
								position: 'top-center',
							});
							return err;
						});
				}}
				// TODO: remove all errors
				onApprove={function(data, actions) {
					const { orderID } = data;
					const request_data = {
						orderID,
					};
					try {
						setIsLoading(true);
						return fetch(`${BASE_URI}/payment/paypal/capture`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'xsrf-token': getCookie('A_SHH'),
							},
							body: JSON.stringify(request_data),
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
								console.log('Capture response: ', response);
								window.location.href = `/ehealth/verify?gateway=paypal&orderId=${orderID}&amount=${response.capture.purchase_units[0].payments.captures[0].amount.value}`;
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
	);
}
