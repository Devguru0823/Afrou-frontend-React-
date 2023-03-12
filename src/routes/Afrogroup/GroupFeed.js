import React, {Component} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {connect} from 'react-redux';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import {
  fetchGroupFeed,
  postLike,
  updateGroupFeed,
  resetGroupFeed,
  postGroupComment,
  updateGroupFeedPostText,
  updateGroupFeedDelete,
  postGroupFeed,
  fetchGroupData,
  postGroupImage,
  updateGroupName,
  fetchInvitationList,
  postCommentLike,
  updateGroupFeedCommentLike,
  commentManipulateGroup,
  resetDetails,
  updateGroupFollow
} from '../../redux/actions';
import UserLayout from '../../hoc/UserDetail/UserDetail';
import NewsFeedPost from '../../components/NewsFeedPost/NewsFeedPost';
import NewPostArea from "../../components/NewPostArea/NewPostArea";
import NewsFeedPostShared from '../../components/NewsFeedPost/NewsFeedPostShared';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import EditGroup from './EditGroup';
import InviteList from './InviteList';
import GroupDetails from './GroupDetails';
import ProfileImageView from "../../components/ProfileInfoBox/ProfileImageView";
import AvatarEditor from '../../components/CustomAvatarEditor/CustomAvatarEditor';

class GroupFeed extends Component {
  state = {
    image: {
      file: null,
      path: '',
      isLoading: false,
      thumbnail: null,
      uploadProgress: 0
    },
    submitted: false,
    showEditPostForm: false,
    showInviteList: false,
    showViewer: false,
    showEditor: false,
    imageType: null,
    viewerUrl: '',
    isFriendListLoaded: false
  };

