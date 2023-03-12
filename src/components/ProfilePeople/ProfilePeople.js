import React, {Component} from 'react';

import HorizontalLoader from "../Loders/HorizontalLoder/HorizontalLoader";
import FriendDetailBox from '../FriendDetailBox/FriendDetailBox'

class ProfilePeople extends Component {
  state = {
    selectedType: 'followings',
    people: [],
    loaded: false,
    showAllPeople: false
  };

  static getDerivedStateFromProps(props, state) {
    if (!state.loaded && props.friends) {
      return {
        ...state,
        loaded: true,
        people: props.friends
      }
    }
    return null
  }

  handleFriendListChangedClick = type => {
    switch (type) {
      case 'myFriends':
        this.setState({selectedType: type, people: this.props.friends || []});
        break;
      case 'followings':
        this.setState({selectedType: type, people: this.props.followings || []});
        break;
      case 'followers':
        this.setState({selectedType: type, people: this.props.followers || []});
        break;
      default:
        return
    }
  };

  render() {
    let friendList = <HorizontalLoader/>;
    if (!this.props.isLoading && this.state.people) {
      if (this.state.people.length === 0) {
        friendList = <p className="empty-friends">Empty list!</p>;
      } else {
        this.state.showAllPeople ?
          friendList = this.state.people.map(friend => {
            return (
              <FriendDetailBox
                key={friend.user_id}
                friendDetails={friend}
              />
            )
          }) :
          friendList = this.state.people.filter((person, index) => index < 3).map(friend => {
            return (
              <FriendDetailBox
                key={friend.user_id}
                friendDetails={friend}
              />
            )
          })
      }
    }

    return (
      <div className="awhitebg">
        <div className="allfriendslist">
          <div className="profilefriendtexttx">
            <div
              className={`groupbttntxt gyoumjoinn ${this.state.selectedType === 'followings' ? 'current' : null}`}
              onClick={() => this.handleFriendListChangedClick('followings')}
            >
              Followings
            </div>
            <div
              className={`groupbttntxt gmangedbyy ${this.state.selectedType === 'followers' ? 'current' : null}`}
              onClick={() => this.handleFriendListChangedClick('followers')}
            >
              Followers
            </div>
            <div
              className={`groupbttntxt gmangedbyy ${this.state.selectedType === 'myFriends' ? 'current' : null}`}
              onClick={() => this.handleFriendListChangedClick('myFriends')}
            >
              Role Models
            </div>
          </div>
          <div className="clearfix"/>
          <ul>
            {friendList}
          </ul>
          {
            !this.state.showAllPeople && this.state.people && this.state.people.length > 3 ?
              <p
                style={{float: 'right', cursor: 'pointer'}}
                onClick={() => this.setState({showAllPeople: true})}
              >
                Show more
              </p> :
              null
          }
        </div>
      </div>
    )
  }
}

export default ProfilePeople;
