import React, {Component} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {connect} from 'react-redux';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import UserLayout from '../../hoc/UserDetail/UserDetail';
import NewsFeedPost from '../../components/NewsFeedPost/NewsFeedPost';
import NewPostArea from '../../components/NewPostArea/NewPostArea';
import NewsFeedPostShared from '../../components/NewsFeedPost/NewsFeedPostShared';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import TextSlider from "../../components/TextSlider/TextSlider";
import {
  fetchTalentFeed,
  postFeed,
  postLike,
  postTalentComment,
  updateTalentFeed,
  fetchMostPopular,
  updateTalentFeedPostText,
  updateTalentFeedDelete,
  resetTalentFeed,
  postCommentLike,
  updateTalentFeedCommentLike,
  commentManipulateTalent,
  showSlider,
  updateTalentFollow
} from '../../redux/actions';

class Afrotalent extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();   // Create a ref object

    this.state = {
      image: {
        file: null,
        path: '',
        isLoading: false,
        thumbnail: null,
        uploadProgress: 0
      },
      submitted: false
    };
  }

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
  }

  componentWillUnmount() {
    this.props.resetFeed();
  }

  loadItems = () => {
    if (!this.props.isLoading) {
      this.props.fetchFeed(this.props.token, this.props.nextPage === null ? 1 : this.props.nextPage);
    }
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
        let newArray = Array.isArray(response.data.data) ?
          response.data.data.map(x => x.path) : response.data.data.path;
        this.setState(prevState => {
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
              uploadProgress: 0,
            }
          }
        });
      });
    //this.props.postFile(this.props.token, image);
  };

  handleLike = (id) => {
    this.props.updateTalentFeed(this.props.feeds, id, this.props.nextPage);
    this.props.postLike(this.props.token, id);
  };

  handleCommentLike = (id, commentId) => {
    this.props.updateFeedCommentLike(this.props.feeds, id, commentId);
    this.props.postCommentLike(this.props.token, commentId);
  };

  submitHandler = (data, mode) => {
    let newData = {...data, posted_for: 'afrotalent'};
    if (this.state.image.path) {
      newData = {...data, post_image: this.state.image.path, post_type: 'image', posted_for: 'afrotalent'};
      if (mode === 'video') {
        newData = {
          ...data, post_video: this.state.image.path[0],
          post_type: mode, posted_for: 'afrotalent',
          thumbnail: this.state.image.thumbnail
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
    this.myRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    this.setState({submitted: true})
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

  handleTalentCommentDelete = (index, parentArray, array) => {
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

  handleTalentCommentEdit = (index, text, parentArray, array) => {
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

  render() {
    const loader = <HorizontalLoader key={Date.now()}/>;
    const items = [];
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 2,
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
            resetFeed={this.props.resetFeed}
            onCommentDelete={this.handleTalentCommentDelete}
            onCommentEdit={this.handleTalentCommentEdit}
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
      <UserLayout>
        <div className="midleconarea" ref={this.myRef}>
          <NewPostArea
            token={this.props.token}
            user={this.props.user}
            onNewPostSubmit={this.submitHandler}
            onImageSubmit={this.imageSubmitHandler}
            image={this.state.image}
            isLoading={this.state.image.isLoading}
            onModeChange={this.handleResetFiles}
            onImagePreviewDelete={this.handleImagePreviewDelete}
            pageName="talent"
          />
          {
            this.props.mostPopularFeed
              ? (
                <TextSlider
                  settings={settings}
                  posts={this.props.mostPopularFeed}
                  onShowSlider={this.props.showSlider}
                />
              )
              : null
          }
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadItems}
            hasMore={this.props.hasMorePage}
            loader={loader}>
            {items}
          </InfiniteScroll>
        </div>
      </UserLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    feeds: state.talentFeed.feed,
    nextPage: state.talentFeed.nextPage,
    hasMorePage: state.talentFeed.hasMorePage,
    isLoading: state.ui.isLoading,
    user: state.auth.user,
    mostPopularFeed: state.commonFeed.mostPopularFeed
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFeed: (token, pageNumber) => dispatch(fetchTalentFeed(token, pageNumber)),
    postFeed: (token, data) => dispatch(postFeed(token, data)),
    postLike: (token, id) => dispatch(postLike(token, id)),
    postCommentLike: (token, id) => dispatch(postCommentLike(token, id)),
    updateTalentFeed: (feeds, id) => dispatch(updateTalentFeed(feeds, id)),
    postComment: (token, comment, user, feeds) => dispatch(postTalentComment(token, comment, user, feeds)),
    fetchMostPopular: token => dispatch(fetchMostPopular(token, 'afrotalent')),
    updateFeedCommentLike: (feeds, id, commentId) => dispatch(updateTalentFeedCommentLike(feeds, id, commentId)),
    updatePostText: (token, feeds, id, text) => dispatch(updateTalentFeedPostText(token, feeds, id, text)),
    updatePostDelete: (token, feeds, id) => dispatch(updateTalentFeedDelete(token, feeds, id)),
    commentManipulate: (token, feeds, id, commentId, comments, isEdit, text) =>
      dispatch(commentManipulateTalent(token, feeds, id, commentId, comments, isEdit, text)),
    resetFeed: () => dispatch(resetTalentFeed()),
    showSlider: selectedPost => dispatch(showSlider(selectedPost)),
    updateSwaggerFollow: id => dispatch(updateTalentFollow(id))
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(Afrotalent), axios);
