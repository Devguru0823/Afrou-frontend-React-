import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import UserLayout from '../../hoc/UserDetail/UserDetail';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import {fetchFollowings, updateUserDetails} from "../../redux/actions";
import {BASE_URL} from "../../constants/ImageUrls";
import ProfileImageView from "../../components/ProfileInfoBox/ProfileImageView";
import {SIZE_300} from "../../constants/imageSizes";

class Followings extends Component {
  state = {
    showViewer: false,
    imageUrl: null
  };

  componentDidMount() {
    this.props.fetchFollowings(this.props.token);
  }

  handleRequestButton = url => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };

    axios.get(url, config)
      .then(response => {
        //console.log(response.data.data.data);
        this.props.updateUserDetails(this.props.user, response.data.data);
        //console.log(this.props.history);
        this.props.history.replace('/following');
      })
      .catch(err => {
        console.log(err);
      });
  };

  onItemClicked = url => {
    this.setState({showViewer: true, imageUrl: url})
  };

  handleCloseViewBox = () => {
    this.setState({showViewer: false, imageUrl: null});
  };

  render() {
    let followingList = <HorizontalLoader/>;
    if (!this.props.isLoading && this.props.followings) {
      followingList = this.props.followings.map(following => {
        return <li key={following.user_id}>
          <div className="friendphoto">
            <img
              src={`${BASE_URL}${following.profile_image_url}${SIZE_300}`}
              alt="image"
              className="img-responsive"
              style={{cursor: 'pointer'}}
              onClick={() => this.onItemClicked(`${BASE_URL}${following.profile_image_url}${SIZE_300}`)}
            />
          </div>
          <div className="friendnanetxt friendnanetxt-mobile">
            <Link to={`/profile/${following.user_id}`}><b>{`${following.first_name} ${following.last_name}`}</b></Link>
            <small>{following.follower_ids ? following.follower_ids.length : 0} followers</small>
          </div>
          <div className="friendsbtnns friendsbtnns-mobile">
            {
              following.request_buttons.map(button => {
                if (button.button_type === 'danger') {
                  return <button key={button.button_text} className="buttonnormal" onClick={() => this.handleRequestButton(button.button_link)}>
                    {button.button_text}
                  </button>
                }
                if (button.button_type === 'warning') {
                  return <button key={button.button_text} className="buttonunfollow" onClick={() => this.handleRequestButton(button.button_link)}>
                    {button.button_text}
                  </button>
                }
                if (button.button_type === 'success') {
                  return <button key={button.button_text} className="buttonfollow" onClick={() => this.handleRequestButton(button.button_link)}>
                    {button.button_text}
                  </button>
                }
              })
            }
          </div>
        </li>
      });
    }

    return (
      <UserLayout>
        {
          this.state.showViewer ?
            <ProfileImageView
              visible={this.state.showViewer}
              closeImageBox={this.handleCloseViewBox}
              imageUrl={this.state.imageUrl}
            /> :
            null
        }
        <div className="midleconarea">
          <div className="awhitebg">
            <div className="allfriendslist">
              <ul>
                {followingList}
              </ul>
            </div>
          </div>
        </div>
      </UserLayout>
    )
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    token: state.auth.token,
    followings: state.following.followings,
    user: state.auth.user
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFollowings: (token) => dispatch(fetchFollowings(token)),
    updateUserDetails: (user, newData) => dispatch(updateUserDetails(user, newData))
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(Followings), axios);
