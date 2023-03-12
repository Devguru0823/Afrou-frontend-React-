import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import withErrorHandler from '../../utils/withErrorHandler';
import ProfileLayout from '../../hoc/Profile/Profile';
import NewsFeedPost from '../../components/NewsFeedPost/NewsFeedPost';
import ProfileImageView from '../../components/ProfileInfoBox/ProfileImageView';
import NewsFeedPostShared from '../../components/NewsFeedPost/NewsFeedPostShared';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import ProfilePeople from '../../components/ProfilePeople/ProfilePeople';
import ProfileDetails from './ProfileDetails';
import {
	fetchProfileFeed,
	postLike,
	updateProfileFeed,
	fetchProfileDetails,
	resetProfileFeed,
	postProfileComment,
	updateUserDetails,
	updateProfileFeedPostText,
	updateProfileFeedDelete,
	updateProfileFeedCommentLike,
	postCommentLike,
	commentManipulateProfile,
	updateProfileCover,
	updateProfileFollow,
} from '../../redux/actions';
import axios from '../../utils/axiosConfig';

const loggedInUser = JSON.parse(localStorage.getItem('user'));

class Profile extends Component {
	constructor(props) {
		super(props);
		if (Number(props.match.params.id) === props.user.user_id) {
			this.props.history.replace('/profile');
		}
		this.state = {
			showViewer: false,
			viewerUrl: '',
		};
	}

	componentWillUnmount() {
		this.props.resetProfileFeed();
	}

	loadItems = () => {
		if (!this.props.isLoading) {
			this.props.fetchFeed(
				this.props.token,
				this.props.nextPage === null ? 1 : this.props.nextPage,
				Number(this.props.match.params.id) === this.props.user.user_id
					? undefined
					: this.props.match.params.id
			);
		}
	};

	handleLike = (id) => {
		this.props.updateProfileFeed(this.props.feeds, id, this.props.nextPage);
		this.props.postLike(this.props.token, id);
	};

	handleCommentLike = (id, commentId) => {
		this.props.updateFeedCommentLike(this.props.feeds, id, commentId);
		this.props.postCommentLike(this.props.token, commentId);
	};

	handleComment = (id, comment) => {
		const newComment = { post_id: id, ...comment };
		this.props.postComment(
			this.props.token,
			newComment,
			this.props.user,
			this.props.feeds
		);
	};

