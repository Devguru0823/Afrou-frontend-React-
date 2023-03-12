// jshint esversion: 8
// jshint esversion: 8
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from '../../utils/axiosConfig';
import Input from '../../components/Input/Input';
import Footer from '../../components/Footer/Footer';
import { onTryAuth, hideAlertMessage } from '../../redux/actions';
import { toastOptions } from '../../constants/toastOptions';
import { countryDialCodes } from '../../constants/countryDialCodes';
import '../Home/Home.css';
import axiosMain from 'axios';

import GoogleLogin from 'react-google-login';

const controls = {
	emailMobileRadio: {
		elementType: 'radio',
		elementConfig: [
			{
				type: 'radio',
				name: 'mobileOrEmail',
				id: 'emailId',
				value: 'emailMode',
			},
			{
				type: 'radio',
				name: 'mobileOrEmail',
				id: 'mobileId',
				value: 'mobileMode',
			},
		],
		value: 'emailMode',
		validation: {
			required: true,
		},
		label: [
			<label className="form-check-label" htmlFor="emailId">
				Email
			</label>,
			<label className="form-check-label" htmlFor="mobileId">
				Mobile
			</label>,
		],
		valid: true,
		touched: true,
		onlyClassName: 'form-check-input',
		onlyOuterClassName:
			'form-check form-check-inline col-12 radio-mode displayNone',
	},
	countryTelephoneCode: {
		elementType: 'reactSelect',
		elementConfig: {
			options: countryDialCodes.map((dialCode) => ({
				value: dialCode.dial_code.substr(1),
				label: `${dialCode.dial_code} ${dialCode.name}`,
			})),
			styles: {
				container: (provided) => ({ ...provided, marginBottom: '26px' }),
				menuList: (provided) => ({ ...provided, maxHeight: '190px' }),
				control: (provided) => ({ ...provided, height: '43px' }),
			},
			isDisabled: false,
		},
		value: { label: '+213 Algeria', value: '213' },
		validation: {},
		valid: true,
		onlyClassName: 'mobile-code-choose',
		onlyOuterClassName: 'col-12 logcountry',
	},
	email: {
		elementType: 'input',
		elementConfig: {
			type: 'input',
			placeholder: 'Email or phone number',
			/*'data-tip': 'tooltip',
      'data-for': 'emailOrPhone'*/
		},
		value: '',
		validation: {
			required: true,
			isEmailOrPhone: true,
		},
		valid: false,
		touched: false,
		outerClassName: 'col-12 loguser',
	},
	password: {
		elementType: 'input',
		elementConfig: {
			type: 'password',
			placeholder: 'Password',
		},
		value: '',
		validation: {
			required: true,
			minLength: 6,
		},
		valid: false,
		touched: false,
		outerClassName: 'col-12 logpass',
	},
};

class Login extends Component {
	state = {
		controls: controls,
		isSignup: false,
		formIsValid: false,
		dataLoaded: false,
		countryCallingCode: null,
		userIp: '',
	};

	_isMounted = true;

	// getCsrf() {
	// 	try {
	// 		axiosMain
	// 			.get('https://manager.afrocamgist.com/xsrf', {
	// 				withCredentials: true,
	// 			})
	// 			.then((res) => {
	// 				return;
	// 			})
	// 			.catch((err) => {
	// 				console.log(err.message);
	// 				toast(err.response?.message || err.message, { type: 'error' });
	// 				return;
	// 			});
	// 	} catch (error) {
	// 		if (error.response) {
	// 			console.log(error.response.data);
	// 			return;
	// 		}
	// 		console.log(error);
	// 	}
	// }

