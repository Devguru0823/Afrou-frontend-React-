import React, {Component} from 'react';
import {BASE_URL} from "../../constants/ImageUrls";
import {Link} from "react-router-dom";
import CommentBox from "../../components/CommentBox/CommentBox";
import {SIZE_300} from "../../constants/imageSizes";

class CommentItem extends Component {
  state = {
    commentBoxVisible: false,
    isCommentReply: false,
    commentId: null,
    editData: {}
  };

  handleComment = comment => {
    if (this.state.editData.commentParentArray) {
      this.props.onCommentEdit(
        this.state.editData.index,
        comment,
        this.state.editData.commentParentArray,
        this.state.editData.commentArray
      )
    } else {
      this.props.postComment(this.props.post_id, comment);
    }
    this.setState({commentBoxVisible: false, commentText: '', editData: {}});
  };

  handleCommentEdit = (index, text, commentParentArray, commentArray) => {
    this.setState({
      commentBoxVisible: true,
      editData: {
        index: index,
        text: text,
        commentParentArray: commentParentArray,
        commentArray: commentArray,
      }
    });

  };

  handleMentionsInText = text => {
    const pattern = /@[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]* -/g;
    const matchedArr = text.match(pattern);

    if (!matchedArr) {
      return text;
    }

    let finalArr = [];
    let finalString = '';
    matchedArr.forEach(str => {
      let tmpName = str.match(/(?:@)(.+)(?: -)/)[1];
      finalArr.push(tmpName)
    });

    finalArr.forEach(name => {
      finalString = text.replace("@" + name + " -", "<span class='comment-mention'>@" + name + "</span>")
    });
    return finalString;
  };

  render() {
    const {comment, userData, post_id, index, commentParentArray} = this.props;
    this.parentCommentId = comment.comment_id;
    return (
      <li>
        <div ref={(ref) => this.myRef = ref}>
          <CommentBox
            commentId={this.state.isCommentReply ? this.state.commentId : ''}
            visible={this.state.commentBoxVisible}
            onNewCommentSubmit={this.handleComment}
            value={this.state.editData.text}
          />
        </div>
        <div className="leftimg"><a href="#"><img src={`${BASE_URL}${userData.profile_image_url}${SIZE_300}`}
                                                  alt="image"/></a></div>
        <div className="whatiscomment">
          <div className="comment-user-content">
            <div className="usrname"><Link
              to={`/profile/${userData.user_id}`}>{`${userData.first_name} ${userData.last_name}`}</Link>
            </div>
            <p
              className="comment-item"
              dangerouslySetInnerHTML={{__html: this.handleMentionsInText(comment.comment_text)}}
            />
            {
              comment.my_comment ?
                <div className="comment-user-editdelete">
                <span
                  className="comment-edit"
                  onClick={() =>
                    this.handleCommentEdit(index, comment.comment_text, commentParentArray)}>
                  <i className="fa fa-pencil" aria-hidden="true"/>
                </span>
                  <span
                    className="comment-delete"
                    onClick={() => this.props.onCommentDelete(index, commentParentArray)}>
                  <i className="fa fa-times" aria-hidden="true"/>
                </span>
                </div> : null
            }
          </div>
          <div className="comment-user-likereply">
            <span style={{paddingLeft: '0px'}}>
          <a
            style={{cursor: 'pointer'}}
            onClick={() => this.props.postCommentLike(post_id, comment.comment_id)}
          >
            {comment.liked === true ? 'Unlike' : 'Like'}
          </a>
        </span>.
            <span>
          <a style={{cursor: 'pointer'}} onClick={() => {
            window.scrollTo(0, this.myRef.offsetTop);
            this.setState(prevState => ({
              ...prevState,
              commentBoxVisible: true,
              isCommentReply: true,
              commentId: comment.comment_id,
              editData: {
                ...prevState.editData,
                text: `@${userData.first_name} ${userData.last_name} - `
              }
            }))
          }}
          >Reply</a>
        </span>
          </div>
        </div>
        {
          comment.sub_comments && (comment.sub_comments.length !== 0) ?
            <div className="postcomments">
              <ul>
                {
                  comment.sub_comments.map((comment, index, commentArray) => {
                    const userData = comment.commented_by;
                    return (
                      <li key={comment._id}>
                        <div className="leftimg"><a href="#"><img
                          src={`${BASE_URL}${userData.profile_image_url}${SIZE_300}`}
                          alt="image"/></a></div>
                        <div className="whatiscomment">
                          <div className="comment-user-content">
                            <div className="usrname"><Link
                              to={`/profile/${userData.user_id}`}>{`${userData.first_name} ${userData.last_name}`}</Link>
                            </div>
                            <p
                              className="comment-item"
                              dangerouslySetInnerHTML={{__html: this.handleMentionsInText(comment.comment_text)}}
                            />
                            {
                              comment.my_comment ?
                                <div className="comment-user-editdelete">
                                <span
                                  className="comment-edit"
                                  onClick={() =>
                                    this.handleCommentEdit(index, comment.comment_text, commentParentArray, commentArray)}>
                                  <i className="fa fa-pencil" aria-hidden="true"/>
                                </span>
                                  <span
                                    className="comment-delete"
                                    onClick={() => this.props.onCommentDelete(index, commentParentArray, commentArray)}>
                                  <i className="fa fa-times" aria-hidden="true"/>
                                </span>
                                </div> : null
                            }
                          </div>
                          <div className="comment-user-likereply">
                          <span style={{paddingLeft: '0px'}}>
                            <a
                              style={{cursor: 'pointer'}}
                              onClick={() => this.props.postCommentLike(post_id, comment.comment_id)}
                            >
                              {comment.liked === true ? 'Unlike' : 'Like'}
                            </a>
                          </span>.
                            <span>
                            <a style={{cursor: 'pointer'}} onClick={() => {
                              window.scrollTo(0, this.myRef.offsetTop);
                              this.setState(prevState => ({
                                ...prevState,
                                commentBoxVisible: true,
                                isCommentReply: true,
                                commentId: this.parentCommentId,
                                editData: {
                                  ...prevState.editData,
                                  text: `@${userData.first_name} ${userData.last_name} - `
                                }
                              }))
                            }}
                            >
                              Reply
                            </a>
                          </span>
                          </div>
                        </div>
                      </li>
                    );
                  })
                }
              </ul>
            </div> :
            null
        }
      </li>
    );
  }
}

export default CommentItem;
