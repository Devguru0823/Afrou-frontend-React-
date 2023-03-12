import React, { Component } from 'react';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import stringReplace from 'react-string-replace';

import SocialShareBox from './SocialShareBox/SocialShareBox';
import CommentBox from '../CommentBox/CommentBox';
import { BASE_URL } from '../../constants/ImageUrls';
import Gallery from 'react-grid-gallery';
import EditPost from './EditPost/EditPost';
import SharePost from './SharePost/SharePost';
import ReportPost from './ReportPost/ReportPost';
import CommentItem from '../../components/CommentItem/CommentItem';
import ReactPlayer from '../../components/CustomReactPlayer/CustomReactPlayer';
import SingleImagePost from './SingleImagePost/SingleImagePost';
import ProfileImageView from '../../components/ProfileInfoBox/ProfileImageView';
import { SIZE_300 } from '../../constants/imageSizes';
import { toastOptions } from '../../constants/toastOptions';
import UserList from '../UserList/UserList';
import axios from '../../utils/axiosConfig';
import VisibilitySensor from 'react-visibility-sensor';
import { countries } from '../../constants/countries';

class NewsFeedPost extends Component {
	state = {
		userListVisible: false,
		shareVisible: false,
		commentBoxVisible: false,
		showEditPostForm: false,
		showSharePop: false,
		showViewer: false,
		viewerImageUrl: null,
		selectedItem: null,
		deleteText: 'Delete',
		isCommentReply: false,
		commentId: null,
		modifiedLength: this.props.isPostModal ? 3 : 0,
		postMenuVisible: false,
		reportFormVisible: false,
		followLoading: false,
		following: this.props.feedDetails.following,
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.feedDetails.following !== this.props.feedDetails.following) {
			this.setState({ following: this.props.feedDetails.following });
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	showShareMenu = (event) => {
		event.preventDefault();

		if (navigator.share) {
			navigator
				.share({
					title: 'Afrocamgist',
					text:
						'A social site for Afro-world, To Empower the New Afro Generation.... #BringItOn#.',
					url: `https://afrocamgist.com/post/${this.props.feedDetails.post_id}`,
				})
				.then(() => {
					toast.success('Shared successfully', toastOptions);
				})
				.catch((error) => console.log('Error sharing:', error));
		} else {
			this.setState({ shareVisible: true }, () => {
				document.addEventListener('click', this.closeShareMenu);
			});
		}
	};

	closeShareMenu = () => {
		this.setState({ shareVisible: false }, () => {
			document.removeEventListener('click', this.closeShareMenu);
		});
	};

	myImageStyleFn() {
		this.props.item.thumbnailWidth = '393px';
		this.props.item.thumbnailHeight = '591px';
	}

	myViewportStyleFn() {
		this.props.item.thumbnailWidth = '591px';
		this.props.item.thumbnailHeight = '591px';
	}

	showImages = (images) => {
		if (images.length === 1) {
			this.imageArray = images.map((image) => {
				return {
					src: BASE_URL + image,
					thumbnail: BASE_URL + image,
					thumbnailWidth: 591,
					thumbnailHeight: 393,
				};
			});
		} else if (images.length % 2 !== 0) {
			this.imageArray = images.map((image, index) => {
				if ((index + 1) % 3 === 0) {
					return {
						src: BASE_URL + image,
						thumbnail: BASE_URL + image,
						thumbnailWidth: 320,
						thumbnailHeight: 90,
					};
				} else {
					return {
						src: BASE_URL + image,
						thumbnail: BASE_URL + image,
						thumbnailWidth: 320,
						thumbnailHeight: 174,
					};
				}
			});
		} else {
			this.imageArray = images.map((image) => {
				return {
					src: BASE_URL + image,
					thumbnail: BASE_URL + image,
					thumbnailWidth: 320,
					thumbnailHeight: 174,
				};
			});
		}

		return (
			<div className="postimgvdo">
				{images.length === 1 ? (
					<div className="single-image-gallery">
						<Gallery
							images={this.imageArray}
							enableImageSelection={false}
							thumbnailStyle={this.myImageStyleFn}
							tileViewportStyle={this.myViewportStyleFn}
						/>
					</div>
				) : (
					<Gallery images={this.imageArray} enableImageSelection={false} />
				)}
			</div>
		);
	};

	handleCloseEditPostForm = () => {
		this.setState({ showEditPostForm: false, selectedItem: null });
	};

	handleCloseSharePop = (shared) => {
		this.setState({ showSharePop: false, selectedItem: null });
		if (shared) {
			this.props.resetFeed();
		}
	};

	handleEdit = (data) => {
		this.setState({ showEditPostForm: true, selectedItem: data });
	};

	handleDelete = (id, hidePost) => {
		if (this.state.deleteText === 'Delete') {
			this.setState({ deleteText: 'Please click again to confirm' });
			this.deleteTimeOut = setTimeout(
				() => this.setState({ deleteText: 'Delete' }),
				4000
			);
		} else {
			clearTimeout(this.deleteTimeOut);
			if (hidePost) {
				this.props.updateDelete({ id, hidePost });
			}
			this.props.updateDelete(id);
		}
	};

	handleComment = (comment) => {
		this.props.postComment(this.props.feedDetails.post_id, comment);
		this.setState({ commentBoxVisible: false });
	};

	handleMoreComments = (number) => {
		if (number) {
			this.setState({ modifiedLength: number });
		} else {
			this.setState({ modifiedLength: 100 });
		}
	};

	/*handleLessComments = () => {
    this.setState({modifiedLength: 1})
  };*/

	imageClickedHandler = (url) => {
		this.setState({ showViewer: true, viewerImageUrl: url });
	};

	handleCloseViewBox = () => {
		this.setState({ showViewer: false, viewerImageUrl: null });
	};

	handleReport = () => {
		this.setState({ reportFormVisible: true });
	};

	handleReportFormClose = () => {
		this.setState({ reportFormVisible: false });
	};

	handleHashLinks = (str) =>
		stringReplace(str, /#(\w+)/g, (match, i) => (
			<Link key={match + i} to={`/hashtags/${match}`}>
				#{match}
			</Link>
		));