	handleRequestButton = (url) => {
		const config = {
			headers: { Authorization: 'bearer ' + this.props.token },
		};

		axios
			.get(url, config)
			.then((response) => {
				//console.log(response.data.data.data);
				this.props.updateUserDetails(this.props.user, response.data.data);
				this.props.history.replace('/profile/' + this.props.match.params.id);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	handleUpdatePost = (id, text) => {
		this.props.updatePostText(this.props.token, this.props.feeds, id, text);
	};

	handleDeletePost = (id) => {
		this.props.updatePostDelete(this.props.token, this.props.feeds, id);
	};

	handleTalentCommentDelete = (index, parentArray, array) => {
		let parentIndex = index;
		let childIndex = null;
		const newArray = [...parentArray];
		if (array) {
			childIndex = index;
			parentIndex = parentArray.findIndex(
				(element) => array[index].comment_parent_id === element.comment_id
			);
			const childComments = [...newArray[parentIndex].sub_comments];
			const deleted = childComments.splice(childIndex, 1);
			newArray[parentIndex].sub_comments = childComments;
			const postId = deleted[0].post_id;
			const commentId = deleted[0].comment_id;
			this.props.commentManipulate(
				this.props.token,
				this.props.feeds,
				postId,
				commentId,
				newArray
			);
		} else {
			const deleted = newArray.splice(parentIndex, 1);
			const postId = deleted[0].post_id;
			const commentId = deleted[0].comment_id;
			this.props.commentManipulate(
				this.props.token,
				this.props.feeds,
				postId,
				commentId,
				newArray
			);
		}
	};

	handleTalentCommentEdit = (index, text, parentArray, array) => {
		let parentIndex = index;
		let childIndex = null;
		const newArray = [...parentArray];
		if (array) {
			childIndex = index;
			parentIndex = parentArray.findIndex(
				(element) => array[index].comment_parent_id === element.comment_id
			);
			const childComments = [...newArray[parentIndex].sub_comments];
			childComments[childIndex].comment_text = text.comment_text;
			newArray[parentIndex].sub_comments = childComments;
			this.props.commentManipulate(
				this.props.token,
				this.props.feeds,
				childComments[childIndex].post_id,
				childComments[childIndex].comment_id,
				newArray,
				'edit',
				text
			);
		} else {
			newArray[parentIndex].comment_text = text.comment_text;
			this.props.commentManipulate(
				this.props.token,
				this.props.feeds,
				newArray[parentIndex].post_id,
				newArray[parentIndex].comment_id,
				newArray,
				'edit',
				text
			);
		}
	};

	handleOpenViewBox = (url) => {
		this.setState({ showViewer: true, viewerUrl: url });
	};

	handleCloseViewBox = () => {
		this.setState({ showViewer: false, viewerUrl: '' });
	};

	handleCoverUpload = (file, type) => {
		this.props.onUploadCover(file, type, this.props.user, this.props.token);
	};

	render() {
		const loader = (
			<HorizontalLoader key={Date.now()}>Loading ...</HorizontalLoader>
		);
		const { profileDetails } = this.props;

		const items = [];
		this.props.feeds.map((feed) => {
			if (feed.post_type === 'shared') {
				items.push(
					<NewsFeedPostShared
						key={feed._id}
						userId={this.props.user.user_id}
						profileImage={this.props.user.profile_image_url}
						token={this.props.token}
						feedDetails={feed}
						postLike={this.handleLike}
						postCommentLike={this.handleCommentLike}
						postComment={this.handleComment}
						updatePost={this.handleUpdatePost}
						updateDelete={this.handleDeletePost}
						resetFeed={this.props.resetProfileFeed}
						onCommentDelete={this.handleTalentCommentDelete}
						onCommentEdit={this.handleTalentCommentEdit}
						onFollowClick={this.props.updateSwaggerFollow}
					/>
				);
			} else {
				items.push(
					<NewsFeedPost
						key={feed._id}
						userId={this.props.user.user_id}
						profileImage={this.props.user.profile_image_url}
						token={this.props.token}
						feedDetails={feed}
						postLike={this.handleLike}
						postCommentLike={this.handleCommentLike}
						postComment={this.handleComment}
						updatePost={this.handleUpdatePost}
						updateDelete={this.handleDeletePost}
						resetFeed={this.props.resetProfileFeed}
						onCommentDelete={this.handleTalentCommentDelete}
						onCommentEdit={this.handleTalentCommentEdit}
						onFollowClick={this.props.updateSwaggerFollow}
						boost={feed.post_type === 'image' || feed.post_type === 'video'}
					/>
				);
			}
		});

		return (
			<ProfileLayout>
				<div className="midleconarea">
					{this.state.showViewer ? (
						<ProfileImageView
							closeImageBox={this.handleCloseViewBox}
							imageUrl={this.state.viewerUrl}
						/>
					) : null}
					{
						<div className="insiderarea marbtm20">
							<ProfileDetails
								isLoading={this.props.isLoading}
								profileDetails={profileDetails}
								isOwnProfile={!this.props.match.params.id}
								onOpenViewBox={this.handleOpenViewBox}
								onUploadCover={this.handleCoverUpload}
							/>
							<div className="row">
								<div className="col-md-9 otfrdata">
									{profileDetails.first_name ? (
										<h6>{`${profileDetails.first_name} ${profileDetails.last_name}`}</h6>
									) : (
										<h6>Loading...</h6>
									)}
									{this.props.match.params.id ? (
										<div>
											<span>
												Followings :{' '}
												{profileDetails.followings_list
													? profileDetails.followings_list.length
													: 0}
											</span>
											<span>
												Followers :{' '}
												{profileDetails.followers_list
													? profileDetails.followers_list.length
													: 0}
											</span>
										</div>
									) : (
										<div>
											<Link to="/followings">
												<span>
													Following :{' '}
													{profileDetails.followings_list
														? profileDetails.followings_list.length
														: 0}{' '}
													/{' '}
												</span>
											</Link>
											<Link to="/followers">
												<span>
													Followers :{' '}
													{profileDetails.followers_list
														? profileDetails.followers_list.length
														: 0}
												</span>
											</Link>
										</div>
									)}
									<div>
										{profileDetails.sports_interests ? (
											<div className="profile-activities">
												<span>Interests:</span>
												<small>
													{profileDetails.sports_interests
														.filter((interest, index) => index < 2)
														.map((interest, index) => (
															<i key={index}>{interest}</i>
														))}
												</small>
											</div>
										) : (
											''
										)}
									</div>
									<div>
										{profileDetails.nationality ? (
											<div className="profile-activities">
												<span>Country:</span>{' '}
												<small>{profileDetails.nationality}</small>
											</div>
										) : (
											''
										)}
									</div>
									<div>
										{profileDetails.career_interest ? (
											<div className="profile-activities">
												<span>Profession:</span>{' '}
												<small>{profileDetails.career_interest}</small>
											</div>
										) : (
											''
										)}
									</div>
									<div>
										{profileDetails.about ? (
											<div className="profile-activities">
												<span>Bio:</span> <small>{profileDetails.about}</small>
											</div>
										) : (
											''
										)}
									</div>
									{this.props.match.params.id &&
									this.props.match.params.id !== loggedInUser.user_id ? null : (
										<div className="promotion-btn">
											<Link to="/advert" className="btn" id="promotionBtn">
												Advert
											</Link>
											{/* <button type="button" className="btn" id="promotionBtn" onClick={this.handleRedirect}>
                    Promotion
                    </button> */}
										</div>
									)}
								</div>
								{profileDetails.request_buttons ? (
									<div className="col-md-3 otfrbttn">
										{profileDetails.request_buttons.map((button) => (
											<button
												key={button.button_text}
												type="button"
												className={button.button_type}
												onClick={() =>
													this.handleRequestButton(button.button_link)
												}
											>
												{button.button_text === 'Role Model' ? (
													<i
														className="fa fa-heart"
														aria-hidden="true"
														style={{ color: '#e2264d' }}
													/>
												) : button.button_text === 'Remove Role Model' ? (
													<i
														className="fa fa-heart-o"
														aria-hidden="true"
														style={{ color: '#e2264d' }}
													/>
												) : (
													button.button_text
												)}
											</button>
										))}
										{profileDetails.is_my_friend ? (
											<Link
												to={`/messages/conversation/${profileDetails.user_id}`}
												type="button"
												className="removefriend"
											>
												<i className="fa fa-comments" />
											</Link>
										) : null}
									</div>
								) : null}
							</div>
							{this.props.match.params.id && profileDetails.is_my_friend ? (
								<ProfilePeople
									isLoading={this.props.isLoading}
									friends={profileDetails.friends_list || null}
									followings={profileDetails.followings_list || null}
									followers={profileDetails.followers_list || null}
								/>
							) : null}
						</div>
					}
					{profileDetails.is_my_friend === false ? null : (
						<InfiniteScroll
							pageStart={0}
							loadMore={this.loadItems}
							hasMore={this.props.hasMorePage}
							loader={loader}
						>
							{items}
						</InfiniteScroll>
					)}
				</div>
			</ProfileLayout>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		token: state.auth.token,
		feeds: state.profile.feed,
		nextPage: state.profile.nextPage,
		hasMorePage: state.profile.hasMorePage,
		profileDetails: state.profile.profileDetails,
		isLoading: state.ui.isLoading,
		user: state.auth.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchFeed: (token, pageNumber, profileId) =>
			dispatch(fetchProfileFeed(token, pageNumber, profileId)),
		postLike: (token, id) => dispatch(postLike(token, id)),
		postCommentLike: (token, id) => dispatch(postCommentLike(token, id)),
		updateProfileFeed: (feeds, id) => dispatch(updateProfileFeed(feeds, id)),
		fetchProfileDetails: (token, id) =>
			dispatch(fetchProfileDetails(token, id)),
		resetProfileFeed: () => dispatch(resetProfileFeed()),
		postComment: (token, comment, user, feeds) =>
			dispatch(postProfileComment(token, comment, user, feeds)),
		updateFeedCommentLike: (feeds, id, commentId) =>
			dispatch(updateProfileFeedCommentLike(feeds, id, commentId)),
		updateUserDetails: (user, newData) =>
			dispatch(updateUserDetails(user, newData)),
		updatePostText: (token, feeds, id, text) =>
			dispatch(updateProfileFeedPostText(token, feeds, id, text)),
		updatePostDelete: (token, feeds, id) =>
			dispatch(updateProfileFeedDelete(token, feeds, id)),
		commentManipulate: (token, feeds, id, commentId, comments, isEdit, text) =>
			dispatch(
				commentManipulateProfile(
					token,
					feeds,
					id,
					commentId,
					comments,
					isEdit,
					text
				)
			),
		onUploadCover: (file, type, user, token) =>
			dispatch(updateProfileCover(file, type, user, token)),
		updateSwaggerFollow: (id) => dispatch(updateProfileFollow(id)),
	};
};

export default withErrorHandler(
	connect(mapStateToProps, mapDispatchToProps)(Profile),
	axios
);
