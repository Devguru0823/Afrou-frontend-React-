import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from '../../utils/axiosConfig';
import TimelineLayout from '../../hoc/Timeline/Timeline';
import NewsFeedPost from '../../components/NewsFeedPost/NewsFeedPost';
import NewsFeedPostShared from '../../components/NewsFeedPost/NewsFeedPostShared';
import NewPostArea from '../../components/NewPostArea/NewPostArea';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import TextSlider from '../../components/TextSlider/TextSlider';
import {
	fetchSwaggerFeed,
	postFeed,
	postLike,
	updateSwaggerFeed,
	postSwaggerComment,
	fetchMostPopular,
	updateSwaggerFeedPostText,
	updateSwaggerFeedDelete,
	resetSwaggerFeed,
	updateSwaggerFeedCommentLike,
	postCommentLike,
	commentManipulateSwagger,
	showSlider,
	updateSwaggerFollow,
} from '../../redux/actions';
import $ from 'jquery';
import { toast } from 'react-toastify';

class Afroswagger extends Component {
	state = {
		image: {
			file: null,
			path: '',
			isLoading: false,
			thumbnail: null,
			uploadProgress: 0,
		},
		submitted: false,
		loadedFirstTime: false,
		userId: 0,
	};

	_isMounted = true;

	static getDerivedStateFromProps(props, state) {
		if (state.submitted) {
			props.resetFeed();
			return {
				...state,
				submitted: false,
			};
		} else {
			return null;
		}
		// return null;
	}

	componentDidMount() {
		if (this._isMounted) {
			const user = JSON.parse(localStorage.getItem('user'));
			this.setState((prev) => {
				return { ...prev, userId: user.user_id };
			});
			this.props.fetchMostPopular(this.props.token).then((res) => {
				this.setState(
					{
						loadedFirstTime: true,
					},
					() => {
						$(window).scrollTop(0);
					}
				);
			});
		}
	}

	componentWillUnmount() {
		this.props.resetFeed();
		this._isMounted = false;
	}

	loadItems = () => {
		if (!this.props.isLoading) {
			this.props
				.fetchFeed(
					this.props.token,
					this.props.nextPage === null ? 1 : this.props.nextPage
				)
				.then((res) => {
					if (this.props.nextPage === null || this.props.nextPage <= 2) {
						$(window).scrollTop(0);
					}
				})
				.catch((err) => {});
		}
	};

	submitHandler = (data, mode) => {
		console.log(mode);
		let newData = { ...data, post_type: mode };
		if (this.state.image.path) {
			newData = {
				...data,
				post_image: this.state.image.path,
				post_type: 'image',
			};
			if (mode === 'video') {
				newData = {
					...data,
					post_video: this.state.image.path[0],
					post_type: mode,
					thumbnail: this.state.image.thumbnail,
				};
			}
			this.setState((prevState) => {
				return {
					...prevState,
					image: {
						file: null,
						path: '',
						thumbnail: null,
					},
				};
			});
		}
		if (mode === 'text' && newData.post_text === '') {
			toast('Post text is required!', {
				type: 'warning',
				position: 'top-center',
			});
			return;
		}

		console.log(newData);
		this.props.postFeed(this.props.token, newData);
		this.setState({ submitted: true });
	};

