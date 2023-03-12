import React from 'react';
import {connect} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';

import './PostModal.css';
import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import {
  commentManipulatePostDetail,
  fetchPostDetails,
  postComment,
  postCommentLike,
  postLike, resetPostDetail,
  updatePostDetailText
} from "../../redux/actions";
import NewsFeedPostShared from "../NewsFeedPost/NewsFeedPostShared";
import NewsFeedPost from "../NewsFeedPost/NewsFeedPost";
import {toast} from "react-toastify";
import {toastOptions} from "../../constants/toastOptions";
import HorizontalLoader from "../Loders/HorizontalLoder/HorizontalLoader";

class PostModal extends React.Component {
  state = {
    posted: false,
    selectedPostIndex: 0,
  };

  componentDidMount() {
    document.body.classList.add("newpopup");
    this.props.fetchDetails(this.props.token, this.props.mostPopularFeed[this.props.selectedPost].post_id);
  }

  componentWillUnmount() {
    document.body.classList.remove("newpopup");
    this.props.resetPostDetail();
  }

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
      this.props.fetchDetails(this.props.token, this.props.mostPopularFeed[0].post_id)
    }
  };

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

  onNextButtonClick = () => {
    this.setState(prevState => {
      const newIndex = prevState.selectedPostIndex === this.props.mostPopularFeed.length - 1
        ? 0
        : prevState.selectedPostIndex + 1;

      this.props.fetchDetails(this.props.token, this.props.mostPopularFeed[newIndex].post_id);

      return {
        ...prevState,
        selectedPostIndex: newIndex
      }
    });
  };

  onPreviousButtonClick = () => {
    this.setState(prevState => {
      const newIndex = prevState.selectedPostIndex === 0
        ? this.props.mostPopularFeed.length - 1
        : prevState.selectedPostIndex - 1;

      this.props.fetchDetails(this.props.token, this.props.mostPopularFeed[newIndex].post_id);

      return {
        ...prevState,
        selectedPostIndex: newIndex
      }
    });
  };

  render() {
    const {onHideSlider, postDetail} = this.props;

    return (
      <div className="onmstporlrr">
        <i
          className="fa fa-chevron-circle-left leftButton"
          style={{cursor: 'pointer'}}
          aria-hidden="true"
          onClick={this.onPreviousButtonClick}
        />
        <i
          className="fa fa-chevron-circle-right rightButton"
          style={{cursor: 'pointer'}}
          aria-hidden="true"
          onClick={this.onNextButtonClick}
        />
        <Scrollbars
          style={styles.modal}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
        >
          <div className="awhitebg msrcpop">
            <div className="formpageaspcl">
				<div className="onefixedhearre">
					  <h6>
						Popular Posts
					  </h6>
					  <p className="mstpopclose"
						style={{...styles.headingRight, cursor: 'pointer'}}
						onClick={() => onHideSlider()}
					  >
						<i className="fa fa-times" aria-hidden="true"></i>
					  </p>
				</div>
              {
                postDetail ?
                  postDetail.post_type === 'shared' ?
                    <NewsFeedPostShared
                      isPostDetail={false}
                      isPostModal={true}
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
                      isPostDetail={false}
                      isPostModal={true}
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
          </div>
          <div/>
          <div/>
        </Scrollbars>
      </div>
    );
  }
}

const styles = {
  modal: {
    position: 'fixed',
    top: '80px',
    width: '98%',
    left: 'calc(50% - 49%)',
    border: '1px solid #000',
    zIndex: 99999,
    backgroundColor: '#fff',
    textAlign: 'left',
    display: 'block',
    maxHeight: '580px',
    overflow: 'hidden',
    borderRadius: '7px'
  },
  headingLeft: {
    display: 'inline-block',
  },
  headingRight: {
    display: 'inline-block',
    float: 'right'
  },
  selectPageHeight: {
    height: '400px'
  }
};

const mapStateToProps = state => {
  return {
    postDetail: state.commonFeed.details,
    token: state.auth.token,
    user: state.auth.user,
    isLoading: state.ui.isLoading,
    selectedPost: state.ui.selectedPost,
    mostPopularFeed: state.commonFeed.mostPopularFeed
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

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(PostModal), axios);