	handleFollowUnfollow = () => {
		const config = {
			headers: { Authorization: 'bearer ' + this.props.token },
		};
		let url = `/profile/${this.props.feedDetails.user_id}/follow`;
		if (this.state.following) {
			url = `/profile/${this.props.feedDetails.user_id}/cancel-follow`;
		}
		this.setState({ followLoading: true });
		axios
			.get(url, config)
			.then(() => {
				this.props.onFollowClick(this.props.feedDetails.user_id);
				this.setState({ followLoading: false });
			})
			.catch(() => {
				this.setState({ followLoading: false });
			});
	};
	handleViewPost = (postId) => {
		// console.log("view post done", postId);
		const config = {
			headers: {
				Authorization: 'bearer ' + this.props.token,
			},
		};
		axios
			.put(`posts/${postId}/afroswagger`, {}, config)
			.then((response) => {
				// console.log("response", response);
			})
			.catch((err) => {
				// console.log(err);
			});
	};
	viewBackgroundImage = (
		shared_post_data_bg_image_post,
		shared_post_data_bg_image,
		replacedTextShared,
		post_id,
		post_type,
		isVisible
	) => {
		if (isVisible && post_id && post_type === 'text') {
			this.handleViewPost(post_id);
		}
		return (
			<div
				className={`postmainconts ${shared_post_data_bg_image_post &&
					'post-bg-image'}`}
				style={
					shared_post_data_bg_image_post
						? {
								backgroundImage: `url(${BASE_URL}${shared_post_data_bg_image})`,
						  }
						: null
				}
			>
				{replacedTextShared}
			</div>
		);
	};
	render() {
		const {
			post_text,
			post_date,
			post_id,
			like_count,
			comment_count,
			comments,
			liked,
			first_name,
			last_name,
			user_id,
			profile_image_url,
			shared_post_data,
			posted_for,
			post_location,
			enable_follow,
			user_name,
			requestedUser,
		} = this.props.feedDetails;

		const { following, followLoading } = this.state;

		let postLocation = null;
		let countryFlag = '';
		if (post_location && post_location !== 'Unknown Location') {
			let locationArray = post_location.split(', ');
			if (locationArray.length > 3) {
				locationArray = locationArray.splice(0, 3);
			}
			postLocation = locationArray.join(', ');
			const countryName = locationArray[locationArray.length - 1];
			const userCountry = countries.find(
				(country) => country.name.toLowerCase() === countryName.toLowerCase()
			);
			if (userCountry) {
				countryFlag = `https://flagcdn.com/16x12/${userCountry.code.toLowerCase()}.png`;
			}
		}

		const replacedText = this.handleHashLinks(post_text);

		const replacedTextShared = this.handleHashLinks(
			shared_post_data ? shared_post_data.post_text : ''
		);

		this.state.showEditPostForm
			? document.body.classList.add('actpopup')
			: document.body.classList.remove('actpopup');
		this.state.showSharePop
			? document.body.classList.add('actpopup')
			: document.body.classList.remove('actpopup');

		return (
			<div>
				<div className="clearfix" />
				{this.state.userListVisible && like_count !== 0 ? (
					<UserList
						postId={post_id}
						onClose={() => this.setState({ userListVisible: false })}
						token={this.props.token}
					/>
				) : null}
				{this.state.selectedItem ? (
					<EditPost
						token={this.props.token}
						visible={this.state.showEditPostForm}
						onClose={this.handleCloseEditPostForm}
						data={this.state.selectedItem}
						updatePost={(text) => this.props.updatePost(post_id, text)}
					/>
				) : null}
				{this.state.reportFormVisible ? (
					<ReportPost
						postId={post_id}
						onClose={this.handleReportFormClose}
						token={this.props.token}
					/>
				) : null}
				{this.state.showViewer ? (
					<ProfileImageView
						closeImageBox={this.handleCloseViewBox}
						imageUrl={this.state.viewerImageUrl}
					/>
				) : null}
				{this.state.selectedItem ? (
					<SharePost
						profileImage={this.props.profileImage}
						token={this.props.token}
						visible={this.state.showSharePop}
						onClose={this.handleCloseSharePop}
						data={this.state.selectedItem}
						showImages={this.showImages}
						sharingFrom={posted_for}
					/>
				) : null}
				<div className="partofpost">
					<div className="topwithname">
						<div className="userimgg">
							<img
								src={`${BASE_URL}${profile_image_url}${SIZE_300}`}
								alt="image"
								className="img-responsive"
								style={{ cursor: 'pointer', borderRadius: '50%' }}
								onClick={() =>
									this.imageClickedHandler(
										`${BASE_URL}${profile_image_url}${SIZE_300}`
									)
								}
							/>
						</div>
						<div className="rightFlex">
							<div className="namewithtime">
								{user_id === 1 ? (
									user_name ? (
										<a>{user_name}</a>
									) : (
										<a>{`${first_name} ${last_name}`}</a>
									)
								) : user_name ? (
									<Link to={`/profile/${user_id}`}>{user_name}</Link>
								) : (
									<Link
										to={`/profile/${user_id}`}
									>{`${first_name} ${last_name}`}</Link>
								)}{' '}
								has shared a
								<Link
									to={`${
										shared_post_data ? '/post/' + shared_post_data.post_id : ''
									}`}
								>
									{' '}
									post
								</Link>
								{enable_follow ? (
									followLoading ? (
										<button className="follow-on-post">Loading</button>
									) : (
										<button
											className="follow-on-post"
											onClick={() => {
												!requestedUser && this.handleFollowUnfollow();
											}}
											disabled={following}
										>
											{following
												? 'Following'
												: requestedUser
												? 'Requested'
												: 'Follow'}
										</button>
									)
								) : (
									false
								)}
								<Link to={`/post/${post_id}`}>
									<span>
										{/* {moment(post_date).fromNow()} */}
										<span
											style={{
												display: 'block',
												color: 'rgb(51, 51, 51)',
												paddingLeft: 0,
											}}
										>
											{postLocation ? `${postLocation}` : null}
										</span>
										<span>
											{countryFlag !== '' ? (
												<img
													src={countryFlag}
													alt="country flag"
													style={{
														width: '15px',
														height: '15px',
														objectFit: 'cover',
													}}
												></img>
											) : null}
										</span>
									</span>
								</Link>
							</div>
							<div className="righticodeledt">
								<ul
									onClick={() =>
										this.setState((prvState) => ({
											...prvState,
											postMenuVisible: !prvState.postMenuVisible,
										}))
									}
								>
									<li>
										<i className="fa fa-ellipsis-h" />
									</li>
								</ul>
							</div>
						</div>
						{this.state.postMenuVisible ? (
							<div className="righticodeledt">
								{this.props.userId && this.props.userId === user_id ? (
									<ul>
										<li
											className="edtpost"
											onClick={() => this.handleEdit(this.props.feedDetails)}
										>
											<i className="fa fa-edit" />
											Edit
										</li>
										<li
											className="delpost"
											onClick={() => this.handleDelete(post_id)}
										>
											<i className="fa fa-trash" />
											{this.state.deleteText}
										</li>
									</ul>
								) : this.props.isGroupAdmin ? (
									<ul>
										<li
											className="delpost"
											onClick={() => this.handleDelete(post_id)}
										>
											<i className="fa fa-trash" />
											{this.state.deleteText}
										</li>
									</ul>
								) : (
									<ul>
										<li
											className="delpost"
											onClick={() => this.handleDelete(post_id, 'hide post')}
										>
											<i className="fa fa-ban" />
											{this.state.deleteText === 'Delete'
												? 'Hide Post'
												: this.state.deleteText}
										</li>
									</ul>
								)}
							</div>
						) : null}
					</div>
					{post_text ? (
						<div className="postmainconts">{replacedText}</div>
					) : null}
					<div className="shared-portion">
						<div className="topwithname">
							<div className="userimgg">
								<img
									src={
										shared_post_data
											? `${BASE_URL}${shared_post_data.profile_image_url}${SIZE_300}`
											: ''
									}
									alt="shared post img"
									className="img-responsive"
									style={{ cursor: 'pointer', borderRadius: '50%' }}
									onClick={() =>
										this.imageClickedHandler(
											shared_post_data
												? `${BASE_URL}${shared_post_data.profile_image_url}${SIZE_300}`
												: null
										)
									}
								/>
							</div>
							<div className="namewithtime">
								{shared_post_data ? (
									shared_post_data.user_id === 1 ? (
										<a>{`${shared_post_data.first_name} ${shared_post_data.last_name}`}</a>
									) : (
										<Link
											to={`/profile/${shared_post_data.user_id}`}
										>{`${shared_post_data.first_name} ${shared_post_data.last_name}`}</Link>
									)
								) : null}
								<Link
									to={
										shared_post_data ? `/post/${shared_post_data.post_id}` : ''
									}
								>
									{/* <span>{moment(shared_post_data?.post_date).fromNow()}</span> */}
								</Link>
							</div>
						</div>
						{/* <div
              className={`postmainconts ${shared_post_data?.bg_image_post &&
                "post-bg-image"}`}
              style={
                shared_post_data?.bg_image_post
                  ? {
                      backgroundImage: `url(${BASE_URL}${shared_post_data?.bg_image})`,
                    }
                  : null
              }
            >
              {replacedTextShared}
            </div> */}
						<VisibilitySensor partialVisibility={true}>
							{({ isVisible }) =>
								this.viewBackgroundImage(
									shared_post_data ? shared_post_data.bg_image_post : null,
									shared_post_data ? shared_post_data.bg_image : null,
									replacedTextShared,
									post_id,
									shared_post_data ? shared_post_data.post_type : null,
									isVisible
								)
							}
						</VisibilitySensor>
						<VisibilitySensor minTopValue={200} partialVisibility={true}>
							{({ isVisible }) =>
								shared_post_data ? (
									shared_post_data.post_type === 'image' ? (
										shared_post_data.post_image instanceof Array &&
										shared_post_data.post_image.length > 1 ? (
											this.showImages(
												shared_post_data.post_image,
												isVisible,
												post_id
											)
										) : (
											<SingleImagePost
												data={shared_post_data}
												postId={post_id}
												isVisible={isVisible}
												handleViewPost={this.handleViewPost}
											/>
										)
									) : null
								) : null
							}
						</VisibilitySensor>
						{shared_post_data ? (
							shared_post_data.post_type === 'video' ? (
								<div className="postimgvdo post-video">
									<div
										className="react-player-background"
										style={{
											backgroundImage: `url(${BASE_URL}${shared_post_data.thumbnail})`,
										}}
									/>
									<ReactPlayer
										url={`${BASE_URL}${shared_post_data.post_video}`}
										controls
										style={{ maxWidth: '100%' }}
										light={`${BASE_URL}${shared_post_data.thumbnail}`}
										postId={post_id}
										handleViewPost={this.handleViewPost}
									/>
								</div>
							) : null
						) : null}
					</div>
					<div className="clearfix" />
					<div className="postmenuu">
						<ul>
							<li
								className="likethat"
								onClick={() => this.props.postLike(post_id)}
							>
								<i className="fa fa-thumbs-up" />
								{liked ? 'Unlike' : 'Like'}
							</li>
							<li
								className="commentthat"
								onClick={() =>
									this.setState((prevState) => ({
										...prevState,
										commentBoxVisible: true,
										isCommentReply: false,
										commentId: null,
									}))
								}
							>
								<i className="fa fa-comment" />
								Comment
							</li>
							<li className="socialsthat" onClick={this.showShareMenu}>
								<i className="fa fa-share-alt" />
								Social Share
								<SocialShareBox
									visible={this.state.shareVisible}
									postId={post_id}
								/>
							</li>
							<li className="socialsthat" onClick={this.handleReport}>
								<i className="fa fa-exclamation-triangle" />
								Report
							</li>
						</ul>
					</div>
					<div className="postlikecomment">
						<span
							className="liketotal"
							style={{ cursor: 'pointer' }}
							onClick={() => this.setState({ userListVisible: true })}
						>
							<i className="fa fa-thumbs-up" />
							{like_count ? like_count : null}
						</span>
						<span
							className="commenttotal"
							onClick={() => this.handleMoreComments(1)}
							style={{ cursor: 'pointer' }}
						>
							<i className="fa fa-comment" />
							{comment_count ? comment_count : null}
						</span>
					</div>
					<CommentBox
						commentId={this.state.isCommentReply ? this.state.commentId : ''}
						visible={this.state.commentBoxVisible}
						onNewCommentSubmit={this.handleComment}
					/>
					<div className="postcomments">
						<ul>
							{comments.length !== 0
								? comments.map((comment, index, commentParentArray) => {
										const userData = comment.commented_by;
										let commentLength = 0;
										if (this.props.isPostDetail) {
											commentLength = 100;
										}
										if (this.props.isPostModal) {
											commentLength = 3;
										}
										let modifiedLength = commentLength;
										if (this.state.modifiedLength !== 0)
											modifiedLength = this.state.modifiedLength;
										if (index < modifiedLength) {
											return (
												<CommentItem
													key={comment._id}
													comment={comment}
													userData={userData}
													post_id={post_id}
													index={index}
													commentParentArray={commentParentArray}
													postCommentLike={this.props.postCommentLike}
													onCommentDelete={this.props.onCommentDelete}
													postComment={this.props.postComment}
													onCommentEdit={this.props.onCommentEdit}
												/>
											);
										} else {
											return null;
										}
								  })
								: null}
						</ul>
					</div>
					{comments.length !== 0 &&
					!this.props.isPostDetail &&
					(this.state.modifiedLength === 1 ||
						this.state.modifiedLength === 3) ? (
						<div className="readmorearea">
							<span
								onClick={() => this.handleMoreComments()}
								style={{ cursor: 'pointer' }}
							>
								More Comments
							</span>
						</div>
					) : null}
					{/*{
            this.state.modifiedLength > 1 ?
              <div className="readmorearea">
                <span onClick={() => this.handleLessComments()} style={{cursor: 'pointer'}}>Less Comments</span>
              </div> :
              null
          }*/}
				</div>
			</div>
		);
	}
}

export default withRouter(NewsFeedPost);
