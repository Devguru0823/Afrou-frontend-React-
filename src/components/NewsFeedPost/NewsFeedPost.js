import React, { Component } from 'react';
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
import UserList from '../../components/UserList/UserList';
import { SIZE_300 } from '../../constants/imageSizes';
import { toastOptions } from '../../constants/toastOptions';
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
					title:
						'A social site for Afro-world, To Empower the New Afro Generation.... #BringItOn#.',
					url: `https://afrocamgist.com/post/${this.props.feedDetails.post_id}`,
				})
				.then(() => {
					toast.success('Shared successfully', toastOptions);
				})
				.catch(() => {
					toast.error('Oops! something went wrong', toastOptions);
				});
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

	showImages = (images, isVisible, postId) => {
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
		if (isVisible && postId) {
			this.handleViewPost(postId);
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

	handleSharePop = (data) => {
		this.setState({ showSharePop: true, selectedItem: data });
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
		comment.post_id = this.props.feedDetails.post_id;
		this.props.postComment(this.props.token, comment);
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

	handleCloseViewBox = () => {
		this.setState({ showViewer: false });
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
		// console.log(config.headers.Authorization, id);
		// dispatch(uiStartLoading());
		axios
			.put(`posts/${postId}/afroswagger`, {}, config)
			.then((response) => {
				// debugger;
				// console.log("response", response);
				// dispatch(uiStopLoading());
			})
			.catch((err) => {
				// debugger;
				// dispatch(uiStopLoading());
				console.log(err);
			});
	};
	viewBackgroundImage = (
		bg_image_post,
		bg_image,
		replacedText,
		post_id,
		post_type,
		isVisible
	) => {
		if (isVisible && post_id && post_type === 'text') {
			console.log('test');
			this.handleViewPost(post_id);
		}
		return (
			<div
				className={`postmainconts ${bg_image_post && 'post-bg-image'}`}
				style={
					bg_image_post
						? { backgroundImage: `url(${BASE_URL}${bg_image})` }
						: null
				}
			>
				{replacedText}
			</div>
		);
	};

	handleBoostPost = (post_id) => {
		localStorage.setItem('selected_post', post_id);
		this.props.history.push('/advert');
	};

	render() {
		const {
			post_text,
			post_image,
			post_video,
			post_date,
			post_id,
			like_count,
			comment_count,
			comments,
			liked,
			first_name,
			last_name,
			user_id,
			post_type,
			profile_image_url,
			thumbnail,
			posted_for,
			post_location,
			enable_follow,
			bg_image_post,
			bg_image,
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
						imageUrl={`${BASE_URL}${profile_image_url}?width=300`}
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
								onClick={() => this.setState({ showViewer: true })}
							/>
						</div>
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
							)}
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
							{this.props.boost && (
								<span>
									<button
										type="button"
										className="boost-button"
										onClick={() => this.handleBoostPost(post_id)}
									>
										Boost
									</button>
								</span>
							)}
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
					{/* background image */}
					<VisibilitySensor partialVisibility={true}>
						{({ isVisible }) =>
							this.viewBackgroundImage(
								bg_image_post,
								bg_image,
								replacedText,
								post_id,
								post_type,
								isVisible
							)
						}
					</VisibilitySensor>
					{/* background image and text
          <div
            className={`postmainconts ${bg_image_post && "post-bg-image"}`}
            style={
              bg_image_post
                ? { backgroundImage: `url(${BASE_URL}${bg_image})` }
                : null
            }
          >
            {replacedText}
          </div> */}
					{/* {
            post_type === 'image' ?
              post_image instanceof Array && post_image.length > 1 ?
                this.showImages(post_image) :
                <SingleImagePost data={this.props.feedDetails}/> :
              null
          }
          {
            post_type === 'video' ?
              <div className="postimgvdo post-video">
                <div className="react-player-background" style={{backgroundImage: `url(${BASE_URL}${thumbnail})`}}/>
                <ReactPlayer
                  url={`${BASE_URL}${post_video}`}
                  controls
                  style={{maxWidth: '100%'}}
                  light={`${BASE_URL}${thumbnail}`}
                />
              </div> :
              null
          } */}
					<VisibilitySensor minTopValue={200} partialVisibility={true}>
						{({ isVisible }) =>
							post_type === 'image' ? (
								post_image instanceof Array && post_image.length > 1 ? (
									this.showImages(post_image, isVisible, post_id)
								) : (
									<SingleImagePost
										data={this.props.feedDetails}
										isVisible={isVisible}
										postId={post_id}
										handleViewPost={this.handleViewPost}
									/>
								)
							) : null
						}
					</VisibilitySensor>
					{post_type === 'video' ? (
						<div className="postimgvdo post-video">
							<div
								className="react-player-background"
								style={{ backgroundImage: `url(${BASE_URL}${thumbnail})` }}
							/>
							<ReactPlayer
								url={`${BASE_URL}${post_video}`}
								controls
								style={{ maxWidth: '100%' }}
								light={`${BASE_URL}${thumbnail}`}
								postId={post_id}
								handleViewPost={this.handleViewPost}
							/>
						</div>
					) : null}
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
							<li
								className="sharethat"
								onClick={() => this.handleSharePop(this.props.feedDetails)}
							>
								<i className="fa fa-share" />
								Share
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
