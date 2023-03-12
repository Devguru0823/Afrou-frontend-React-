// jshint esversion: 9
import React, { useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import {
	Backdrop,
	CircularProgress,
	FormControl,
	FormLabel,
	FormControlLabel,
	Radio,
	RadioGroup,
	TextField,
	MenuItem,
	Select,
	Slider,
	FormHelperText,
	Typography,
	Button,
	Snackbar,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	DialogContentText,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import axios from '../../../utils/axiosConfig';
import { makeStyles, createTheme, useTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import './Audience.css';
import { countries as countryList } from '../../../constants/countries';
import $ from 'jquery';
import { default as ReactSelect, components } from 'react-select';
import { MultiSelect } from 'react-multi-select-component';

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	dialog: {
		padding: '40px',
	},
	formControl: {
		margin: theme.spacing(1),
		// minWidth: 120,
		// maxWidth: 300,
		width: '100%',
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chip: {
		margin: 2,
	},
	noLabel: {
		marginTop: theme.spacing(3),
	},
	modal: {
		position: 'absolute',
		width: '90%',
		margin: '2px auto 0',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		height: '50%',
		maxHeight: '100%',
		overflow: 'scroll',
	},
	selectHeader: {
		fontSize: '23px',
		fontWeight: 'bolder',
		borderBottom: '2px solid #000',
	},
}));

const ConfirmDeleteBtn = styled(Button)({
	background: '#ff0000 !important',
	color: '#fff',
});

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

function getStyles(country, countries, theme) {
	return {
		fontWeight:
			countries.indexOf(country) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}

function valuetext(value) {
	return `${value}`;
}

const interests = [
	{ value: 'Afro-global Politics', label: 'Afro-global Politics' },
	{ value: 'Afro-global Youngsters', label: 'Afro-global Youngsters' },
	{
		value: 'Afro-global Entrepreneurial',
		label: 'Afro-global Entrepreneurial',
	},
	{ value: 'Afro Cultures ad Histories', label: 'Afro Cultures ad Histories' },
	{ value: 'Afro beat/Music/Dance', label: 'Afro beat/Music/Dance' },
	{ value: 'Afro-global news', label: 'Afro-global news' },
	{ value: 'Afro-UniGist', label: 'Afro-UniGist' },
	{
		value: 'Afro-global career and opportunities',
		label: 'Afro-global career and opportunities',
	},
	{
		value: 'Afro-global League of Gentle men',
		label: 'Afro-global League of Gentle men',
	},
	{
		value: 'Afro-global Queens/Beauties',
		label: 'Afro-global Queens/Beauties',
	},
	{
		value: 'Afro-global Talents and innovations',
		label: 'Afro-global Talents and innovations',
	},
	{ value: 'Afro-Arts/Craft', label: 'Afro-Arts/Craft' },
	{ value: 'Afro Moonlight stories', label: 'Afro Moonlight stories' },
	{ value: 'Afro-global Entertainment', label: 'Afro-global Entertainment' },
	{ value: 'Afro-global celeb', label: 'Afro-global celeb' },
];

function Audience(props) {
	const theme2 = useTheme();
	const [isLoading, setIsLoading] = useState(false);
	const [countries, setCountries] = useState([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [audienceName, setAudienceName] = useState('');
	const [audienceCountries, setAudienceCountries] = useState([]);
	const [audienceInterests, setAudienceInterests] = useState([]);
	const [audienceAgeRange, setAgeRange] = useState([13, 65]);
	const [audienceGender, setAudienceGender] = useState('all');
	const [snackBarOpen, setSnackBarOpen] = useState(false);
	const [severity, setSeverity] = useState('success');
	const [snackBarMessage, setSnackBarMessage] = useState('');
	const [isValid, setIsValid] = useState(false);
	const [audienceNameErr, setAudienceNameErr] = useState(false);
	const [audienceNameErrMsg, setAudienceNameErrMsg] = useState('');
	const [audienceCountryErr, setAudienceCountryErr] = useState(false);
	const [audienceCountryErrMsg, setAudienceCountryErrMsg] = useState('');
	const [audienceInterestsErr, setAudienceInterestsErr] = useState(false);
	const [
		audienceInterestsErrMessage,
		setAudienceInterestsErrMessage,
	] = useState('');
	const [modalBtnTxt, setModalBtnTxt] = useState('Create');
	const [actionType, setActionType] = useState('create');
	const [nextIsDisabled, setNextIsDisabled] = useState(false);

	const token = localStorage.getItem('token');

	useEffect(() => {
		let unmounted = false;
		if (!unmounted) {
			if (
				Object.keys(props.audience).length === 0 &&
				Object.getPrototypeOf(props.audience) === Object.prototype
			) {
				setNextIsDisabled(true);
			}
			$(window).scrollTop(0);
			const newCountries = [];
			for (let country of countryList) {
				const object = {
					value: country.name,
					label: country.name,
				};
				newCountries.push(object);
			}
			setCountries(newCountries);
		}
		return () => {
			unmounted = true;
		};
	}, []);

	const handleCloseBackdrop = () => {
		setIsLoading(false);
	};

	const handleAudienceChange = (val) => {
		props.handleAudienceChange(val);
		if (actionType === 'edit') {
			setAudienceProperties({}, actionType, val);
		}
	};

	const setAudienceProperties = (e, type, val = undefined) => {
		if (type === 'create') {
			setAudienceName('');
			setAudienceCountries([]);
			setAudienceInterests([]);
			setAudienceGender('all');
			setAgeRange([13, 65]);
			setModalBtnTxt('Create');
		}

		if (type === 'edit') {
			const editCountries = [];
			const editInterests = [];
			if (val) {
				val.country.forEach((country) => {
					const value = {
						value: country,
						label: country,
					};
					editCountries.push(value);
				});
				val.interests.forEach((interest) => {
					const value = {
						value: interest,
						label: interest,
					};
					editInterests.push(value);
				});
			} else {
				props.audience.country.forEach((country) => {
					const value = {
						value: country,
						label: country,
					};
					editCountries.push(value);
				});
				props.audience.interests.forEach((interest) => {
					const value = {
						value: interest,
						label: interest,
					};
					editInterests.push(value);
				});
			}
			console.log(editCountries);
			setAudienceName(val ? val.name : props.audience.name);
			setAudienceCountries(editCountries);
			setAudienceInterests(editInterests);
			setAudienceGender(val ? val.gender : props.audience.gender);
			const ageSplit = val
				? val.age_range.split('-')
				: props.audience.age_range.split('-');
			ageSplit[0] = Number.parseInt(ageSplit[0]);
			ageSplit[1] = Number.parseInt(ageSplit[1]);
			setAgeRange(ageSplit);
			setModalBtnTxt('Edit');
			setIsValid(true);
		}
	};

	const handleActionChange = (e) => {
		setActionType(e.target.value);
		setAudienceProperties(e, e.target.value);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handleAudienceCountryChange = (options) => {
		if (options.length === 0) {
			setAudienceCountryErr(true);
			setIsValid(false);
			return;
		}

		setAudienceCountries(options === null ? '' : options);
		setAudienceCountryErr(false);
		setAudienceCountryErrMsg('');
	};

	const handleAudienceInterestsChange = (options) => {
		if (options.length === 0) {
			setAudienceInterestsErr(true);
			setIsValid(false);
			return;
		}
		setAudienceInterests(options);
		setAudienceInterestsErr(false);
		setAudienceInterestsErrMessage('');
	};

	const handleAudienceNameChange = (ev) => {
		if (ev.target.value.length > 20) {
			setAudienceNameErrMsg('max length reached');
			return;
		}
		setAudienceName(ev.target.value);
		if (ev.target.value === '') {
			setAudienceNameErr(true);
			setAudienceNameErrMsg('Name cannot be empty');
			return;
		}
		setAudienceNameErr(false);
		setAudienceNameErrMsg('');
	};

	const handleAgeChange = (ev, newVal) => {
		setAgeRange(newVal);
	};

	const handleAudienceGenderChange = (ev) => {
		setAudienceGender(ev.target.value);
	};

	const handleSnackBarClose = () => {
		setSnackBarOpen(false);
	};

	const handleCreateAudience = async () => {
		setIsLoading(true);
		const age_range = audienceAgeRange.join('-');
		const audience_data =
			actionType === 'create'
				? {
						name: audienceName,
						country: audienceCountries.map((x) => x.value),
						interests: audienceInterests.map((x) => x.value),
						age_range,
						gender: audienceGender,
				  }
				: {
						audience_id: props.audience.audience_id,
						update: {
							name: audienceName,
							country: audienceCountries.map((x) => x.value),
							interests: audienceInterests.map((x) => x.value),
							age_range,
							gender: audienceGender,
						},
				  };

		let audienceResponse;
		const url =
			actionType === 'create'
				? `advert/audience/`
				: `advert/audience/${props.audience._id}`;
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		};
		try {
			audienceResponse =
				actionType === 'create'
					? await (await axios.post(url, audience_data, config)).data
					: await (await axios.put(url, audience_data, config)).data;
		} catch (error) {
			setIsLoading(false);
			setSeverity('error');
			setSnackBarMessage(
				error.response && error.response.data.error
					? error.response.data.error
					: 'an error occured'
			);
			alert(
				error.response && error.response.data.error
					? error.response.data.error
					: 'an error occured'
			);
			console.log(error.response);
			return;
		}
		setIsLoading(false);
		console.log(audienceResponse);

		if (!audienceResponse) {
			return;
		}

		if (!audienceResponse.status) {
			setSeverity('error');
			setSnackBarMessage(audienceResponse.error);
			return;
		}
		setSeverity('success');
		setSnackBarMessage('Audience created successfully');
		setAudienceName('');
		setAudienceInterests([]);
		setAudienceCountries([]);
		setAudienceGender('all');
		window.scrollTo(0, 0);
		if (actionType === 'create') {
			const destructuredAudiences = [...props.audiences];
			destructuredAudiences.push(audienceResponse.data);
			props.setAudiences(destructuredAudiences);
			props.handleAudienceChange(audienceResponse.data);
		}

		if (actionType === 'edit') {
			props.editAudience(audienceResponse.data, 'edit');
		}
		return;
	};

	const theme = createTheme({
		palette: {
			primary: {
				main: '#ff7400',
			},
			secondary: {
				main: '#000',
			},
			error: {
				main: '#ff0000',
			},
		},
	});

	const Option = (props) => {
		return (
			<div>
				<components.Option {...props}>
					<input
						type="checkbox"
						checked={props.isSelected}
						onChange={() => null}
					/>{' '}
					<label>{props.label}</label>
				</components.Option>
			</div>
		);
	};

	const validateFormInput = (e, type) => {
		if (type === 'name') {
			if (e.target.value === '') {
				setAudienceNameErr(true);
				setAudienceNameErrMsg(`${type} cannot be empty`);
				setIsValid(false);
				return;
			}
			setAudienceNameErr(false);
			setAudienceNameErrMsg('');
			if (audienceCountries.length !== 0 && audienceInterests.length !== 0) {
				setIsValid(true);
			}
		}

		if (type === 'country') {
			if (audienceCountries.length === 0) {
				setAudienceCountryErr(true);
				setAudienceCountryErrMsg(`${type} cannot be empty`);
				setIsValid(false);
				return;
			}
			setAudienceCountryErr(false);
			setAudienceCountryErrMsg('');
			if (audienceName !== '' && audienceInterests.length !== 0) {
				setIsValid(true);
			}
		}

		if (type === 'interests') {
			if (audienceInterests.length === 0) {
				setAudienceInterestsErr(true);
				setAudienceInterestsErrMessage(`${type} cannot be empty`);
				setIsValid(false);
				return;
			}
			setAudienceInterestsErr(false);
			setAudienceInterestsErrMessage('');
			if (audienceName !== '' && audienceCountries.length !== 0) {
				setIsValid(true);
			}
		}
	};

	const handleDeleteAudience = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const url = `advert/audience/${props.audience._id}`;
		const config = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		};
		let deleteResponse;
		try {
			deleteResponse = await (await axios.delete(url, config)).data;
		} catch (error) {
			setIsLoading(false);
			if (error.response) {
				console.log(error.response.data);
				alert(error.response.data.error);
				return;
			}
			console.log(error.message);
		}
		setIsLoading(false);
		if (deleteResponse.status) {
			props.editAudience(props.audience, 'delete');
			setDialogOpen(false);
			setAudienceName('');
			setAudienceCountries([]);
			setAudienceInterests([]);
			setAudienceGender('all');
			setAgeRange([13, 65]);
			setModalBtnTxt('Create');
			setActionType('create');
		}
	};

	const classes = useStyles();

	let createAudienceContainer = (
		<div className="create-edit-container">
			<FormControl className={classes.formControl}>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={actionType}
					onChange={handleActionChange}
					className={classes.selectHeader}
				>
					<MenuItem value="create" selected>
						Create Audience
					</MenuItem>
					{props.audience !== {} ? (
						<MenuItem value="edit">Edit Audience</MenuItem>
					) : null}
				</Select>
			</FormControl>
			<form noValidate autoComplete="off">
				<ThemeProvider theme={theme}>
					<div className="grid-container">
						<FormControl className={`${classes.formControl} m-0`}>
							<TextField
								id="audience-name"
								error={audienceNameErr}
								value={audienceName}
								onChange={handleAudienceNameChange}
								label="Audience Name"
								onBlur={(e) => validateFormInput(e, 'name')}
							/>
							{audienceNameErr ||
							audienceNameErrMsg === 'max length reached' ? (
								<FormHelperText color="error">
									{audienceNameErrMsg}
								</FormHelperText>
							) : null}
						</FormControl>
						<FormControl
							color="primary"
							id="countriesFromControl"
							error={audienceCountryErr}
							className={`${classes.formControl}`}
						>
							<label>Countries</label>
							<span
								className="d-inline-block"
								data-toggle="popover"
								data-trigger="focus"
								data-content="Please selecet account(s)"
							>
								<MultiSelect
									options={countries}
									onChange={handleAudienceCountryChange}
									value={audienceCountries}
									labelledBy="Select countries"
								/>
							</span>
						</FormControl>
						<FormControl
							color="primary"
							id="interestsFromControl"
							error={audienceInterestsErr}
							className={`${classes.formControl}`}
						>
							<label>Interests</label>
							<MultiSelect
								options={interests}
								onChange={handleAudienceInterestsChange}
								value={audienceInterests}
								labelledBy="Select interests"
							/>
							{audienceInterestsErr ||
							audienceInterestsErrMessage === 'cannot select above 5' ? (
								<FormHelperText color="error">
									{audienceInterestsErrMessage}
								</FormHelperText>
							) : null}
						</FormControl>
						<FormControl
							color="primary"
							id="ageFormControl"
							className={`${classes.formControl} optionsContainer`}
						>
							<Typography id="age-slider-text" gutterBottom>
								Age range
							</Typography>
							<Slider
								value={audienceAgeRange}
								onChange={handleAgeChange}
								valueLabelDisplay="auto"
								aria-labelledby="age-range"
								getAriaValueText={valuetext}
								min={13}
								max={100}
								color="primary"
							/>
						</FormControl>
						<FormControl component="fieldset">
							<FormLabel component="legend">Gender</FormLabel>
							<RadioGroup
								className="display-row"
								aria-label="gender"
								name="gender1"
								value={audienceGender}
								defaultValue="all"
								onChange={handleAudienceGenderChange}
							>
								<FormControlLabel
									value="female"
									control={<Radio color="primary" />}
									label="Female"
								/>
								<FormControlLabel
									value="male"
									control={<Radio color="primary" />}
									label="Male"
								/>
								<FormControlLabel
									value="all"
									control={<Radio color="primary" />}
									label="All"
								/>
							</RadioGroup>
						</FormControl>
					</div>
					<div className="actionBtns">
						<Button
							variant="contained"
							className="nextBtn"
							color="secondary"
							onClick={handleCreateAudience}
							id="create-btn"
							// disabled={!isValid}
						>
							{isLoading ? <CircularProgress color="inherit" /> : modalBtnTxt}
						</Button>
						{actionType === 'edit' ? (
							<Button
								variant="contained"
								className="nextBtn"
								onClick={() => setDialogOpen(true)}
								id="delete-btn"
								disabled={!isValid}
							>
								Delete
							</Button>
						) : null}
					</div>
				</ThemeProvider>
				<Snackbar
					open={snackBarOpen}
					autoHideDuration={6000}
					onClose={handleSnackBarClose}
				>
					<Alert onClose={handleSnackBarClose} severity={severity}>
						{snackBarMessage}
					</Alert>
				</Snackbar>
			</form>
		</div>
	);

	return (
		<div className="">
			<Backdrop
				className={classes.backdrop}
				open={isLoading}
				onClick={handleCloseBackdrop}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Dialog
				open={dialogOpen}
				onClose={handleDialogClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						This action cannot be reversed
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<ConfirmDeleteBtn onClick={handleDeleteAudience}>
						{isLoading ? <CircularProgress color="inherit" /> : 'Yes'}
					</ConfirmDeleteBtn>
					{/* <Button onClick={handleDeleteAudience} color="primary" autoFocus>
						{
							isLoading ? <CircularProgress color="inherit" /> : 'Yes'
						}
					</Button> */}
				</DialogActions>
			</Dialog>
			{isLoading ? null : (
				<>
					<div className="header">
						<h2>Select Target Audience</h2>
						<span className="sub-text">
							Create or select your target audience
						</span>
					</div>
					<div>
						<div className="audienceContainer">
							<FormControl component="fieldset" className="optionsContainer">
								<RadioGroup row aria-label="audiences" name="audiences">
									{props.audiences.map((audience) => (
										<div key={audience.audience_id} className="flex-container">
											<ThemeProvider theme={theme}>
												<Radio
													value={audience.audience_id}
													onChange={() => handleAudienceChange(audience)}
													color="primary"
													checked={
														props.audience.audience_id === audience.audience_id
													}
												/>
											</ThemeProvider>
											<div>
												<p>{audience.name}</p>
											</div>
										</div>
									))}
								</RadioGroup>
							</FormControl>
						</div>
						<p className="larger">
							or{' '}
							<span className="primary-color" style={{ fontWeight: 'bold' }}>
								Create new
							</span>
						</p>
						{createAudienceContainer}
						<ThemeProvider theme={theme}>
							<div className="nextBtnContainer">
								<Button
									variant="contained"
									disabled={nextIsDisabled}
									className="nextBtn"
									color="primary"
									onClick={props.handleNext}
									id="nextBtn"
								>
									Next
								</Button>
							</div>
						</ThemeProvider>
					</div>
				</>
			)}
		</div>
	);
}

export default Audience;
