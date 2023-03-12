import React, {Component} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {connect} from 'react-redux';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import HashDetailLayout from '../../hoc/HashTagDetail/HashTagDetail';
import NewsFeedPost from '../../components/NewsFeedPost/NewsFeedPost';
import NewsFeedPostShared from '../../components/NewsFeedPost/NewsFeedPostShared';
import NewPostArea from '../../components/NewPostArea/NewPostArea';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import TextSlider from '../../components/TextSlider/TextSlider';
import ProfileImageView from "../../components/ProfileInfoBox/ProfileImageView";
import HashDetailsInfo from './HashDetailsInfo';
import {
  fetchHashFeed,
  postFeed,
  postLike,
  updateHashFeed,
  postHashComment,
  fetchMostPopular,
  updateHashFeedPostText,
  updateHashFeedDelete,
  resetHashFeed,
  updateHashFeedCommentLike,
  postCommentLike,
  commentManipulateHash,
  fetchHashtagDetails,
  resetHashTagDetails,
  showSlider,
  updateHashtagFollow
} from '../../redux/actions';

class HashDetails extends Component {
  state = {
    image: {
      file: null,
      path: '',
      isLoading: false,
      thumbnail: null,
      uploadProgress: 0
    },
    submitted: false,
    showViewer: false,
    viewerUrl: ''
  };

  static getDerivedStateFromProps(props, state) {
    if (state.submitted) {
      props.resetFeed();
      return {
        ...state,
        submitted: false
      }
    } else {
      return null;
    }
  }

  componentDidMount() {
    this.props.fetchMostPopular(this.props.token);
    this.props.fetchHashtagDetails(this.props.token, this.props.match.params.details)
  }

  componentWillUnmount() {
    this.props.resetFeed();
    this.props.resetHashTagDetails();
  }

  loadItems = () => {
    if (!this.props.isLoading) {
      this.props.fetchFeed(
        this.props.token,
        this.props.nextPage === null ? 1 : this.props.nextPage,
        this.props.match ? this.props.match.params.details : 'afroswagger'
      );
    }
  };

  submitHandler = (data, mode) => {
    let newData = {...data, posted_for: 'hashtag'};
    if (this.state.image.path) {
      newData = {...data, post_image: this.state.image.path, post_type: 'image', posted_for: 'hashtag'};
      if (mode === 'video') {
        newData = {
          ...data, post_video: this.state.image.path[0],
          post_type: mode, thumbnail: this.state.image.thumbnail,
          posted_for: 'hashtag'
        };
      }
      this.setState(prevState => {
        return {
          ...prevState,
          image: {
            file: null,
            path: '',
            thumbnail: null
          },
        }
      })
    }
    this.props.postFeed(this.props.token, newData);
    this.setState({submitted: true})
  };

