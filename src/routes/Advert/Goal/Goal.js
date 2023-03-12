import React, { useEffect, useState } from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createTheme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import './Goal.css';
import { v4 as uuidv4 } from 'uuid';
import {
	FormHelperText,
	TextField,
	FormControl,
	ThemeProvider,
	Modal,
	Backdrop,
	CircularProgress,
} from '@material-ui/core';
import $ from 'jquery';
import axios from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import withErrorHandler from '../../../utils/withErrorHandler';

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	dialog: {
		padding: '40px',
	},
	modal: {
		position: 'absolute',
		width: '50%',
		margin: '2px auto 0',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		height: '20%',
		maxHeight: '100%',
		overflow: 'auto',
	},
	input: {
		border: '1px solid #888',
		borderRadius: '10px',
	},
	inputDiv: {
		width: '60%',
		margin: '10px auto',
		textAlign: 'left',
	},
}));

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

function Goal(props) {
	const [goals, setGoals] = useState([]);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [inputOpen, setInputOpen] = useState(false);
	const [modalStyle] = useState(getModalStyle());
	const [url, setUrl] = useState('');
	const [error, setError] = useState(false);
	const [errorMsg, setErrMsg] = useState('');

	useEffect(() => {
		let unmounted = false;
		if (!unmounted) {
			$(window).scrollTop(0);
			setGoals([
				{
					id: uuidv4(),
					displayName: 'More profile visits',
					name: 'profile_visit',
				},
				{
					id: uuidv4(),
					displayName: 'More website visits',
					name: 'website_visit',
				},
			]);
			setIsDisabled(props.goal.goal_type ? false : true);
		}
		return () => {
			unmounted = true;
		};
	}, []);

	const handleRadioChange = (goalName) => {
		console.log(goalName);
		if (goalName.toLowerCase() === 'profile_visit') {
			const user = localStorage.getItem('user');
			const goalObject = {
				goal_type: goalName,
				url: `/profile/${user}`,
			};
			props.handleGoalChange(goalObject);
			setIsDisabled(false);
			setInputOpen(false);
			return;
		}

		setInputOpen(true);
		if (url === '' || !validateUrlFormat(url)) {
			setIsDisabled(true);
		}
		const goalObject = {
			goal_type: goalName,
			url,
		};
		props.handleGoalChange(goalObject);
	};

	const theme = createTheme({
		palette: {
			primary: {
				main: '#ff7400',
			},
			secondary: {
				main: '#11cb5f',
			},
		},
	});

	const handleCloseBackdrop = () => {
		if (isLoading) {
			return;
		}
		setIsLoading(false);
	};

	const handleUrlChange = (e) => {
		setUrl(e.target.value);
		validateFormInput(e);
	};

	const validateFormInput = (e) => {
		if (e.target.value === '') {
			setError(true);
			setErrMsg('Cannot be empty');
			setIsDisabled(true);
			return;
		}
		if (!validateUrlFormat(e.target.value)) {
			setError(true);
			setErrMsg('Invalid url');
			setIsDisabled(true);
			return;
		}
		setError(false);
		setErrMsg('');
		setIsDisabled(false);
		const goalObject = {
			goal_type: 'website_visit',
			url,
		};
		props.handleGoalChange(goalObject);
	};

	const validateUrlFormat = (string) => {
		const regEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
		return regEx.test(string);
	};

	const submitGoal = async () => {
		const endpoint = '/advert/goal';

		const data = {
			goal_type: props.goal.goal_type,
			url: props.goal.url ? props.goal.url : undefined,
		};

		setIsLoading(true);

		// let response;
		const token = localStorage.getItem('token');
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		};

		axios
			.post(endpoint, data, config)
			.then((response) => {
				console.log(response);
				setIsLoading(false);
				props.setGoalId(response.data.data._id);
				props.handleNext();
			})
			.catch((error) => {
				setIsLoading(false);
				console.log(error);
				// toast.error(
				// 	error.response.error || 'An error occurred, please try again',
				// 	{ position: 'top-center' }
				// );
				return;
			});

		// try {
		// 	response = await (await axios.post(endpoint, data, config)).data;
		// } catch (error) {

		// }
	};

	const classes = useStyles();

	return (
		<div className="">
			<Backdrop
				className={classes.backdrop}
				open={isLoading}
				onClick={handleCloseBackdrop}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			<div className="header">
				<h1>Select a goal</h1>
				<span>What results would you like from this advert?</span>
			</div>
			<FormControl component="fieldset" className="optionsContainer">
				<RadioGroup row aria-label="goal" name="goal">
					{/* <ThemeProvider theme={theme}>
										<Radio
											value={goal.name}
											color="primary"
											className="material-prop"
											onChange={() => handleRadioChange(goal.name)}
											checked={goal.name === props.goal.goal_type}
										/>
									</ThemeProvider> */}
					<div className="flex-container">
						{goals.map((goal) => (
							<div key={goal.id}>
								<input
									type="radio"
									name="option"
									id={goal.displayName}
									onChange={() => handleRadioChange(goal.name)}
									checked={props.goal.goal_type === goal.name}
								/>
								<label htmlFor={goal.name}>{goal.displayName}</label>
							</div>
						))}
					</div>
				</RadioGroup>
			</FormControl>
			{inputOpen ? (
				<div className={classes.inputDiv}>
					<span
						style={{ textAlign: 'left', color: '#ff7400', fontSize: '16px' }}
					>
						URL
					</span>
					<FormControl>
						<input
							type="text"
							id="urlField"
							autoFocus
							className={classes.input}
							value={url}
							onChange={handleUrlChange}
							onBlur={(e) => validateFormInput(e)}
						/>
					</FormControl>
					<FormHelperText id="errMsg">
						{error ? errorMsg : 'eg: https://google.com'}
					</FormHelperText>
				</div>
			) : null}
			<ThemeProvider theme={theme}>
				<div className="nextBtnContainer">
					<Button
						variant="contained"
						disabled={isDisabled}
						className="nextBtn"
						color="primary"
						onClick={submitGoal}
					>
						Next
					</Button>
				</div>
			</ThemeProvider>
		</div>
	);
}

export default withErrorHandler(Goal, axios);
