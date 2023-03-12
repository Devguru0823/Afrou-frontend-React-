import React, {Component} from 'react';
import {connect} from 'react-redux';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import UserLayout from '../../hoc/UserDetail/UserDetail';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import {fetchFriends, updateUserDetails} from "../../redux/actions";
import FriendDetailBox from "../../components/FriendDetailBox/FriendDetailBox";

class RoleModels extends Component {
  state = {
    showViewer: false,
    imageUrl: null
  };

  componentDidMount() {
    this.props.fetchFriends(this.props.token);
  }

  handleRequestButton = url => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };

    axios.get(url, config)
      .then(response => {
        this.props.updateUserDetails(this.props.user, response.data.data);
        this.props.fetchFriends(this.props.token);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let friendList = <HorizontalLoader/>;
    if (!this.props.isLoading && this.props.friends) {
      if (this.props.friends.length === 0) {
        friendList = <p className="empty-friends">No Role Models to show!</p>;
      } else {
        friendList = this.props.friends.map(friend => {
          return (
            <FriendDetailBox
              key={friend.user_id}
              friendDetails={friend}
              handleRequestButton={this.handleRequestButton}
            />
          )
        });
      }
    }

    return (
      <UserLayout>
        <div className="midleconarea">
          <div className="awhitebg">
            <div className="allfriendslist">
              <ul>
                {friendList}
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
    friends: state.friend.friends
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFriends: (token) => dispatch(fetchFriends(token)),
    updateUserDetails: (user, newData) => dispatch(updateUserDetails(user, newData))
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(RoleModels), axios);
