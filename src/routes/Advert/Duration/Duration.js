import React, { useEffect, useState } from 'react';
import {
	Typography,
	Slider,
	ThemeProvider,
	Button,
	FormControl,
} from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
import './Duration.css';
import $ from 'jquery';
import axios from '../../../utils/axiosConfig';

const theme = createTheme({
	palette: {
		primary: {
			main: '#ff7400',
		},
	},
});

const basePrice = 1;

function Duration(props) {
	const [duration, setDuration] = useState(props.duration);
	const [price, setPrice] = useState(
		props.price ? props.price : basePrice * duration
	);

	let totalPrice = basePrice * duration;

	useEffect(() => {
		let unmounted = false;

		if (!unmounted) {
			$(window).scrollTop(0);
			// setPrice(basePrice * duration);
			props.handleSetPriceAndDuration(totalPrice, duration);
		}

		return () => {
			unmounted = true;
		};
	}, []);

	const handleDurationChange = (ev, newVal) => {
		setDuration(newVal);
		setPrice(basePrice * newVal);
		totalPrice = basePrice * newVal;
		props.handleSetPriceAndDuration(totalPrice, newVal);
	};

	const createBudget = async () => {
		const data = {
			duration,
		};

		props.setIsLoading(true);

		let response;
		const token = localStorage.getItem('token');
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		};
		const endpoint = '/advert/budget';
		try {
			response = await (await axios.post(endpoint, data, config)).data;
		} catch (error) {
			console.log(error);
			return;
		}

		if (!response) {
			props.setIsLoading(false);
			return;
		}

		console.log(response);
		props.setIsLoading(false);
		props.setBudgetId(response.data._id);
		props.handleNext();
	};

	return (
		<div className="section-container">
			<div className="header">
				<h2>Select Duration Span</h2>
				{/* <span>What results would you like from this advert?</span> */}
			</div>
			<div>
				<div className="duration-container">
					<p>Cost per day: ${basePrice}</p>
					<h2 className="total-cost">
						${price} over {duration} days
					</h2>
					<ThemeProvider theme={theme}>
						<Typography id="duration-slider" gutterBottom>
							Duration
						</Typography>
						<FormControl className="optionsContainer">
							<Slider
								color="primary"
								value={duration}
								onChange={handleDurationChange}
								aria-labelledby="duration"
								valueLabelDisplay="auto"
								min={1}
								max={30}
							/>
						</FormControl>
					</ThemeProvider>
				</div>
				<ThemeProvider theme={theme}>
					<div className="nextBtnContainer">
						<Button
							variant="contained"
							className="nextBtn"
							color="primary"
							onClick={createBudget}
							id="nextBtn"
						>
							Next
						</Button>
					</div>
				</ThemeProvider>
			</div>
		</div>
	);
}

export default Duration;