  imageSubmitHandler = (images, isVideo) => {
    this.setState(prevState => {
      return {
        ...prevState,
        image: {
          ...prevState.image,
          file: !isVideo && prevState.image.file ? prevState.image.file.concat(images) : images,
          isLoading: true
        }
      }
    });
    const config = {
      headers: {
        'Authorization': "bearer " + this.props.token,
        'content-type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        this.setState(prevState => {
          return {
            ...prevState,
            image: {
              ...prevState.image,
              uploadProgress: Math.round((progressEvent.loaded * 100) / progressEvent.total)
            }
          }
        })
      }
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
      url = '/posts/upload-video'
    }
    axios.post(url, formData, config)
      .then(response => {
        this.setState(prevState => {
          let newArray = Array.isArray(response.data.data) ?
            response.data.data.map(x => x.path) : response.data.data.path;
          return {
            ...prevState,
            image: {
              ...prevState.image,
              path: !isVideo && prevState.image.path ? prevState.image.path.concat(newArray) : newArray,
              isLoading: false,
              thumbnail: isVideo ? response.data.data[0].thumbnails[9] : null,
              uploadProgress: 0,
            }
          }
        });
        console.log(response);
      })
      .catch(err => {
        console.log(err);
        this.setState(prevState => {
          return {
            ...prevState,
            image: {
              ...prevState.image,
              file: null,
              path: '',
              isLoading: false,
              thumbnail: null,
              uploadProgress: 0
            }
          }
        });
      });
    //this.props.postFile(this.props.token, image);
  };

  handleLike = (id) => {
    this.props.updateHashFeed(this.props.feeds, id, this.props.nextPage);
    this.props.postLike(this.props.token, id);
  };

  handleCommentLike = (id, commentId) => {
    this.props.updateFeedCommentLike(this.props.feeds, id, commentId);
    this.props.postCommentLike(this.props.token, commentId);
  };

  handleComment = (id, comment) => {
    const newComment = {post_id: id, ...comment};
    this.props.postComment(this.props.token, newComment, this.props.user, this.props.feeds);
  };

  handleUpdatePost = (id, text) => {
    this.props.updatePostText(this.props.token, this.props.feeds, id, text);
  };

  handleDeletePost = id => {
    this.props.updatePostDelete(this.props.token, this.props.feeds, id)
  };

  handleHashCommentDelete = (index, parentArray, array) => {
    let parentIndex = index;
    let childIndex = null;
    const newArray = [...parentArray];
    if (array) {
      childIndex = index;
      parentIndex = parentArray.findIndex(element => array[index].comment_parent_id === element.comment_id);
      const childComments = [...newArray[parentIndex].sub_comments];
      const deleted = childComments.splice(childIndex, 1);
      newArray[parentIndex].sub_comments = childComments;
      const postId = deleted[0].post_id;
      const commentId = deleted[0].comment_id;
      this.props.commentManipulate(this.props.token, this.props.feeds, postId, commentId, newArray)
    } else {
      const deleted = newArray.splice(parentIndex, 1);
      const postId = deleted[0].post_id;
      const commentId = deleted[0].comment_id;
      this.props.commentManipulate(this.props.token, this.props.feeds, postId, commentId, newArray)
    }
  };

  handleHashCommentEdit = (index, text, parentArray, array) => {
    let parentIndex = index;
    let childIndex = null;
    const newArray = [...parentArray];
    if (array) {
      childIndex = index;
      parentIndex = parentArray.findIndex(element => array[index].comment_parent_id === element.comment_id);
      const childComments = [...newArray[parentIndex].sub_comments];
      childComments[childIndex].comment_text = text.comment_text;
      newArray[parentIndex].sub_comments = childComments;
      this.props.commentManipulate(
        this.props.token,
        this.props.feeds,
        childComments[childIndex].post_id,
        childComments[childIndex].comment_id,
        newArray, 'edit', text
      )
    } else {
      newArray[parentIndex].comment_text = text.comment_text;
      this.props.commentManipulate(
        this.props.token,
        this.props.feeds,
        newArray[parentIndex].post_id,
        newArray[parentIndex].comment_id,
        newArray, 'edit', text
      )
    }
  };

  handleImagePreviewDelete = index => {
    this.setState(prevState => {
      let newFiles = prevState.image.file.filter((singleFile, fileIndex) => fileIndex !== index);
      if (newFiles.length === 0) {
        newFiles = null
      }
      let newPaths = prevState.image.path.filter((singleImage, imageIndex) => imageIndex !== index);
      if (newPaths.length === 0) {
        newPaths = null;
      }
      return {
        ...prevState,
        image: {
          ...prevState.image,
          file: newFiles,
          path: newPaths,
        }
      }
    });
  };

  handleResetFiles = () => {
    this.setState({
      image: {
        file: null,
        path: '',
        isLoading: false
      }
    })
  };

  handleCloseViewBox = () => {
    this.setState({showViewer: false, viewerUrl: ''});
  };

  handleOpenViewBox = url => {
    this.setState({showViewer: true, viewerUrl: url});
  };

  render() {
    const loader = <HorizontalLoader key={Date.now()}/>;
    const items = [];
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
    };
    const {hashtagDetails} = this.props;

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
            onCommentDelete={this.handleHashCommentDelete}
            onCommentEdit={this.handleHashCommentEdit}
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
            onCommentDelete={this.handleHashCommentDelete}
            onCommentEdit={this.handleHashCommentEdit}
            onFollowClick={this.props.updateSwaggerFollow}
          />
        );
      }
      if (index % 9 === 0 && index !== 0) {
        items.push(
          this.props.mostPopularFeed
            ? (
              <TextSlider
                key={index}
                settings={settings}
                posts={this.props.mostPopularFeed}
                onShowSlider={this.props.showSlider}
              />
            )
            : null
        );
      }
    });

    return (
      <HashDetailLayout>
        <div className="midleconarea">
          <div className="insiderarea marbtm20">
            {
              this.state.showViewer ?
                <ProfileImageView
                  closeImageBox={this.handleCloseViewBox}
                  imageUrl={this.state.viewerUrl}
                /> :
                null
            }
            <HashDetailsInfo
              isLoading={this.props.isLoading}
              profileDetails={this.props.hashtagDetails}
              onOpenViewBox={this.handleOpenViewBox}
            />
            <div className="row">
              <div className="col-md-9 otfrdata">
                {
                  hashtagDetails
                    ? <h6>#{hashtagDetails.hashtag_slug}</h6>
                    : <h6>Loading...</h6>
                }
                {
                  hashtagDetails
                    ? (
                      <div>
                        <span>Followers : {
                          hashtagDetails.followers ? hashtagDetails.followers.length : 0
                        }
                        </span>
                      </div>
                    )
                    : (
                      (
                        <div>
                          <span>Followers : Loading...</span>
                        </div>
                      )
                    )
                }
              </div>
            </div>
          </div>
          <NewPostArea
            token={this.props.token}
            user={this.props.user}
            onNewPostSubmit={this.submitHandler}
            onImageSubmit={this.imageSubmitHandler}
            image={this.state.image}
            isLoading={this.state.image.isLoading}
            onModeChange={this.handleResetFiles}
            onImagePreviewDelete={this.handleImagePreviewDelete}
            pageName="hashtag"
            hashDetails={this.props.match.params.details}
          />
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadItems}
            hasMore={this.props.hasMorePage}
            loader={loader}>
            {items}
          </InfiniteScroll>
        </div>
      </HashDetailLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    feeds: state.hashFeed.feed,
    nextPage: state.hashFeed.nextPage,
    hasMorePage: state.hashFeed.hasMorePage,
    isLoading: state.ui.isLoading,
    user: state.auth.user,
    mostPopularFeed: state.commonFeed.mostPopularFeed,
    hashtagDetails: state.hash.hashtagDetails
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFeed: (token, pageNumber, hashName) => dispatch(fetchHashFeed(token, pageNumber, hashName)),
    postFeed: (token, data) => dispatch(postFeed(token, data)),
    postLike: (token, id) => dispatch(postLike(token, id)),
    postCommentLike: (token, id) => dispatch(postCommentLike(token, id)),
    updateHashFeed: (feeds, id) => dispatch(updateHashFeed(feeds, id)),
    updateFeedCommentLike: (feeds, id, commentId) => dispatch(updateHashFeedCommentLike(feeds, id, commentId)),
    postComment: (token, comment, user, feeds) => dispatch(postHashComment(token, comment, user, feeds)),
    fetchMostPopular: token => dispatch(fetchMostPopular(token, 'afroswagger')),
    updatePostText: (token, feeds, id, text) => dispatch(updateHashFeedPostText(token, feeds, id, text)),
    updatePostDelete: (token, feeds, id) => dispatch(updateHashFeedDelete(token, feeds, id)),
    commentManipulate: (token, feeds, id, commentId, comments, isEdit, text) =>
      dispatch(commentManipulateHash(token, feeds, id, commentId, comments, isEdit, text)),
    resetFeed: () => dispatch(resetHashFeed()),
    fetchHashtagDetails: (token, name) => dispatch(fetchHashtagDetails(token, name)),
    resetHashTagDetails: () => dispatch(resetHashTagDetails()),
    showSlider: selectedPost => dispatch(showSlider(selectedPost)),
    updateSwaggerFollow: id => dispatch(updateHashtagFollow(id))
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(HashDetails), axios);
