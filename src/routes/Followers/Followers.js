import React, {Component} from 'react';
import {connect} from 'react-redux';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import UserLayout from '../../hoc/UserDetail/UserDetail';
import FriendDetailBox from '../../components/FriendDetailBox/FriendDetailBox';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import {fetchFollowers, updateUserDetails} from '../../redux/actions';

class Followers extends Component {
  state = {
    showNewGroupForm: false,
    selectedType: 'myFriends'
  };

  componentDidMount() {
    this.props.fetchFriends(this.props.token, this.state.selectedType);
  }

  handleRequestButton = url => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };

    axios.get(url, config)
      .then(response => {
        this.props.updateUserDetails(this.props.user, response.data.data);
        this.props.history.replace('/followers');
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleFriendListChangedClick = type => {
    this.setState({selectedType: type});
    this.props.fetchFriends(this.props.token, type);
  };

  render() {
    let friendList = <HorizontalLoader/>;
    if (!this.props.isLoading && this.props.friends) {
      if (this.props.friends.length === 0) {
        friendList = this.state.selectedType === 'myFriends' ?
          <p className="empty-friends">No Followers in your current list!</p> : <p className="empty-friends">All caught up!</p>
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
              <div className="friendtexttx">
                <div
                  className={`groupbttntxt gmangedbyy ${this.state.selectedType === 'myFriends' ? 'current' : null}`}
                  onClick={() => this.handleFriendListChangedClick('myFriends')}
                >
                  Followers
                </div>
                <div
                  className={`groupbttntxt gyoumjoinn ${this.state.selectedType === 'requestList' ? 'current' : null}`}
                  onClick={() => this.handleFriendListChangedClick('requestList')}
                >
                  Follow Requests
                </div>
              </div>
              <div className="clearfix"/>
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
    friends: state.follower.followers,
    user: state.auth.user
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFriends: (token, type) => dispatch(fetchFollowers(token, type)),
    updateUserDetails: (user, newData) => dispatch(updateUserDetails(user, newData))
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(Followers), axios);