	static getDerivedStateFromProps(props, state) {
		if (state.countryCallingCode !== null && !state.dataLoaded) {
			return {
				...state,
				dataLoaded: true,
				controls: {
					...state.controls,
					countryTelephoneCode: {
						...state.controls.countryTelephoneCode,
						value: state.countryCallingCode,
					},
				},
			};
		}
		return null;
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.showMessage && this._isMounted) {
			toast.success(this.props.alertMessage, toastOptions);
			this.props.hideAlertMessage();
			this.setState({ controls: controls });
		}
		/*if (prevState.controls.emailMobileRadio.value !== this.state.controls.emailMobileRadio.value) {
      this.setState(state => ({
        ...state,
        controls: {
          ...state.controls,
          email: {
            ...state.controls.email,
            elementConfig: {
              ...state.controls.email.elementConfig,
              placeholder: this.state.controls.emailMobileRadio.value === 'emailMode'
                ? 'Please enter email address'
                : 'Please enter phone number'
            }
          },
          countryTelephoneCode: {
            ...state.controls.countryTelephoneCode,
            elementConfig: {
              ...state.controls.countryTelephoneCode.elementConfig,
              isDisabled: this.state.controls.emailMobileRadio.value === 'emailMode'
            }
          }
        }
      }));
    }*/
	}

	componentDidMount() {
		if (this._isMounted) {
			// this.getCsrf();
			(async function() {
				const ipResponse = await (
					await axios.get(
						`https://api.ipgeolocation.io/ipgeo?apiKey=56502c05dfd54cd48e539d39b2b75d14`
					)
				).data;
				const userAgentDetails = await (
					await axios.get(
						`https://api.ipgeolocation.io/user-agent?apiKey=56502c05dfd54cd48e539d39b2b75d14`
					)
				).data;

				if (!ipResponse) {
					toast('Please check your internet connection', {
						position: 'top-center',
						type: 'error',
					});
					return;
				}

				const ipDetails = {
					country:
						ipResponse.country_name === 'Unknown'
							? undefined
							: ipResponse.country_name,
					browser:
						userAgentDetails.name === 'Unknown'
							? undefined
							: userAgentDetails.name,
					device_type:
						userAgentDetails.type === 'Unknown'
							? undefined
							: userAgentDetails.type,
					device_name:
						userAgentDetails.device.name === 'Unknown'
							? undefined
							: userAgentDetails.device.name,
					device_cpu:
						userAgentDetails.device.CPU === 'Unknown'
							? undefined
							: userAgentDetails.device.CPU,
					os:
						userAgentDetails.operatingSystem.name === 'Unknown'
							? undefined
							: userAgentDetails.operatingSystem.name,
				};
				// set device details in localstorage
				try {
					localStorage.setItem(
						'login_device_detail',
						JSON.stringify(ipDetails)
					);
				} catch (error) {
					toast('Something went wrong please refresh', {
						position: 'top-center',
						type: 'warning',
					});
				}
			})();
			axiosMain
				.get(
					`https://api.ipgeolocation.io/ipgeo?apiKey=bbf98c92554245b2adf35badb5b2da07`
				)
				.then((response) => {
					console.log(response.data);
					this.setState({
						countryCallingCode: {
							value: response.data.calling_code.substr(1),
							label: `${response.data.calling_code} ${response.data.country_name}`,
						},
					});
				})
				.catch((err) => {
					console.log(err);
				});
			window.scrollTo(0, 0);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	checkValidity = (value, rules) => {
		let isValid = true;
		if (!rules) {
			return true;
		}

		if (rules.required) {
			isValid = value.trim() !== '' && isValid;
		}

		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}

		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid;
		}

		if (rules.isEmail) {
			const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			isValid = pattern.test(value) && isValid;
		}

		if (rules.isEmailOrPhone) {
			const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			const mobilePattern = /(\d{10})|(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
			isValid =
				(emailPattern.test(value) || mobilePattern.test(value)) && isValid;
		}

		if (rules.isNumeric) {
			const pattern = /^\d+$/;
			isValid = pattern.test(value) && isValid;
		}

		return isValid;
	};

	inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: this.checkValidity(
					event.target.value,
					this.state.controls[controlName].validation
				),
				touched: true,
			},
		};
		let formIsValid = true;
		for (let inputIdentifier in updatedControls) {
			formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
		}
		this.setState({ controls: updatedControls, formIsValid: formIsValid });
	};
	responseGoogle = (response) => {
		if (!response) {
			return toast('Check your internet connection and try again', {
				position: 'top-center',
				type: 'warning',
			});
		}

		if (response.type === 'error') {
			toast('Please check your internet connection and try again', {
				position: 'top-center',
				type: 'error',
			});
			return;
		}

		if (response.error && response.error === 'popup_closed_by_user') {
			toast('Signin canceled', { position: 'top-center', type: 'warning' });
			return;
		}
		this.props.onTryAuth(
			{
				username: response.profileObj.name,
				email: response.profileObj.email,
				google_id: response.profileObj.googleId,
				first_name: response.profileObj.givenName,
				last_name: response.profileObj.familyName,
				type: 'google',
			},
			'google'
		);
	};
	submitHandler = (event) => {
		event.preventDefault();
		let username = this.state.controls.email.value;
		const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		const mobilePattern = /(\d{10})|(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
		if (mobilePattern.test(username)) {
			if (username.charAt(0) === '0') {
				username = username.substr(1);
			}
			username = `${this.state.controls.countryTelephoneCode.value.value}${username}`;
		} else {
			if (!emailPattern.test(username)) {
				return toast.error(
					'Please enter a valid email or mobile number',
					toastOptions
				);
			}
		}

		console.log(this.state.userIp);

		const authData = {
			username: username,
			password: this.state.controls.password.value,
			device_details: [
				navigator.userAgent,
				navigator.vendor,
				navigator.hardwareConcurrency,
				{ ip: this.state.userIp },
			],
		};
		if (this.state.formIsValid) {
			if (this.state.isSignup) {
				this.props.onTryAuth(authData, 'signup');
			} else {
				this.props.onTryAuth(
					{
						username: authData.username,
						password: authData.password,
						login_device_detail: authData.device_details,
					},
					'login'
				);
			}
		} else {
			toast.warn(
				'Please make sure all fields are filled out correctly',
				toastOptions
			);
		}
	};

	render() {
		const { from } = this.props.location.state || {
			from: { pathname: '/afroswagger' },
		};

		let authRedirect = null;

		if (this.props.isAuthenticated) {
			authRedirect = <Redirect to={from} />;
		}

		if (this.props.location.search) {
			this.props.history.push('/');
			this.props.history.go(0);
		}

		const formElementsArray = [];
		for (let key in this.state.controls) {
			formElementsArray.push({
				id: key,
				config: this.state.controls[key],
			});
		}

		let form = formElementsArray.map((formElement) => (
			<Input
				key={formElement.id}
				elementType={formElement.config.elementType}
				elementConfig={formElement.config.elementConfig}
				value={formElement.config.value}
				invalid={!formElement.config.valid}
				shouldValidate={formElement.config.validation}
				touched={formElement.config.touched}
				label={formElement.config.label}
				className={formElement.config.className}
				outerClassName={formElement.config.outerClassName}
				onlyClassName={formElement.config.onlyClassName}
				onlyOuterClassName={formElement.config.onlyOuterClassName}
				changed={(event) => this.inputChangedHandler(event, formElement.id)}
			/>
		));

		let errorMessage = null;

		if (this.props.error) {
			errorMessage = <p>{this.props.error.message}</p>;
		}

		return (
			<div>
				<section className="bannerhomepage">
					<div className="container" style={{ paddingBottom: '10px' }}>
						<div className="bannerconts">
							<div
								className={
									this.state.isSignup
										? `rightformarear homeregarea`
										: `rightformarear homelogarea`
								}
							>
								<div className="attrlogtext">
									AfroWorld
									<small>Afro Swagger</small>
								</div>
								{errorMessage}
								<div className="smallheader">
									{this.state.isSignup ? 'Sign up' : 'Login'}
								</div>
								<form onSubmit={this.submitHandler}>
									<div className="row">{form}</div>
									<div className="authButtons">
										<button
											className="buttonlogin"
											disabled={this.props.isLoading}
										>
											{this.state.isSignup ? 'SIGNUP' : 'LOGIN'}
										</button>
										<GoogleLogin
											id="googleLoginBtn"
											clientId="881510618695-26q6v8mpcnji2am2t61m73dao9c5a7p5.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
											buttonText="LOGIN WITH GOOGLE"
											onSuccess={this.responseGoogle}
											onFailure={this.responseGoogle}
											className="buttonlogin googlebtnlogin"
										/>
									</div>
								</form>
								<ReactTooltip
									id="emailOrPhone"
									event="focusin"
									eventOff="focusout"
									getContent={() =>
										this.state.controls.emailMobileRadio.value ===
										'mobileMode' ? (
											<p>
												Please add phone number without the country code e.g.
												9000090000
											</p>
										) : (
											<p>Please enter email address</p>
										)
									}
									effect="solid"
									place={'top'}
									border={true}
									type={'dark'}
									className={'tooltip-react'}
								/>
								<div className="clearfix" />
								<div className="isregister">
									Don't have an account? Please{' '}
									<Link to="/register">Register here</Link>
								</div>
								<div className="isregister">
									<Link to="/forgot-password">Forgot password?</Link>
								</div>
								<div className="clearfix" />
								{this.state.isSignup ? (
									<div
										style={{
											width: '100%',
											clear: 'both',
											marginTop: '20px',
											color: '#fff',
											fontSize: '12px',
										}}
									>
										<p>
											By signing up, you agree to our
											<a target="_blank" href="" className="terms">
												Terms
											</a>
											and that you have read our
											<a target="_blank" href="" className="terms">
												Privacy Policy
											</a>{' '}
											and
											<a target="_blank" href="" className="terms">
												Content Policy
											</a>
											.
										</p>
									</div>
								) : null}
							</div>
							<div className="lefttextarear">{authRedirect}</div>
						</div>
					</div>
				</section>
				<div className="clearfix" />
				<Footer idName="homefooter" />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.isLoading,
		isAuthenticated: !!state.auth.token,
		alertMessage: state.ui.alertMessage,
		showMessage: state.ui.showMessage,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onTryAuth: (authData, authMode) => dispatch(onTryAuth(authData, authMode)),
		hideAlertMessage: () => dispatch(hideAlertMessage()),
	};
};

export default withErrorHandler(
	connect(mapStateToProps, mapDispatchToProps)(Login),
	axios
);