	imageSubmitHandler = (images, isVideo) => {
		this.setState((prevState) => {
			return {
				...prevState,
				image: {
					...prevState.image,
					file:
						!isVideo && prevState.image.file
							? prevState.image.file.concat(images)
							: images,
					isLoading: true,
				},
			};
		});
		const config = {
			headers: {
				Authorization: 'bearer ' + this.props.token,
				'content-type': 'multipart/form-data',
			},
			onUploadProgress: (progressEvent) => {
				this.setState((prevState) => {
					return {
						...prevState,
						image: {
							...prevState.image,
							uploadProgress: Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							),
						},
					};
				});
			},
		};
		const formData = new FormData();
		if (isVideo) {
			let file = images[0];
			formData.append(`file`, file);
		} else {
			for (let i = 0; i < images.length; i++) {
				let file = images[i];
				formData.append(`files`, file);
			}
		}
		let url = '/posts/upload';
		if (isVideo) {
			url = '/posts/upload-video';
		}
		axios
			.post(url, formData, config)
			.then((response) => {
				if (!response) {
					toast('Something went wrong', {
						type: 'error',
						position: 'top-center',
					});
					return;
				}
				this.setState((prevState) => {
					let newArray = Array.isArray(
						response.data.data.filesArr
							? response.data.data.filesArr
							: response.data.data
					)
						? response.data.data.filesArr
							? response.data.data.filesArr.map((x) => x.path)
							: response.data.data.map((x) => x.path)
						: response.data.data.path;
					return {
						...prevState,
						image: {
							...prevState.image,
							path:
								!isVideo && prevState.image.path
									? prevState.image.path.concat(newArray)
									: newArray,
							isLoading: false,
							thumbnail: isVideo ? response.data.data[0].thumbnails[9] : null,
							uploadProgress: 0,
						},
					};
				});
			})
			.catch((err) => {
				console.log(err);
				this.setState((prevState) => {
					return {
						...prevState,
						image: {
							...prevState.image,
							file: null,
							path: '',
							isLoading: false,
							thumbnail: null,
							uploadProgress: 0,
						},
					};
				});
			});
		//this.props.postFile(this.props.token, image);
	};

	handleLike = (id) => {
		this.props.updateSwaggerFeed(this.props.feeds, id, this.props.nextPage);
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

	handleUpdatePost = (id, text) => {
		this.props.updatePostText(this.props.token, this.props.feeds, id, text);
	};

	handleDeletePost = (id) => {
		this.props.updatePostDelete(this.props.token, this.props.feeds, id);
	};

	handleSwaggerCommentDelete = (index, parentArray, array) => {
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

	handleSwaggerCommentEdit = (index, text, parentArray, array) => {
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

	handleImagePreviewDelete = (index) => {
		this.setState((prevState) => {
			let newFiles = prevState.image.file.filter(
				(singleFile, fileIndex) => fileIndex !== index
			);
			if (newFiles.length === 0) {
				newFiles = null;
			}
			let newPaths = prevState.image.path.filter(
				(singleImage, imageIndex) => imageIndex !== index
			);
			if (newPaths.length === 0) {
				newPaths = null;
			}
			return {
				...prevState,
				image: {
					...prevState.image,
					file: newFiles,
					path: newPaths,
				},
			};
		});
	};

	handleResetFiles = () => {
		this.setState({
			image: {
				file: null,
				path: '',
				isLoading: false,
			},
		});
	};

	render() {
		const loader = <HorizontalLoader key={Date.now()} />;
		const items = [];
		const settings = {
			dots: false,
			infinite: true,
			speed: 500,
			slidesToShow: 3,
			slidesToScroll: 3,
			autoplay: true,
			autoplaySpeed: 4000,
		};

		this.props.feeds.map((feed, index) => {
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
						resetFeed={this.props.resetFeed}
						onCommentDelete={this.handleSwaggerCommentDelete}
						onCommentEdit={this.handleSwaggerCommentEdit}
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
						resetFeed={this.props.resetFeed}
						onCommentDelete={this.handleSwaggerCommentDelete}
						onCommentEdit={this.handleSwaggerCommentEdit}
						onFollowClick={this.props.updateSwaggerFollow}
						boost={
							(feed.post_type === 'image' || feed.post_type === 'video') &&
							feed.posted_by === this.state.userId
						}
					/>
				);
			}
			if (index % 9 === 0 && index !== 0) {
				items.push(
					this.props.mostPopularFeed ? (
						<TextSlider
							key={index}
							settings={settings}
							posts={this.props.mostPopularFeed}
							onShowSlider={this.props.showSlider}
						/>
					) : null
				);
			}
		});

		return (
			<TimelineLayout>
				<div className="midleconarea">
					<NewPostArea
						token={this.props.token}
						user={this.props.user}
						onNewPostSubmit={this.submitHandler}
						onImageSubmit={this.imageSubmitHandler}
						image={this.state.image}
						isLoading={this.state.image.isLoading}
						onModeChange={this.handleResetFiles}
						onImagePreviewDelete={this.handleImagePreviewDelete}
						pageName="swagger"
					/>
					<InfiniteScroll
						pageStart={0}
						initialLoad={this.state.loadedFirstTime}
						loadMore={this.loadItems}
						hasMore={this.props.hasMorePage}
						// hasMore={true}
						loader={loader}
						// useWindow={true}
					>
						{items}
					</InfiniteScroll>
				</div>
			</TimelineLayout>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		token: state.auth.token,
		feeds: state.swaggerFeed.feed,
		nextPage: state.swaggerFeed.nextPage,
		hasMorePage: state.swaggerFeed.hasMorePage,
		isLoading: state.ui.isLoading,
		user: state.auth.user,
		mostPopularFeed: state.commonFeed.mostPopularFeed,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchFeed: (token, pageNumber) =>
			dispatch(fetchSwaggerFeed(token, pageNumber)),
		postFeed: (token, data) => dispatch(postFeed(token, data)),
		postLike: (token, id) => dispatch(postLike(token, id)),
		postCommentLike: (token, id) => dispatch(postCommentLike(token, id)),
		updateSwaggerFeed: (feeds, id) => dispatch(updateSwaggerFeed(feeds, id)),
		updateFeedCommentLike: (feeds, id, commentId) =>
			dispatch(updateSwaggerFeedCommentLike(feeds, id, commentId)),
		postComment: (token, comment, user, feeds) =>
			dispatch(postSwaggerComment(token, comment, user, feeds)),
		fetchMostPopular: (token) =>
			dispatch(fetchMostPopular(token, 'afroswagger')),
		updatePostText: (token, feeds, id, text) =>
			dispatch(updateSwaggerFeedPostText(token, feeds, id, text)),
		updatePostDelete: (token, feeds, id) =>
			dispatch(updateSwaggerFeedDelete(token, feeds, id)),
		commentManipulate: (token, feeds, id, commentId, comments, isEdit, text) =>
			dispatch(
				commentManipulateSwagger(
					token,
					feeds,
					id,
					commentId,
					comments,
					isEdit,
					text
				)
			),
		resetFeed: () => dispatch(resetSwaggerFeed()),
		showSlider: (selectedPost) => dispatch(showSlider(selectedPost)),
		updateSwaggerFollow: (id) => dispatch(updateSwaggerFollow(id)),
	};
};

export default withErrorHandler(
	connect(mapStateToProps, mapDispatchToProps)(Afroswagger),
	axios
);
