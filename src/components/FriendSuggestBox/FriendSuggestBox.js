import React, {Component} from 'react';
import Slider from "react-slick";
import {Link} from 'react-router-dom';

import {BASE_URL} from "../../constants/ImageUrls";
import axios from "../../utils/axiosConfig";
import ProfileImageView from "../ProfileInfoBox/ProfileImageView";
import {SIZE_300} from "../../constants/imageSizes";

class FriendsSuggestBox extends Component{
  state = {
    showViewer: false,
    imageUrl: null
  };

  suggestedBoxClickHandler = (url) => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };

    axios.get(url, config)
      .then(() => {
        //console.log(response);
        this.props.fetchFriends();
      })
  };

  onImageClicked = url => {
    this.setState({imageUrl: url, showViewer: true})
  };

  handleCloseViewBox = url => {
    this.setState({imageUrl: url, showViewer: false});
  };

  render() {
    const {friends} = this.props;
    let friendList = (
      <li className="activefr">
        <div className="suggfrndimg"><img src="/images/footerlogo.jpg" alt="img" className="img-responsive"/></div>
        <div className="suggfrndname">......</div>
        <div className="suggfrndbtns">
          <button type="button" className="followbtn">..... <i className="fa fa-heart"/></button>
          <button type="button" className="adfrndbtn">...... <i className="fa fa-plus"/></button>
        </div>
      </li>
    );

    if (friends) {
      friendList = friends.map(friend => (
        <li className="activefr" key={friend.user_id}>
          <div className="suggfrndimg">
              <img
                src={`${BASE_URL}${friend.profile_image_url}${SIZE_300}`}
                alt="img"
                className="img-responsive"
                style={{cursor: 'pointer'}}
                onClick={() => this.onImageClicked(`${BASE_URL}${friend.profile_image_url}${SIZE_300}`)}
              />
          </div>
          <div className="suggfrndname">
            <Link to={`/profile/${friend.user_id}`}> {`${friend.first_name} ${friend.last_name}`}</Link>
          </div>
          <div className="suggfrndbtns">
            <button
              type="button" className="followbtn"
              onClick={() => this.suggestedBoxClickHandler(friend.follow_button.button_link)}
            >
              {friend.follow_button.button_text} <i className="fa fa-heart"/>
            </button>
          </div>
        </li>
      ));
    }

    return (
      <div className="friendsuggestbx">
        {
          this.state.showViewer ?
            <ProfileImageView
              closeImageBox={this.handleCloseViewBox}
              imageUrl={this.state.imageUrl}
            /> :
            null
        }
        <div className="frsuggheaser">Suggested People</div>
        <div className="allfriendlistsgtn">
          <Slider slidesToShow={2} infinite={false}>
            {friendList}
          </Slider>
        </div>
      </div>
    );
  }
}

export default FriendsSuggestBox;
