import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {BASE_URL} from "../../constants/ImageUrls";
import ProfileImageView from '../../components/ProfileInfoBox/ProfileImageView';
import {SIZE_300} from "../../constants/imageSizes";

class FriendDetailBox extends Component {
  state = {
    showViewer: false
  };

  handleCloseViewBox = () => {
    this.setState({showViewer: false})
  };

  render() {
    const {first_name, last_name, user_id, profile_image_url, follower_ids, request_buttons,user_name} = this.props.friendDetails;

    return (
      <li>
        {
          this.state.showViewer ?
            <ProfileImageView
              visible={this.state.showViewer}
              closeImageBox={this.handleCloseViewBox}
              imageUrl={`${BASE_URL}${profile_image_url}${SIZE_300}`}
            /> :
            null
        }
        <div className="friendphoto">
          <img
            src={`${BASE_URL}${profile_image_url}${SIZE_300}`}
            alt="image"
            className="img-responsive"
            style={{cursor: 'pointer'}}
            onClick={() => this.setState({showViewer: true})}
          />
        </div>
        <div className="friendnanetxt friendnanetxt-mobile">
          {/* <Link to={`/profile/${user_id}`}><b>{`${first_name} ${last_name}`}</b></Link> */}
          <Link to={`/profile/${user_id}`}><b>
                  {user_name ? user_name:`${first_name} ${last_name}` }
          </b></Link>
          <small>{follower_ids ? follower_ids.length : 0} followers</small>
        </div>
        <div className="friendsbtnns friendsbtnns-mobile">
          {
            request_buttons ? request_buttons.map(button => {
              if (button.button_type === 'danger') {
                return <button key={button.button_text} className="buttonnormal"
                               onClick={() => this.props.handleRequestButton(button.button_link)}>
                  {button.button_text}
                </button>
              }
              if (button.button_type === 'warning') {
                return <button key={button.button_text} className="buttonunfollow"
                               onClick={() => this.props.handleRequestButton(button.button_link)}>
                  {button.button_text}
                </button>
              }
              if (button.button_type === 'success') {
                return <button key={button.button_text} className="buttonfollow"
                               onClick={() => this.props.handleRequestButton(button.button_link)}>
                  {button.button_text}
                </button>
              }
            }) : null
          }
        </div>
      </li>
    )
  }
}

export default FriendDetailBox;