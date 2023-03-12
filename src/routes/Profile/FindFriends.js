import React, {Component} from 'react';
import {connect} from 'react-redux';

import withErrorHandler from '../../utils/withErrorHandler';
import UserLayout from '../../hoc/UserDetail/UserDetail';
import {fetchFindFriends, resetFindFriends} from '../../redux/actions';
import HorizontalLoader from "../../components/Loders/HorizontalLoder/HorizontalLoader";
import FriendDetailBox from '../../components/FriendDetailBox/FriendDetailBox';
import axios from "../../utils/axiosConfig";

class FindFriends extends Component {
  state = {
    searchValue: '',
    friends: null,
    isLoaded: false
  };

  static getDerivedStateFromProps (props, state) {
    if (!state.isLoaded && props.friends !== null) {
      return {...state, friends: props.friends, isLoaded: true}
    }
    if ((state.friends !== props.friends) && state.isLoaded) {
      return {...state, friends: props.friends}
    }
    return null;
  }

  componentDidMount() {
    this.props.fetchFriends(this.props.token);
  }

  componentWillUnmount() {
    this.props.resetFriends();
  }

  handleRequestButton = url => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };

    axios.get(url, config)
      .then(() => {
        //console.log(response.data.data.data);
        this.props.fetchFriends(this.props.token);
        //console.log(this.props.history);
      })
      .catch(err => {
        console.log(err);
      });
  };

  onSearchTermChange = event => {
    const value = event.target.value;
    this.setState({searchValue: value});
    if(this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.fetchFriends(this.props.token, value)
    }, 500);
  };

  render() {
    let {friends} = this.state;
    let friendList = <HorizontalLoader/>;
    if (!this.props.isLoading && friends) {
      friendList = friends.map(friend => {
        return (
          <FriendDetailBox
            key={friend.user_id}
            friendDetails={friend}
            handleRequestButton={this.handleRequestButton}
          />
        )
      });
    }

    return (
      <UserLayout>
        <div className="midleconarea">
          <div className="awhitebg">
            <div className="insiderarea marbtm20">
                <div className="searchbar">
                  <input
                    className="search_input"
                    type="text" placeholder="Please start typing to search..."
                    onChange={this.onSearchTermChange}
                    value={this.state.searchValue}
                    style={{width: '100%'}}
                  />
                </div>
            </div>
            <div className="allfriendslist">
              <ul>
                {friendList}
              </ul>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    friends: state.findFriend.friends,
    token: state.auth.token
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFriends: (token, term) => dispatch(fetchFindFriends(token, term)),
    resetFriends: () => dispatch(resetFindFriends())
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(FindFriends), axios);