  static getDerivedStateFromProps(props, state) {
    if (state.submitted) {
      props.resetFeed();
      return {
        ...state,
        submitted: false
      }
    }
    if (props.groupDetails && !state.isFriendListLoaded && props.inviteList) {
      return {
        ...state,
        isFriendListLoaded: true
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.isFriendListLoaded && this.props.groupDetails && this.props.groupDetails.membership_status === "member") {
      this.props.fetchInvitationList(this.props.token, this.props.match.params.groupId);
    }
  }

  componentDidMount() {
    this.props.fetchGroupData(this.props.token, this.props.match.params.groupId);
  }

  componentWillUnmount() {
    this.props.resetProfileFeed();
    this.props.resetFeed();
  }

  loadItems = () => {
    if (!this.props.isLoading) {
      this.props.fetchFeed(
        this.props.token,
        this.props.nextPage === null ? 1 : this.props.nextPage,
        Number(this.props.match.params.groupId)
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
    const newComment = {post_id: id, ...comment};
    this.props.postComment(this.props.token, newComment, this.props.user, this.props.feeds);
  };

  handleUpdatePost = (id, text) => {
    this.props.updatePostText(this.props.token, this.props.feeds, id, text);
  };

  handleDeletePost = id => {
    this.props.updatePostDelete(this.props.token, this.props.feeds, id)
  };

  submitHandler = (data, mode) => {
    let newData = {...data};
    if (this.state.image.path) {
      newData = {...data, post_image: this.state.image.path, post_type: 'image'};
      if (mode === 'video') {
        newData = {
          ...data, post_video: this.state.image.path[0], post_type: mode, thumbnail: this.state.image.thumbnail
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
    this.props.postFeed(this.props.token, newData, this.props.match.params.groupId);
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

  handleGroupImageUpload = type => {
    this.setState({showEditor: true, imageType: type});
  };

  handleCoverUpload = (file, type) => {
    this.props.updateImage(this.props.token, file, this.props.match.params.groupId, type);
  };

  handleUpdateGroupImage = blob => {
    this.props.updateImage(this.props.token, blob, this.props.match.params.groupId, this.state.imageType);
    this.setState({showEditor: false, imageType: null});
  };

  handleCloseImageBox = () => {
    this.setState({showEditor: false, imageType: null});
  };

  handleEditName = () => {
    this.setState({showEditPostForm: true});
  };

  handleAddMember = () => {
    this.setState({showInviteList: true})
  };

  handleRequestButtonClicked = url => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };

    axios.get(url, config)
      .then(() => {
        this.props.fetchInvitationList(this.props.token, this.props.match.params.groupId);
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleAcceptInvite = (groupId, type) => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };
    let url = `groups/join/${groupId}`;
    if (type === 'leave') {
      url = `groups/leave/${groupId}`;
    }
    if (type === 'accept') {
      url = `groups/accept/${groupId}`;
    }

    axios.get(url, config)
      .then(() => {
        this.props.fetchGroupData(this.props.token, this.props.match.params.groupId);
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleGroupCommentDelete = (index, parentArray, array) => {
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

  handleGroupCommentEdit = (index, text, parentArray, array) => {
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

  handleResetFiles = () => {
    this.setState({
      image: {
        file: null,
        path: '',
        isLoading: false
      }
    })
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

  handleCloseViewBox = () => {
    this.setState({showViewer: false, viewerUrl: ''});
  };

  handleOpenViewBox = url => {
    this.setState({showViewer: true, viewerUrl: url});
  };

  render() {
    const loader = <HorizontalLoader key={Date.now()}/>;

    const items = [];
    this.props.feeds.map(feed => {
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
            onCommentDelete={this.handleGroupCommentDelete}
            onCommentEdit={this.handleGroupCommentEdit}
            isGroupAdmin={this.props.groupDetails.admin}
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
            onCommentDelete={this.handleGroupCommentDelete}
            onCommentEdit={this.handleGroupCommentEdit}
            isGroupAdmin={this.props.groupDetails.admin}
            onFollowClick={this.props.updateSwaggerFollow}
          />
        );
      }
    });

    return (
      <UserLayout>
        <div className="midleconarea">
          {
            this.state.showEditPostForm ?
              <EditGroup
                onClose={() => this.setState({showEditPostForm: false})}
                data={this.props.groupDetails}
                updatePost={(data) => this.props.updateGroupName(this.props.token, this.props.match.params.groupId, data)}
              /> : null
          }
          {
            this.state.showInviteList ?
              <InviteList
                onClose={() => this.setState({showInviteList: false})}
                friends={this.props.inviteList}
                onRequestButtonClicked={this.handleRequestButtonClicked}
              /> : null
          }
          <AvatarEditor
            visible={this.state.showEditor}
            closeImageBox={this.handleCloseImageBox}
            token={this.props.token}
            onImageUpload={this.handleUpdateGroupImage}
          />
          {
            this.state.showViewer ?
              <ProfileImageView
                closeImageBox={this.handleCloseViewBox}
                imageUrl={this.state.viewerUrl}
              /> :
              null
          }
          <GroupDetails
            isLoading={this.props.isLoading}
            groupDetails={this.props.groupDetails}
            onUploadCover={this.handleCoverUpload}
            onUpload={this.handleGroupImageUpload}
            onEditNameClicked={this.handleEditName}
            onAddMemberClicked={this.handleAddMember}
            onAcceptInvitationClicked={this.handleAcceptInvite}
            onOpenViewBox={this.handleOpenViewBox}
          />
          {
            this.props.groupDetails && this.props.groupDetails.membership_status === 'member' ?
              <div>
                <div className="clearfix"/>
                <NewPostArea
                  token={this.props.token}
                  user={this.props.user}
                  onNewPostSubmit={this.submitHandler}
                  onImageSubmit={this.imageSubmitHandler}
                  image={this.state.image}
                  isLoading={this.state.image.isLoading}
                  onModeChange={this.handleResetFiles}
                  onImagePreviewDelete={this.handleImagePreviewDelete}
                />
                <InfiniteScroll
                  pageStart={0}
                  loadMore={this.loadItems}
                  hasMore={this.props.hasMorePage}
                  loader={loader}>
                  {items}
                </InfiniteScroll>
              </div> : null
          }
        </div>
      </UserLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    feeds: state.group.feed,
    nextPage: state.group.nextPage,
    hasMorePage: state.group.hasMorePage,
    profileDetails: state.group.profileDetails,
    isLoading: state.ui.isLoading,
    user: state.auth.user,
    groupDetails: state.group.groupDetail,
    inviteList: state.group.inviteList
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFeed: (token, pageNumber, profileId) => dispatch(fetchGroupFeed(token, pageNumber, profileId)),
    postFeed: (token, data, id) => dispatch(postGroupFeed(token, data, id)),
    postLike: (token, id) => dispatch(postLike(token, id)),
    postCommentLike: (token, id) => dispatch(postCommentLike(token, id)),
    updateProfileFeed: (feeds, id) => dispatch(updateGroupFeed(feeds, id)),
    resetProfileFeed: () => dispatch(resetDetails()),
    postComment: (token, comment, user, feeds) => dispatch(postGroupComment(token, comment, user, feeds)),
    updatePostText: (token, feeds, id, text) => dispatch(updateGroupFeedPostText(token, feeds, id, text)),
    updatePostDelete: (token, feeds, id) => dispatch(updateGroupFeedDelete(token, feeds, id)),
    resetFeed: () => dispatch(resetGroupFeed()),
    fetchGroupData: (token, id) => dispatch(fetchGroupData(token, id)),
    updateImage: (token, file, id, type) => dispatch(postGroupImage(token, file, id, type)),
    updateFeedCommentLike: (feeds, id, commentId) => dispatch(updateGroupFeedCommentLike(feeds, id, commentId)),
    updateGroupName: (token, id, data) => dispatch(updateGroupName(token, id, data)),
    fetchInvitationList: (token, id) => dispatch(fetchInvitationList(token, id)),
    commentManipulate: (token, feeds, id, commentId, comments, isEdit, text) =>
      dispatch(commentManipulateGroup(token, feeds, id, commentId, comments, isEdit, text)),
    updateSwaggerFollow: id => dispatch(updateGroupFollow(id))
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(GroupFeed), axios);
