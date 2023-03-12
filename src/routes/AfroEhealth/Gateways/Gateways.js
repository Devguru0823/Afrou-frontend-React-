// jshint esversion:9
import * as React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@material-ui/core';
import Flutterwave from '../Payment/Flutterwave';
import Paypal from '../Payment/Paypal';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function Gateways(props) {
	const [value, setValue] = React.useState(0);
	const [isNgn, setIsNgn] = React.useState(false);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleCurrencyChange = (event) => {
		if (event.target.value === 'NGN') {
			if (value === 1) {
				setValue(0);
			}
			setIsNgn(true);
			props.updateCurrency(event.target.value);
			return;
		}
		props.updateCurrency(event.target.value);
		setIsNgn(false);
	};

	return (
		<>
			<h2>
				Pay{' '}
				{new Intl.NumberFormat(`en-${props.plan.country || 'NG'}`, {
					style: 'currency',
					currency: props.plan.currency,
				}).format(Number.parseInt(props.price))}{' '}
				Using
			</h2>
			{/* <div className='currency-select'>
				<FormControl fullWidth>
					<InputLabel id='demo-simple-select-label'>Currency</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={props.currency}
						label='Currency'
						onChange={handleCurrencyChange}
					>
						<MenuItem value={'USD'} selected>
							USD
						</MenuItem>
						<MenuItem value={'NGN'}>NGN</MenuItem>
					</Select>
				</FormControl>
			</div> */}
			<Box sx={{ width: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="Payment Gateways"
					>
						<Tab label="Flutterwave" {...a11yProps(0)} />
						<Tab label="Paypal" {...a11yProps(1)} disabled={isNgn} />
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					<Flutterwave
						currency={props.currency}
						price={props.price}
						makePayment={props.makePayment}
					/>
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Paypal currency={props.currency} price={props.price} {...props} />
				</TabPanel>
			</Box>
		</>
	);
}
