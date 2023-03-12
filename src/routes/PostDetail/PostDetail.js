import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';

import withErrorHandler from '../../utils/withErrorHandler';
import UserLayout from "../../hoc/UserDetail/UserDetail";
import NewsFeedPost from "../../components/NewsFeedPost/NewsFeedPost";
import NewsFeedPostShared from "../../components/NewsFeedPost/NewsFeedPostShared";
import {
  fetchPostDetails,
  postLike,
  postComment,
  updatePostDetailText,
  postCommentLike,
  commentManipulatePostDetail,
  resetPostDetail
} from '../../redux/actions';
import axios from "../../utils/axiosConfig";
import {toastOptions} from "../../constants/toastOptions";
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';

class PostDetail extends Component {
  state = {
    posted: false
  };

  static getDerivedStateFromProps(props, state) {
    if (state.posted && !props.isLoading) {
      return {
        ...state,
        posted: false
      }
    }
    return null
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    //console.log(this.props.isLoading, prevProps.isLoading);
    if (prevState.posted && !this.props.isLoading) {
      this.props.fetchDetails(this.props.token, this.props.match.params.postId)
    }
  };

  componentDidMount() {
    this.props.fetchDetails(this.props.token, this.props.match.params.postId)
  }

  componentWillUnmount() {
    this.props.resetPostDetail()
  }

  handleLike = (id) => {
    this.props.postLike(this.props.token, id);
    this.setState({posted: true});
  };

  handleCommentLike = (id, commentId) => {
    this.props.postCommentLike(this.props.token, commentId);
    this.setState({posted: true});
  };

  handleComment = (id, comment) => {
    const newComment = {post_id: id, ...comment};
    this.props.postComment(this.props.token, newComment, this.props.user, this.props.feeds);
    this.setState({posted: true});
  };

  handleUpdatePost = (id, text) => {
    this.props.updatePostText(this.props.token, id, text);
  };

  handleDeletePost = id => {
    const config = {
      headers: {
        'Authorization': "bearer " + this.props.token
      }
    };
    axios.delete(`/posts/${id}`, config)
      .then(response => {
        console.log(response);
        this.props.history.push('/afroswagger');
      })
      .catch(err => {
        console.log(err);
      });
  };

  handlePostDetailCommentDelete = (index, parentArray, array) => {
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

  handlePostDetailCommentEdit = (index, text, parentArray, array) => {
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

  render() {
    const {postDetail} = this.props;

    return (
      <UserLayout>
        <div className="midleconarea">
          {
            postDetail ?
              postDetail.post_type === 'shared' ?
                <NewsFeedPostShared
                  isPostDetail={!!this.props.match.params.postId}
                  userId={this.props.user.user_id}
                  feedDetails={postDetail}
                  profileImage={this.props.user.profile_image_url}
                  token={this.props.token}
                  resetFeed={() => {
                  }}
                  updatePost={this.handleUpdatePost}
                  postLike={this.handleLike}
                  postCommentLike={this.handleCommentLike}
                  postComment={this.handleComment}
                  updateDelete={this.handleDeletePost}
                  onCommentDelete={this.handlePostDetailCommentDelete}
                  onCommentEdit={this.handlePostDetailCommentEdit}
                  isGroupAdmin={postDetail.group_admin}
                /> :
                <NewsFeedPost
                  isPostDetail={!!this.props.match.params.postId}
                  userId={this.props.user.user_id}
                  feedDetails={postDetail}
                  profileImage={this.props.user.profile_image_url}
                  token={this.props.token}
                  resetFeed={() => toast.success('Post shared successfully', toastOptions)}
                  updatePost={this.handleUpdatePost}
                  postLike={this.handleLike}
                  postCommentLike={this.handleCommentLike}
                  postComment={this.handleComment}
                  updateDelete={this.handleDeletePost}
                  onCommentDelete={this.handlePostDetailCommentDelete}
                  onCommentEdit={this.handlePostDetailCommentEdit}
                  isGroupAdmin={postDetail.group_admin}
                /> :
              <HorizontalLoader/>
          }
        </div>
      </UserLayout>
    )
  }
}

const mapStateToProps = state => {
  return {
    postDetail: state.commonFeed.details,
    token: state.auth.token,
    user: state.auth.user,
    isLoading: state.ui.isLoading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchDetails: (token, id) => dispatch(fetchPostDetails(token, id)),
    postComment: (token, comment) => dispatch(postComment(token, comment)),
    postLike: (token, id) => dispatch(postLike(token, id)),
    postCommentLike: (token, id) => dispatch(postCommentLike(token, id)),
    updatePostText: (token, id, text) => dispatch(updatePostDetailText(token, id, text)),
    commentManipulate: (token, feeds, id, commentId, comments, isEdit, text) =>
      dispatch(commentManipulatePostDetail(token, feeds, id, commentId, comments, isEdit, text)),
    resetPostDetail: () => dispatch(resetPostDetail()),
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(PostDetail), axios);