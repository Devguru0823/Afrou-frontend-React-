// jshint esversion:9

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Styles from './Styles';
import axios from '../../../utils/axiosConfig';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';

function Invoice() {
	const [isLoading, setIsLoading] = useState(false);
	const [invoiceDetails, setInvoiceDetails] = useState({
		transaction: {
			card: {},
			customer: { email: '' },
			model_type: '',
			order: {
				purchase_units: [{ shipping: { name: {}, address: {} } }],
				payer: { name: {}, address: {} },
			},
		},
		plan: { price: '' },
		createdAt: '',
	});
	const [plan, setPlan] = useState({ price: '' });
	const { id } = useParams();

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			let response = {};
			const token = localStorage.getItem('token');
			const config = {
				headers: {
					authorization: `Bearer: ${token}`,
				},
			};

			try {
				response = await (
					await axios.get(`/ehealth/subscriptions/${id}`, config)
				).data;
			} catch (error) {
				setIsLoading(false);
				if (error.response && error.response.data) {
					return toast(
						error.response.data.message || error.response.data.error,
						{ position: 'top-center', type: 'error' }
					);
				}
				return toast(error.message || 'An error occurred', {
					position: 'top-center',
					type: 'error',
				});
			}

			setIsLoading(false);
			if (!response) {
				return toast('An error occured, please try again', {
					position: 'top-center',
					type: 'error',
				});
			}

			if (!response.status) {
				return toast(response.error || response.message, {
					position: 'top-center',
					type: 'error',
				});
			}

			console.log(response.data);

			setInvoiceDetails(response.data);
			setPlan(response.data.plan);

			console.log(invoiceDetails);
		})();
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

	const classes = useStyles();

	return (
		<Styles>
			<Backdrop
				className={classes.backdrop}
				open={isLoading}
				onClick={handleCloseBackdrop}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			<div className="container">
				<div className="row">
					{/* <!-- BEGIN INVOICE --> */}
					<div className="col-xs-12">
						<div className="grid invoice">
							<div className="grid-body">
								<div className="invoice-title">
									<div className="row">
										<div className="col-xs-12">
											<img src="/images/logo.png" alt="" height="35" />
										</div>
									</div>
									<br />
									<div className="row">
										<div className="col-xs-12">
											<h2>
												Invoice
												<br />
												<span className="small">
													{invoiceDetails.model_type === 'FlutterwavePayment' &&
														`Order #${invoiceDetails.transaction.id}`}
													{invoiceDetails.model_type === 'PaypalPayments' &&
														`Order #${invoiceDetails.transaction.order.id}`}
												</span>
											</h2>
										</div>
									</div>
								</div>
								<hr />
								<div className="row">
									<div className="col-xs-6">
										<address>
											<strong>Billed To:</strong>
											<br />
											{invoiceDetails.model_type === 'FlutterwavePayment' && (
												<>
													{invoiceDetails.transaction.customer.name}
													{/* <br />
											795 Folsom Ave, Suite 600
											<br />
											San Francisco, CA 94107
											<br /> */}
													<br />
													{/* {invoiceDetails.transaction.customer.phone
														? <abbr title="Phone">P:</abbr> +
														  invoiceDetails.transaction.customer.phone
														: null} */}
												</>
											)}

											{invoiceDetails.model_type === 'PaypalPayments' && (
												<>
													{
														invoiceDetails.transaction.order.payer.name
															.given_name
													}{' '}
													{invoiceDetails.transaction.order.payer.name.surname}
													<br />
													{
														invoiceDetails.transaction.order.payer.address
															.address_line_1
													}
													<br />
													{
														invoiceDetails.transaction.order.payer.address
															.admin_area_1
													}{' '}
													{
														invoiceDetails.transaction.order.payer.address
															.country_code
													}{' '}
													{
														invoiceDetails.transaction.order.payer.address
															.postal_code
													}
													<br />
													{invoiceDetails.transaction.order.payer.email_address}
												</>
											)}
										</address>
									</div>
									{invoiceDetails.model_type === 'PaypalPayments' && (
										<div className="col-xs-6 text-right">
											<address>
												<strong>Shipped To:</strong>
												<br />
												{
													invoiceDetails.transaction.order.purchase_units[0]
														.shipping.name.full_name
												}
												<br />
												{
													invoiceDetails.transaction.order.purchase_units[0]
														.shipping.address.address_line_1
												}
												<br />
												{
													invoiceDetails.transaction.order.purchase_units[0]
														.shipping.address.admin_area_1
												}{' '}
												{
													invoiceDetails.transaction.order.purchase_units[0]
														.shipping.address.country_code
												}{' '}
												{
													invoiceDetails.transaction.order.purchase_units[0]
														.shipping.address.postal_code
												}
												<br />
											</address>
										</div>
									)}
								</div>
								<div className="row">
									{invoiceDetails.model_type === 'FlutterwavePayments' && (
										<div className="col-xs-6">
											<address>
												<strong>Payment Method:</strong>
												<br />
												{invoiceDetails.transaction.card.type} ending ****{' '}
												{invoiceDetails.transaction.card.last_4digits}
												<br />
												{invoiceDetails.transaction.customer.email}
												<br />
											</address>
										</div>
									)}
									<div className="col-xs-6 text-right">
										<address>
											<strong>Order Date:</strong>
											<br />
											{moment(invoiceDetails.createdAt).format('YYYY-MM-DD')}
										</address>
									</div>
								</div>
								<div className="row">
									<div className="col-md-12">
										<h3>ORDER SUMMARY</h3>
										<table className="table table-striped">
											<thead>
												<tr className="line">
													<td>
														<strong>#</strong>
													</td>
													<td className="text-center">
														<strong>PLAN</strong>
													</td>
													<td className="text-center">
														<strong>QTY</strong>
													</td>
													<td className="text-right">
														<strong>PRICE</strong>
													</td>
													<td className="text-right">
														<strong>SUBTOTAL</strong>
													</td>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>1</td>
													<td>
														<strong>{plan.name}</strong>
														<br />
														{plan.description}
													</td>
													<td className="text-center">1</td>
													<td className="text-right">
														{new Intl.NumberFormat('en-US', {
															style: 'currency',
															currency: 'USD',
														}).format(plan.price.replace('$', ''))}
													</td>
													<td className="text-right">
														{new Intl.NumberFormat('en-US', {
															style: 'currency',
															currency: 'USD',
														}).format(plan.price.replace('$', ''))}
													</td>
												</tr>
												<tr>
													<td colSpan="3"></td>
													<td className="text-right">
														<strong>Taxes</strong>
													</td>
													<td className="text-right">
														<strong>N/A</strong>
													</td>
												</tr>
												<tr>
													<td colSpan="3"></td>
													<td className="text-right">
														<strong>Total</strong>
													</td>
													<td className="text-right">
														<strong>
															{new Intl.NumberFormat('en-US', {
																style: 'currency',
																currency: 'USD',
															}).format(plan.price.replace('$', ''))}
														</strong>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
								<div className="row">
									<div className="col-md-12 text-right identity">
										<p>
											Signed,
											<br />
											<strong>Afrocamgist Admin.</strong>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* <!-- END INVOICE --> */}
				</div>
			</div>
		</Styles>
	);
}

export default Invoice;
