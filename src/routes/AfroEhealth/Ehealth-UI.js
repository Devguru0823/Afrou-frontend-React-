// jshint esversion:9
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EhealthStyles from './Style';
import { Form, Field } from 'react-final-form';
import {
	Accordion,
	Form as B4Form,
	Button,
	Container,
	Row,
	Col,
	FormCheck,
	Modal,
	Carousel,
} from 'react-bootstrap';
import {
	Stepper,
	Step,
	StepLabel,
	Backdrop,
	CircularProgress,
	makeStyles,
} from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import Gateways from './Gateways/Gateways';
import LoginModal from '../../containers/Login/LoginModal';
import { BASE_URL } from '../../constants/ImageUrls';
import ReactPlayer from '../../components/CustomReactPlayer/CustomReactPlayer';
import axios from '../../utils/axiosConfig';
import { socket } from '../../redux/actions/socket';
import CryptoJs from 'crypto-js';
import { toast } from 'react-toastify';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const required = (value) => (value ? undefined : 'Required');
const mustBeNumber = (value) => (isNaN(value) ? 'Must be a number' : undefined);
const minValue = (min) => (value) =>
	isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`;

const isValidEmail = (value) =>
	emailRegex.test(value) ? undefined : 'Invalid email address';

const composeValidators = (...validators) => (value) =>
	validators.reduce((error, validator) => error || validator(value), undefined);

function MyVerticallyCenteredModal(props) {
	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			{/* <Modal.Header closeButton></Modal.Header> */}
			<Modal.Body className="p-0" style={{ backgroundColor: '#8c8c8c' }}>
				<CloseOutlined onClick={props.onHide} color="#fff" />
				<LoginModal
					{...props}
					location={{
						hash: '',
						pathname: '/ehealth',
						search: '',
						state: '/ehealth',
					}}
				/>
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}

function EhealthUI(props) {
	console.log(props);
	const steps = ['Choose Plan', 'Customer Details', 'Payment'];

	const query = useQuery();

	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
	const [first_name, setFirstName] = useState('');
	const [last_name, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [repeat_password, setRepeatPassword] = useState('');
	const [checked, setChecked] = useState('off');
	const [modalShow, setModalShow] = useState(false);

	useEffect(() => {
		const page = query.get('page');
		const price = query.get('price');
		const plan_id = query.get('plan_id');
		const currency = query.get('currency');
		const country = query.get('country');

		console.log('Rendered....');

		if (page) {
			props.setPage(Number.parseInt(page));
			console.log(price);
			props.updatePrice(price ? Number.parseInt(price) : '');
			// props.updateCurrency(currency);
			const planObject = {
				_id: plan_id,
				currency,
				country,
			};
			props.setPlan(planObject);
		}

		if (props.page === 2 || Number.parseInt(page) === 2) {
			const user = localStorage.getItem('user');
			const token = localStorage.getItem('token');

			if (!user) return;

			console.log('Fetching user details.....');
			props.setIsLoading(true);
			const userId = user;
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			axios
				.get(`/profile/${userId}`, config)
				.then((response) => {
					socket.emit('getEncKeys', {}, (err, obj) => {
						if (err) {
							console.log(err);
							return;
						}
						props.setIsLoading(false);
						const bytesData = CryptoJs.AES.decrypt(response.data.data, obj.k);
						const userDetails = JSON.parse(
							bytesData.toString(CryptoJs.enc.Utf8)
						);
						console.log('User details fetched... ', userDetails);
						setFirstName(userDetails.first_name);
						setLastName(userDetails.last_name);
						setEmail(userDetails.email);
						setPhone(userDetails.phone ? userDetails.phone : '');
						setChecked('on');
						const details = {
							first_name: userDetails.first_name,
							last_name: userDetails.last_name,
							email: userDetails.email,
							phone: userDetails.phone ? userDetails.phone : undefined,
						};
						props.setPatientDetails(details);
					});
				})
				.catch((err) => {
					props.setIsLoading(false);
					if (err.response) {
						toast(err.response.message, { type: 'error' });
					} else {
						toast(err.message, { type: 'error' });
					}
				});
		}

		// console.log(checked === 'on');
		// if (checked === 'on') {
		// 	console.log('setting values');
		// 	setFirstName(user.first_name);
		// 	setLastName(user.last_name);
		// 	setEmail(user.email);
		// 	setPhone(user.phone ? user.phone : '');
		// }

		return window.scrollTo(0, 0);
	}, [props.page]);

	const useStyles = makeStyles((theme) => ({
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff',
		},
	}));

	const handleCloseBackdrop = () => {
		if (props.isLoading) {
			return;
		}
		props.setIsLoading(false);
	};

	const handlePlanSelect = (e, plan) => {
		props.updatePrice(plan.price);
		props.setPlan(plan);
		props.nextPage();
	};

	const onSubmit = (values) => {
		console.log(values);
		const user = JSON.parse(localStorage.getItem('user'));
		if (user) {
			return props.updateUserId(user._id);
		}
		const data = {
			first_name,
			last_name,
			email,
			phone,
			password,
			repeat_password,
		};

		console.log(data);

		props.collectPatientDetails(data);
	};

	const handleCheckChange = (e) => {
		e.persist();
		if (!user) {
			return setModalShow(true);
		}
		console.log(e.target.checked);
		if (e.target.checked) {
			setFirstName(user.first_name);
			setLastName(user.last_name);
			setEmail(user.email);
			setPhone(user.phone ? user.phone : '');
			setChecked('on');
			props.setPatientIsUser(false);
		} else {
			setFirstName('');
			setLastName('');
			setEmail('');
			setPhone('');
			setChecked('off');
			props.setPatientIsUser(true);
		}
	};

	const classes = useStyles();

	return (
		<EhealthStyles>
			<section id="ehealth">
				<Backdrop
					className={classes.backdrop}
					open={props.isLoading}
					onClick={handleCloseBackdrop}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
				<MyVerticallyCenteredModal
					show={modalShow}
					onHide={() => setModalShow(false)}
					{...props}
				/>
				{props.page === 1 ? (
					<>
						<div className="ehealth-top">
							<div className="row m-0">
								<div className="col-md-6">
									<div className="ehealth-logo">
										<img
											id="ehealth-logo"
											src="/images/ehealth--logo.png"
											alt="Afro-ehealth logo"
										/>
										<h1>Welcome to Afro E-health</h1>
										{/* <h1
											style={{
												textAlign: 'center',
												fontSize: '32px',
												color: '#752a2a',
											}}
										>
											Afro E-health
										</h1> */}
									</div>
								</div>
								<div className="col-md-6">
									<div className="ehealth-top-content">
										<div>
											<p>
												Why pay thousands on sicness treatment when you can{' '}
												<span className="highlight-text">
													insure yourself and your loved ones for a penny!
												</span>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="ehealth-body shadow-lg">
							<div className="row" id="ehealth-body-wrapper">
								<div className="col-md-6">
									<div className="ehealth-btn-container">
										<button className="ehealth-btn">
											Buy health insurance plan
										</button>
									</div>
									{props.plans.map((plan) => (
										<Accordion
											defaultActiveKey={plan._id}
											flush
											key={plan._id}
											alwaysOpen={plan.subPlans.length > 0}
										>
											<Accordion.Item eventKey={plan._id}>
												<Accordion.Header>
													<div className="d-flex justify-content-between align-items-center">
														<span className="counter">
															{props.plans.findIndex(
																(x) => x.name === plan.name
															) + 1}
														</span>{' '}
														<span>{plan.name} </span>
														{plan.subPlans.length > 0 ? null : (
															<span className="price">
																{/* {Intl.NumberFormat('en-US', {
																currency: 'USD',
																style: 'currency'
															}).format(plan.price)} */}
																{plan.price}
															</span>
														)}
													</div>
												</Accordion.Header>
												<Accordion.Body>
													{plan.description ? plan.description : null}
													{plan.subPlans.map((subPlan) => (
														<Accordion defaultActiveKey="0" key={subPlan._id}>
															<Accordion.Item eventKey={subPlan._id}>
																<Accordion.Header>
																	<div className="d-flex justify-space-between">
																		<span>
																			{subPlan.name}{' '}
																			<div className="small-text">
																				Click to view details
																			</div>
																		</span>
																		<span className="price">
																			{Intl.NumberFormat(
																				`en-${subPlan.country || 'NG'}`,
																				{
																					currency: subPlan.currency || 'NGN',
																					style: 'currency',
																				}
																			).format(Number.parseInt(subPlan.price))}
																			{subPlan.frequency
																				? `/${subPlan.frequency}`
																				: null}
																		</span>
																	</div>
																</Accordion.Header>
																<Accordion.Body>
																	{subPlan.description
																		? subPlan.description
																		: null}
																	<br />
																	<br />
																	<h5>Benefits</h5>
																	<div
																		dangerouslySetInnerHTML={{
																			__html: subPlan.benefits[0],
																		}}
																	></div>
																	<br />
																	<button
																		className="ehealth-purchase-btn"
																		onClick={(e) =>
																			handlePlanSelect(e, subPlan)
																		}
																	>
																		Buy it now
																	</button>
																</Accordion.Body>
															</Accordion.Item>
														</Accordion>
													))}
													{plan.subPlans.length > 0 ? null : (
														<button
															className="ehealth-purchase-btn"
															onClick={(e) => handlePlanSelect(e, plan.price)}
														>
															Buy it now
														</button>
													)}
												</Accordion.Body>
											</Accordion.Item>
										</Accordion>
									))}
								</div>
								<div className="col-md-6">
									<div className="ehealth-btn-container">
										<button className="ehealth-btn">
											Patient Testimonials
										</button>
									</div>

									{props.testimonials.length > 0 && (
										<Carousel indicators={false}>
											{props.testimonials.map((testimonial) => (
												<Carousel.Item key={testimonial.testimonial_id}>
													<div className="postimgvdo post-video">
														<div
															className="react-player-background"
															style={{
																backgroundImage: `url(${BASE_URL}${testimonial.thumbnails[9]})`,
															}}
														/>
														<ReactPlayer
															url={`${BASE_URL}${testimonial.testimonial_video}`}
															controls
															style={{ maxWidth: '80%', margin: '2px auto' }}
															light={`${BASE_URL}${testimonial.thumbnails[9]}`}
															// postId={post_id}
															// handleViewPost={this.handleViewPost}
														/>
													</div>
												</Carousel.Item>
											))}
										</Carousel>
									)}
								</div>
							</div>
						</div>
						<p id="quote">Your health and wellness is our love and happiness</p>
					</>
				) : null}

				{props.page === 2 ? (
					<>
						<Stepper activeStep={1} alternativeLabel>
							{steps.map((label) => (
								<Step
									key={label}
									onClick={() =>
										props.setPage(steps.findIndex((x) => x === label) + 1)
									}
								>
									<StepLabel>{label}</StepLabel>
								</Step>
							))}
						</Stepper>

						<Container fluid="md" id="form-container">
							<h2>Patient Details</h2>
							<Form
								onSubmit={onSubmit}
								render={({
									handleSubmit,
									form,
									submitting,
									pristine,
									values,
								}) => (
									<form onSubmit={handleSubmit}>
										<Row>
											<Col md={12}>
												<Field
													name="first_name"
													validate={required}
													initialValue={first_name}
												>
													{({ input, meta }) => (
														<B4Form.Group
															className="mb-3"
															controlId="first_name"
														>
															<B4Form.Label>Firstname</B4Form.Label>
															<B4Form.Control
																type="text"
																placeholder="Enter Firstname"
																{...input}
																// value={first_name}
																// onChange={(e) => setFirstName(e.target.value)}
															/>
															<B4Form.Text className="text-muted">
																Eg: John
															</B4Form.Text>
															{meta.error && meta.touched && (
																<B4Form.Control.Feedback type="invalid">
																	{meta.error}
																</B4Form.Control.Feedback>
															)}
														</B4Form.Group>
													)}
												</Field>
											</Col>

											<Col md={12}>
												<Field
													name="last_name"
													validate={required}
													initialValue={last_name}
												>
													{({ input, meta }) => (
														<B4Form.Group
															className="mb-3"
															controlId="last_name"
														>
															<B4Form.Label>Lastname</B4Form.Label>
															<B4Form.Control
																type="text"
																placeholder="Enter Lastname"
																{...input}
																// value={last_name}
																// onChange={(e) => setLastName(e.target.value)}
															/>
															<B4Form.Text className="text-muted">
																Eg: Doe
															</B4Form.Text>
															{meta.error && meta.touched && (
																<B4Form.Control.Feedback type="invalid">
																	{meta.error}
																</B4Form.Control.Feedback>
															)}
														</B4Form.Group>
													)}
												</Field>
											</Col>
										</Row>

										<Row>
											<Col md={12}>
												<Field
													name="email"
													validate={composeValidators(required, isValidEmail)}
													initialValue={email}
												>
													{({ input, meta }) => (
														<B4Form.Group className="mb-3" controlId="email">
															<B4Form.Label>Email</B4Form.Label>
															<B4Form.Control
																type="email"
																placeholder="Enter Email"
																{...input}
																// value={email}
																// onChange={(e) => setEmail(e.target.value)}
															/>
															<B4Form.Text className="text-muted">
																Eg: johndoe@gmail.com
															</B4Form.Text>
															{meta.error && meta.touched && (
																<B4Form.Control.Feedback type="invalid">
																	{meta.error}
																</B4Form.Control.Feedback>
															)}
														</B4Form.Group>
													)}
												</Field>
											</Col>

											<Col md={12}>
												<Field name="phone" initialValue={phone}>
													{({ input, meta }) => (
														<B4Form.Group className="mb-3" controlId="phone">
															<B4Form.Label>Phone</B4Form.Label>
															<B4Form.Control
																type="tel"
																placeholder="Enter Phone Number"
																{...input}
																// value={phone}
																// onChange={(e) => setPhone(e.target.value)}
															/>
															<B4Form.Text className="text-muted">
																Eg: +2347xxxx
															</B4Form.Text>
															{meta.error && meta.touched && (
																<B4Form.Control.Feedback type="invalid">
																	{meta.error}
																</B4Form.Control.Feedback>
															)}
														</B4Form.Group>
													)}
												</Field>
											</Col>
										</Row>
										{checked === 'on' ? null : (
											<Row>
												<Col md={12}>
													<Field
														name="password"
														validate={composeValidators(required, minValue(8))}
													>
														{({ input, meta }) => (
															<B4Form.Group
																className="mb-3"
																controlId="password"
															>
																<B4Form.Label>Password</B4Form.Label>
																<B4Form.Control
																	type="password"
																	placeholder="Enter Password"
																	{...input}
																	// value={password}
																	// onChange={(e) => setPassword(e.target.value)}
																/>
																{meta.error && meta.touched && (
																	<B4Form.Control.Feedback type="invalid">
																		{meta.error}
																	</B4Form.Control.Feedback>
																)}
															</B4Form.Group>
														)}
													</Field>
												</Col>

												<Col md={12}>
													<Field
														name="repeat_password"
														validate={composeValidators(required, minValue(8))}
													>
														{({ input, meta }) => (
															<B4Form.Group
																className="mb-3"
																controlId="repeat_password"
															>
																<B4Form.Label>Confirm Password</B4Form.Label>
																<B4Form.Control
																	type="password"
																	placeholder="Repeat Password"
																	{...input}
																	// value={repeat_password}
																	// onChange={(e) =>
																	// 	setRepeatPassword(e.target.value)
																	// }
																/>
																{meta.error && meta.touched && (
																	<B4Form.Control.Feedback type="invalid">
																		{meta.error}
																	</B4Form.Control.Feedback>
																)}
															</B4Form.Group>
														)}
													</Field>
												</Col>
											</Row>
										)}

										<Field name="check" type="checkbox">
											{({ input }) => (
												<B4Form.Group className="mb-3" controlId="check">
													<FormCheck
														id="check"
														type="checkbox"
														label="Use my Afrocamgist account details"
														{...input}
														checked={checked === 'on' ? true : false}
														// value={checked}
														onChange={handleCheckChange}
													/>
												</B4Form.Group>
											)}
										</Field>
										<Button
											variant="primary"
											type="submit"
											disabled={submitting}
											// onClick={(e) => handleSubmit(e)}
										>
											Continue
										</Button>
									</form>
								)}
							></Form>
						</Container>
					</>
				) : null}

				{props.page === 3 ? (
					<>
						<Stepper activeStep={2} alternativeLabel>
							{steps.map((label) => (
								<Step
									key={label}
									onClick={() =>
										props.setPage(steps.findIndex((x) => x === label) + 1)
									}
								>
									<StepLabel>{label}</StepLabel>
								</Step>
							))}
						</Stepper>
						<div className="centralize">
							<Gateways
								plan={props.plan}
								price={props.price}
								currency={props.currency}
								makePayment={props.makePayment}
								updateCurrency={props.updateCurrency}
								{...props}
							/>
						</div>
					</>
				) : null}
			</section>
		</EhealthStyles>
	);
}

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

export default EhealthUI;
