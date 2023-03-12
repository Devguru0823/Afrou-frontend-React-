// jshint esversion:9
import React from 'react';
// import Card from 'react-credit-cards';

// import { CircularProgress } from '@material-ui/core';

import axios from '../../../utils/axiosConfig';

import './Payment.css';

import {
	formatCreditCardNumber,
	formatCVC,
	formatExpirationDate,
	// formatFormData,
} from '../../../utils/card-utils';

import 'react-credit-cards/es/styles-compiled.css';

export default class Flutterwave extends React.Component {
	state = {
		number: '',
		name: '',
		expiry: '',
		cvc: '',
		issuer: '',
		focused: '',
		formData: null,
		isLoading: false,
	};

	handleCallback = ({ issuer }, isValid) => {
		if (isValid) {
			this.setState({ issuer });
		}
	};

	handleInputFocus = ({ target }) => {
		this.setState({
			focused: target.name,
		});
	};

	handleInputChange = ({ target }) => {
		if (target.name === 'number') {
			target.value = formatCreditCardNumber(target.value);
		} else if (target.name === 'expiry') {
			target.value = formatExpirationDate(target.value);
		} else if (target.name === 'cvc') {
			target.value = formatCVC(target.value);
		}

		this.setState({ [target.name]: target.value });
	};

	setIsLoading = (val) => {
		this.setState((prev, props) => {
			const newState = { ...prev, isLoading: val };
			return newState;
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.makePayment();
	};

	render() {
		const BASE_URI = axios.defaults.baseURL;
		const { name, number, expiry, cvc, focused, issuer } = this.state;

		return (
			<div key="Payment">
				<div className="App-payment">
					{/* <Card
						number={number}
						name={name}
						expiry={expiry}
						cvc={cvc}
						focused={focused}
						callback={this.handleCallback}
					/> */}
					<form ref={(c) => (this.form = c)} onSubmit={this.handleSubmit}>
						{/* <div className='form-group'>
							<input
								type='tel'
								name='number'
								className='form-control'
								placeholder='Card Number'
								pattern='[\d| ]{16,22}'
								required
								onChange={this.handleInputChange}
								onFocus={this.handleInputFocus}
							/>
							<small>E.g.: 49..., 51..., 36..., 37...</small>
						</div>
						<div className='form-group'>
							<input
								type='text'
								name='name'
								className='form-control'
								placeholder='Name'
								required
								onChange={this.handleInputChange}
								onFocus={this.handleInputFocus}
							/>
						</div>
						<div className='row'>
							<div className='col-6'>
								<input
									type='tel'
									name='expiry'
									className='form-control'
									placeholder='Valid Thru'
									pattern='\d\d/\d\d'
									required
									onChange={this.handleInputChange}
									onFocus={this.handleInputFocus}
								/>
							</div>
							<div className='col-6'>
								<input
									type='tel'
									name='cvc'
									className='form-control'
									placeholder='CVC'
									pattern='\d{3,4}'
									required
									onChange={this.handleInputChange}
									onFocus={this.handleInputFocus}
								/>
							</div>
						</div>
						<input type='hidden' name='issuer' value={issuer} /> */}
						<div className="form-actions">
							<button className="btn btn-primary btn-block">
								MAKE PAYMENT
							</button>
						</div>
					</form>
					<hr style={{ margin: '30px 0' }} />
				</div>
			</div>
		);
	}
}
