// jshint esversion: 9
import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import './Advert.css';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowForward, Close, ExpandMore } from '@material-ui/icons';
import {
	CircularProgress,
	Backdrop,
	Modal,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
} from '@material-ui/core';
import Goal from './Goal/Goal';
import Audience from './Audience/Audience';
import Duration from './Duration/Duration';
import Review from './Review/Review';
import $ from 'jquery';
import { BASE_URL } from '../../constants/ImageUrls';
import { socket } from '../../redux/actions';
// import CryptoJs from 'crypto-js';
import withErrorHandler from '../../utils/withErrorHandler';
import CustomizedSteppers from '../../components/Stepper/Stepper';
import ContentContainer from './ContentContainer/ContentContainer';
import Footer from '../../components/Footer/Footer';
import AdvertList from './AdvertList/AdvertList';
import { toast } from 'react-toastify';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

function Advert(props) {
	const [isLoading, setIsLoading] = useState(false);
	const [posts, setPosts] = useState([]);
	const [post, setPost] = useState({});
	const [topPost, setTopPost] = useState({});
	const [current, setCurrent] = useState(0);
	const [goal, setGoal] = useState({});
	const [goal_id, setGoalId] = useState('');
	const [budgetId, setBudgetId] = useState('');
	const [audiences, setAudiences] = useState([]);
	const [audience, setAudience] = useState({});
	const [price, setPrice] = useState();
	const [duration, setDuration] = useState(7);
	const [adverts, setAdverts] = useState([]);
	const [advert, setAdvert] = useState({});
	const [hasPaid, setHasPaid] = useState(false);
	const [orderID, setOrderID] = useState('');
	const [transactionID, setTransactionId] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [modalStyle] = useState(getModalStyle);
	const [modalType, setModalType] = useState('');

	const useStyles = makeStyles((theme) => ({
		root: {
			flexGrow: 1,
			padding: '20px 10px 10px 10px',
		},
		root2: {
			flexGrow: 1,
		},
		accordionHeading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightRegular,
			flexBasis: '33.33%',
			flexShrink: 0,
		},
		secondaryHeading: {
			fontSize: theme.typography.pxToRem(15),
			color:
				advert.status === 'active' ? '#00ff00' : theme.palette.text.secondary,
		},
		accordionRoot: {
			width: '100%',
		},
		dialog: {
			padding: '40px',
		},
		paper: {
			padding: theme.spacing(2),
			textAlign: 'center',
			color: theme.palette.text.secondary,
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff',
		},
		media: {
			height: 'auto',
			paddingTop: '56.25%', // 16:9
		},
		card: {
			maxWidth: 345,
			marginBottom: '15px',
		},
		modal: {
			position: 'absolute',
			width: '90%',
			margin: '2px auto 0',
			backgroundColor: theme.palette.background.paper,
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 2, 3),
			height: '50%',
			maxHeight: '100%',
			overflow: 'scroll',
		},
		postContainer: {
			width: '100%',
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'row',
			justifyContent: 'start',
		},
		postImg: {
			width: '33.33%',
			height: '120px',
			objectFit: 'cover',
		},
		postPreview: {
			width: '100%',
			marginTop: '10px',
			marginBottom: '40px',
			textAlign: 'center',
		},
		postPreviewImg: {
			width: '100%',
			height: '250px',
			objectFit: 'cover',
			borderRadius: '4px',
		},
		modalHeader: {
			display: 'flex',
			justifyContent: 'space-between',
			marginBottom: '20px',
			fontSize: '22px',
		},
		iconSize: {
			fontSize: '30px',
		},
	}));

	const token = localStorage.getItem('token');
	const config = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		setIsLoading(true);
		(async () => {
			let unmounted = false;
			let url = `profile/posts`;
			let url2 = `advert/audience`;
			let url3 = `advert/get`;
			let responses;
			const startTime = performance.now();
			const selected_post = localStorage.getItem('selected_post');
			try {
				if (selected_post) url = `posts/${selected_post}`;
				responses = await Promise.all([
					await (await axios.get(url, config)).data,
					await (await axios.get(url2, config)).data,
					await (await axios.get(url3, config)).data,
				]);
			} catch (error) {
				setIsLoading(false);
				if (!unmounted) {
					if (error.response) {
						console.log(error.response);
						alert('An error occured, please refresh');
						return;
					}
					console.log(error);
					return;
				}
			}
			if (!unmounted) {
				const endTime = performance.now();
				console.log((endTime - startTime) / 1000 + ' seconds');
				socket.emit('getEncKeys', {}, (err, obj) => {
					// const bytesData = CryptoJs.AES.decrypt(responses[0].data, obj.k);
					// const postDetails = JSON.parse(bytesData.toString(CryptoJs.enc.Utf8));
					// responses[0].data = postDetails;
					let postResponse = responses[0];
					let response2 = responses[1];
					let alladverts = responses[2];

					console.log('AUDIENCES:', response2);
					console.log('ADVERTS:', alladverts);

					setIsLoading(false);

					if (selected_post) {
						setPost({
							id: postResponse.data.post_id,
							img:
								postResponse.data.post_type === 'image'
									? `${BASE_URL}${postResponse.data.post_image[0]}`
									: `${BASE_URL}${postResponse.data.thumbnail}`,
						});

						setTopPost({
							id: postResponse.data.post_id,
							img:
								postResponse.data.post_type === 'image'
									? `${BASE_URL}${postResponse.data.post_image[0]}`
									: `${BASE_URL}${postResponse.data.thumbnail}`,
						});
						setAudiences(response2.data ? response2.data.reverse() : []);
						setAudience(response2.data[0] ? response2.data[0] : {});
						setAdverts(alladverts.data);
						setCurrent(current + 1);
						return;
					}

					if (postResponse.data.length === 0) {
						alert('Please create a post for advert');
						props.history.go(-1);
					}
					if (!response2.status || !postResponse.status) {
						alert('An error occured please refresh the page');
						return;
					}
					const filteredPosts = postResponse.data.filter(
						(x) =>
							(x.post_type === 'image' || x.post_type === 'video') &&
							!x.promoted
					);
					setPosts(filteredPosts);
					setPost(
						filteredPosts[0]
							? {
									id: filteredPosts[0].post_id,
									img:
										filteredPosts[0].post_type === 'image'
											? `${BASE_URL}${filteredPosts[0].post_image[0]}`
											: `${BASE_URL}${filteredPosts[0].thumbnail}`,
							  }
							: {}
					);
					setTopPost(
						filteredPosts[0]
							? {
									id: filteredPosts[0].post_id,
									img:
										filteredPosts[0].post_type === 'image'
											? `${BASE_URL}${filteredPosts[0].post_image[0]}`
											: `${BASE_URL}${filteredPosts[0].thumbnail}`,
							  }
							: {}
					);
					setAudiences(response2.data ? response2.data.reverse() : []);
					setAudience(response2.data[0] ? response2.data[0] : {});
					setAdverts(alladverts.data);
				});
			}
			return () => {
				unmounted = true;
			};
		})();
	}, []);

	const handleprevious = () => {
		setCurrent(current - 1);
	};

	const handleSetOrderId = (id) => {
		setOrderID(id);
	};

	const handleNext = () => {
		console.log('POST: ', post);
		if (
			post &&
			Object.keys(post).length === 0 &&
			Object.getPrototypeOf(post) === Object.prototype
		) {
			alert('Create a new post to promote');
			setCurrent(1);
			return;
		}
		setCurrent(current + 1);
		setModalOpen(false);
	};

	const handleSetCurrent = (cur) => {
		setCurrent(cur);
	};

	const handleClose = () => {
		props.history.go(-1);
	};

	const resetCurrent = (adv) => {
		if (adv.advert_id) {
			alert('Advert created successfully!');
			props.history.go(0);
			return;
		}
		setCurrent(1);
	};

	const handleGoalChange = (val) => {
		setGoal(val);
	};

	const handleAudienceChange = (val) => {
		setAudience(val);
		const destructuredAudience = [...audiences];
	};

	const handleSetAudiences = (val) => {
		setAudiences(val);
	};

	const handleCloseBackdrop = () => {
		if (isLoading) {
			return;
		}
		setIsLoading(false);
	};

	const hadleSetPriceAndDuration = (amount, acDuration) => {
		setPrice(amount);
		setDuration(acDuration);
	};

	const handlePayChange = (val, transaction_id) => {
		setHasPaid(val);
		setTransactionId(transaction_id);
	};

	const handleModalClose = () => {
		setModalOpen(false);
		if (topPost.id !== post.id) {
			setPost(topPost);
		}
	};

	const handlePostSelect = (e, selectedPost) => {
		$('#postSelectModal').scrollTop(0);
		const selectedObject = {
			id: selectedPost.post_id,
			img:
				selectedPost.post_type === 'image'
					? `${BASE_URL}${selectedPost.post_image[0]}`
					: `${BASE_URL}${selectedPost.thumbnail}`,
		};
		setPost(selectedObject);
	};

	const handleModalType = (e, type, promo = {}) => {
		setAdvert(promo);
		setModalType(type);
		setModalOpen(true);
	};

	const editAudience = (audienceObj, type) => {
		const destructuredAudiences = [...audiences];
		const audienceIndex = destructuredAudiences.findIndex(
			(x) => x.audience_id === audienceObj.audience_id
		);
		if (audienceIndex !== -1) {
			if (type === 'delete') {
				destructuredAudiences.splice(audienceIndex, 1);
				setAudiences(destructuredAudiences);
				setAudience(destructuredAudiences[0] ? destructuredAudiences[0] : {});
			}
			if (type === 'edit') {
				destructuredAudiences[audienceIndex] = audienceObj;
				setAudiences(destructuredAudiences);
				setAudience(audienceObj);
			}
		}
	};

	const classes = useStyles();

	let promoBody = <span>You have no adverts</span>;

	if (adverts.length > 0) {
		promoBody = (
			<div className={classes.postContainer}>
				{adverts.map((adv) => (
					<img
						key={adv.advert_id}
						src={
							adv.post.post_type === 'image'
								? `${BASE_URL}${adv.post.post_image[0]}`
								: `${BASE_URL} ${adv.post.thumbnail}`
						}
						alt="advert img"
						className={classes.postImg}
						onClick={(e) => handleModalType(e, 'manage', adv)}
					/>
				))}
			</div>
		);
	}

	let modalBody = (
		<div style={modalStyle} className={classes.modal} id="managePromoModal">
			<div>No post to promote</div>
		</div>
	);

	if (modalType === 'posts' && posts.length !== 0) {
		modalBody = (
			<div style={modalStyle} className={classes.modal} id="postSelectModal">
				<div className={classes.postPreview}>
					<div className={classes.modalHeader}>
						Post preview
						<ArrowForward onClick={handleNext} className={classes.iconSize} />
					</div>
					<img
						src={post.img}
						className={classes.postPreviewImg}
						alt="preview img"
					/>
				</div>
				<div className={classes.postContainer}>
					{posts.map((pst) => (
						<img
							key={pst.post_id}
							className={classes.postImg}
							src={
								pst.post_type === 'image'
									? `${BASE_URL}${pst.post_image[0]}`
									: `${BASE_URL}${pst.thumbnail}`
							}
							alt="post img"
							onClick={(e) => handlePostSelect(e, pst)}
						/>
					))}
				</div>
			</div>
		);
	}

	if (modalType === 'manage') {
		modalBody = (
			<div style={modalStyle} className={classes.modal} id="managePromoModal">
				<div className={classes.postPreview}>
					<div className={classes.modalHeader}>
						<Close onClick={handleModalClose} />
					</div>
					<img
						className={classes.postPreviewImg}
						alt="Advert thumbnail"
						src={
							advert.post.post_type === 'image'
								? `${BASE_URL}${advert.post.post_image[0]}`
								: `${BASE_URL}${advert.post.thumbnail}`
						}
					/>
				</div>
				<div className={classes.accordionRoot}>
					<h2>Details</h2>
					{advert.status !== 'review' && (
						<Accordion>
							<AccordionSummary
								expandIcon={<ExpandMore />}
								aria-controls="panel3a-content"
								id="panel3a-header"
							>
								<Typography className={classes.accordionHeading}>
									Post Analytics
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									<span>Views: {advert.post.post_view_count}</span>
									<span>Comments: {advert.post.comment_count}</span>
									<span>Likes: {advert.post.like_count}</span>
								</Typography>
							</AccordionDetails>
						</Accordion>
					)}
					<Accordion>
						<AccordionSummary
							aria-controls="panel0a-content"
							id="panel0a-header"
						>
							<Typography className={classes.accordionHeading}>
								Status
							</Typography>
							<Typography className={classes.secondaryHeading}>
								{advert.status.toUpperCase() === 'REVIEW'
									? `IN ${advert.status.toUpperCase()}`
									: advert.status.toUpperCase()}
							</Typography>
						</AccordionSummary>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMore />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography className={classes.accordionHeading}>
								Audience
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								<span>Name: {advert.audience.name}</span>
								<span>Age Range: {advert.audience.age_range}</span>
								<span>Countries: {advert.audience.country.join(', ')}</span>
								<span>Gender: {advert.audience.gender}</span>
								<span>Interests: {advert.audience.interests.join(', ')}</span>
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMore />}
							aria-controls="panel2a-content"
							id="panel2a-header"
						>
							<Typography className={classes.accordionHeading}>
								Budget
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								<span>Price: ${advert.budget.amount}</span>
								<span>Duration: {advert.budget.duration} day(s)</span>
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMore />}
							aria-controls="panel3a-content"
							id="panel3a-header"
						>
							<Typography className={classes.accordionHeading}>Goal</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								<span>Type: {advert.goal.goal_type}</span>
								{advert.goal.goal_type.toLowerCase() ===
								'more website visits' ? (
									<span>Url: {advert.goal.url}</span>
								) : (
									<span>Profile: {advert.goal.url}</span>
								)}
							</Typography>
						</AccordionDetails>
					</Accordion>
				</div>
			</div>
		);
	}

	let item;
	if (current === 0) {
		item = (
			<div className={classes.root}>
				{/* <Backdrop
					className={classes.backdrop}
					open={isLoading}
					onClick={handleCloseBackdrop}
				>
					<CircularProgress color="inherit" />
				</Backdrop> */}
				{isLoading ? null : (
					<>
						<Modal
							onClose={handleModalClose}
							aria-labelledby="create-audience-modal"
							open={modalOpen}
						>
							{modalBody}
						</Modal>
						<div>
							<h1>Create Advert</h1>
							<button
								className="nextBtn"
								onClick={(e) => handleModalType(e, 'posts')}
							>
								Choose a post
							</button>
							<p>Promote top post</p>
							<span>
								Find a bigger audience for the this high engagement post
							</span>
						</div>
					</>
				)}
			</div>
		);
	}

	if (current === 1) {
		item = (
			<Goal
				resetCurrent={resetCurrent}
				goal={goal}
				setGoalId={setGoalId}
				handleGoalChange={handleGoalChange}
				handleNext={handleNext}
				isLoading={isLoading}
				setIsLoading={setIsLoading}
			/>
		);
	}

	if (current === 2) {
		item = (
			<Audience
				handlePrevious={handleprevious}
				audience={audience}
				audiences={audiences}
				handleAudienceChange={handleAudienceChange}
				setAudiences={handleSetAudiences}
				handleNext={handleNext}
				editAudience={editAudience}
			/>
		);
	}

	if (current === 3) {
		item = (
			<Duration
				handlePrevious={handleprevious}
				handleNext={handleNext}
				handleSetPriceAndDuration={hadleSetPriceAndDuration}
				duration={duration}
				price={price}
				setIsLoading={setIsLoading}
				setBudgetId={setBudgetId}
			/>
		);
	}

	if (current === 4) {
		let audienceCountries;
		if (audience.country.length > 3) {
			const trimmedCountries = audience.country.splice(0, 3);
			audienceCountries = trimmedCountries.join(', ') + '...';
		} else {
			audienceCountries = audience.country.join(', ');
		}
		const audienceAge = audience.age_range.split('-')[0];

		if (goal === {} || audience === {} || !price) {
			toast('Please fill previous stages', {
				position: 'top-center',
				type: 'info',
			});
			setCurrent(0);
			return;
		}

		const choices = [
			{
				type: 'Goal',
				choice: `${goal.goal_type
					.split('_')
					.join(' ')
					.toUpperCase()} | ${goal.url}`,
			},
			{
				type: 'Audience',
				choice: `${audience.name} | ${audienceAge}+ | ${audienceCountries}`,
			},
			{
				type: 'Budget and Duration',
				choice: `$${price}/${duration}day(s)`,
			},
		];

		item = (
			<Review
				handlePrevious={handleprevious}
				choices={choices}
				price={price}
				duration={duration}
				audience={audience}
				post={post}
				goal={goal}
				resetCurrent={resetCurrent}
				hasPaid={hasPaid}
				transactionID={transactionID}
				setOrderId={handleSetOrderId}
				handlePayChange={handlePayChange}
				orderID={orderID}
				goal_id={goal_id}
				budget_id={budgetId}
			/>
		);
	}

	return (
		<>
			<div className="overallContainer">
				<CustomizedSteppers
					activeStep={current}
					handleSetCurrent={handleSetCurrent}
				/>
				{isLoading ? (
					<Backdrop
						className={classes.backdrop}
						open={isLoading}
						onClick={handleCloseBackdrop}
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				) : (
					<ContentContainer>{item}</ContentContainer>
				)}
			</div>
			{current === 0 ? (
				<AdvertList ads={adverts} openAdModal={handleModalType} />
			) : null}
			<Footer idName="homefooter" />
		</>
	);
}

export default withErrorHandler(Advert, axios);
