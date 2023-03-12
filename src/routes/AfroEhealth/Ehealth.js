// jshint esversion:9
import React, { Component } from 'react';
import EhealthUI from './Ehealth-UI';
import axios from '../../utils/axiosConfig';
import axiosMain from 'axios';
import { toast } from 'react-toastify';
import { keys } from '../../constants/keys';
// import {} from '@material-ui/core';
import withErrorHandler from '../../utils/withErrorHandler';

const initialState = {
	plans: [],
	plan: {},
	page: 1,
	patientDetails: {},
	cardDetails: {},
	user_id: '',
	price: 0,
	currency: 'USD',
	authorization: {},
	otp: '',
	flw_ref: '',
	isLoading: false,
};

const user = JSON.parse(localStorage.getItem('user'));

class Ehealth extends Component {
	state = {
		plans: [],
		plan: {},
		testimonials: [],
		page: 1,
		patientDetails: {},
		cardDetails: {},
		user_id: '',
		price: 0,
		currency: 'NGN',
		authorization: {},
		otp: '',
		flw_ref: '',
		isLoading: false,
		patientIsUser: !user,
	};

	componentDidMount() {
		Promise.all([axios.get('/ehealth'), axios.get('/ehealth/testimonials')])
			.then(([ehealthResult, testimonialResult]) => {
				this.setState({
					plans: ehealthResult.data.data,
					testimonials: testimonialResult.data.data,
				});
			})
			.catch((err) => {
				toast(err.message, { type: 'error', position: 'top-center' });
			});
	}

	/**
	 * *Function to set loader on page
	 * @param {boolean} val
	 */
	setIsLoading = (val) => {
		this.setState((prev, props) => {
			return { ...prev, isLoading: val };
		});
	};

	setPatientIsUser = (val) => {
		this.setState((prev, props) => {
			return { ...prev, patientIsUser: val };
		});
	};

	updatePrice = (price) => {
		console.log('Updating price: ', price);
		this.setState({ price });
	};

	updateAuthorization = (field, update) => {
		this.setState((prev, props) => {
			let authorization = { ...prev.authorization };
			authorization[field] = update;
			return { ...prev, authorization };
		});
	};

	updatePin = (pin) => {
		this.setState((prev, props) => {
			return { ...prev, pin };
		});
	};

	updateOTP = (otp) => {
		this.setState((prev, props) => {
			return { ...prev, otp };
		});
	};

	nextPage = () => {
		this.setState((prev, next) => {
			const newState = { ...prev, page: prev.page + 1 };
			return newState;
		});
	};

	setPage = (page) => {
		this.setState((prev, next) => {
			return { ...prev, page };
		});
	};

	setPatientDetails = (details) => {
		this.setState((prev, next) => {
			return { ...prev, patientDetails: details };
		});
	};

	updateUserId = (id) => {
		this.setState((prev, props) => {
			return { ...prev, user_id: id };
		});
		this.nextPage();
	};

	setPlan = (plan) => {
		this.setState((prev, props) => {
			return { ...prev, plan };
		});
	};

	updateCurrency = async (currency) => {
		this.setState((prev, props) => {
			return { ...prev, currency };
		});

		let convertedResponse;
		if (currency === 'NGN') {
			convertedResponse = await this.convertCurrencyAmount();
			if (!convertedResponse || !convertedResponse.data) {
				return toast(
					'A network error occured, check your connection and try again',
					{ position: 'top-center', type: 'error' }
				);
			}
			const NGNAmount = convertedResponse.data.NGN;
			return this.setState((prev, props) => {
				return {
					...prev,
					price: Number.parseInt(prev.price) * Number.parseInt(NGNAmount),
					isLoading: false,
				};
			});
		}
		return this.setState((prev, props) => {
			return { ...prev, price: prev.plan.price };
		});
	};

	collectPaitentDetails = (data) => {
		console.log(data);
		console.log(this);
		this.setState((prev, next) => {
			const newState = { ...prev, patientDetails: data };
			return newState;
		});
		this.nextPage();
	};

	convertCurrencyAmount = async () => {
		const BASE_URI = `https://api.currconv.com/api/v7/convert?q=`;

		let fromCurrency = encodeURIComponent('NGN');
		let toCurrency = encodeURIComponent('USD');
		let query = fromCurrency + '_' + toCurrency;

		const url =
			BASE_URI +
			query +
			'&compact=ultra&apiKey=' +
			keys.CURRENCY_CONVERTER_API_KEY;
		let response;
		this.setState((prev, props) => {
			return { ...prev, isLoading: true };
		});
		try {
			response = await (await axiosMain.get(url)).data;
		} catch (error) {
			console.log(error.response.data);
			return toast('Could not convert currency', {
				position: 'top-center',
				type: 'error',
			});
		}

		return response;
	};

	updateFields = (field, update) => {
		this.setState((prev, props) => {
			let flw_fields_data = { ...prev.flw_fields_data };
			flw_fields_data[field] = update;
			return { ...prev, flw_fields_data };
		});
	};

	makePayment = async () => {
		this.setState((prev, props) => {
			return { ...prev, isLoading: true };
		});
		const url = '/payment/flutterwave/create';
		const user = JSON.parse(localStorage.getItem('user'));
		const data = {
			amount: `${this.state.price}`,
			currency: `${this.state.plan.currency}`,
			customer: {
				email: this.state.patientDetails.email,
				first_name: this.state.patientDetails.first_name,
				last_name: this.state.patientDetails.last_name,
				phone_number: this.state.patientDetails.phone
					? this.state.patientDetails.phone
					: undefined,
				isNewCustomer: !JSON.parse(localStorage.getItem('user')),
				user_id: user,
			},
			plan_id: this.state.plan._id,
		};

		console.log('Request data: ', data);

		let response = {};

		try {
			response = await (await axios.post(url, data)).data;
		} catch (error) {
			this.setIsLoading(false);
			if (error.response) {
				console.log(error.response);
				return toast(error.response.data.message, {
					type: 'error',
					position: 'top-center',
				});
			}

			return toast('An error occured', {
				type: 'error',
				position: 'top-center',
			});
		}

		this.setIsLoading(false);

		console.log(response);

		if (!response) {
			return;
		}

		if (!response.status) {
			return toast(response.message, { type: 'error', position: 'top-center' });
		}

		window.open(response.data.link, '_parent');
	};

	render() {
		return (
			<>
				<EhealthUI
					plans={this.state.plans}
					plan={this.state.plan}
					testimonials={this.state.testimonials}
					page={this.state.page}
					patientDetails={this.state.patientDetails}
					isLoading={this.state.isLoading}
					price={this.state.price}
					otp={this.state.otp}
					authorization={this.state.authorization}
					currency={this.state.plan.currency}
					setIsLoading={this.setIsLoading}
					nextPage={this.nextPage}
					setPage={this.setPage}
					setPlan={this.setPlan}
					updateUserId={this.updateUserId}
					updatePin={this.updatePin}
					updateOTP={this.updateOTP}
					updateCurrency={this.updateCurrency}
					updateAuthorization={this.updateAuthorization}
					collectPatientDetails={this.collectPaitentDetails}
					makePayment={this.makePayment}
					updatePrice={this.updatePrice}
					setPatientIsUser={this.setPatientIsUser}
					setPatientDetails={this.setPatientDetails}
					{...this.props}
				/>
			</>
		);
	}
}

export default withErrorHandler(Ehealth, axios);
