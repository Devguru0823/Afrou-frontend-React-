import React, {Component} from 'react';
import {connect} from 'react-redux';

import withErrorHandler from '../../utils/withErrorHandler';
import ProfileLayout from '../../hoc/Profile/Profile';
import {fetchFindGroups, resetFindGroups} from '../../redux/actions';
import HorizontalLoader from "../../components/Loders/HorizontalLoder/HorizontalLoader";
import GroupItem from '../../components/AfroGroup/GroupItem';
import axios from "../../utils/axiosConfig";

class FindFriends extends Component {
  state = {
    searchValue: '',
    groups: null,
    isLoaded: false
  };

  static getDerivedStateFromProps(props, state) {
    if (!state.isLoaded && props.groups !== null) {
      return {...state, groups: props.groups, isLoaded: true}
    }
    if ((state.groups !== props.groups) && state.isLoaded) {
      return {...state, groups: props.groups}
    }
    return null;
  }

  componentDidMount() {
    this.props.fetchGroups(this.props.token);
  }

  componentWillUnmount() {
    this.props.resetGroups();
  }

  handleRequestButton = (url, type, id) => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };

    axios.get(url, config)
      .then(() => {
        if (type === 'danger') {
          this.props.fetchGroups(this.props.token);
        } else {
          this.props.history.push(`/afrogroup/${id}`);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  onSearchTermChange = event => {
    const value = event.target.value;
    this.setState({searchValue: value});
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.fetchGroups(this.props.token, value)
    }, 500);
  };

  render() {
    let {groups} = this.state;
    let groupList = <HorizontalLoader/>;
    if (!this.props.isLoading && groups) {
      groupList = groups.map(group => {
        return (
          <GroupItem
            groupDetails={group}
            key={group._id}
            groupType={'search'}
            onRequestButton={this.handleRequestButton}
          />
        )
      });
    }

    return (
      <ProfileLayout>
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
                  autoFocus
                />
              </div>
            </div>
            <div className="allfriendslist">
              <ul>
                {groupList}
              </ul>
            </div>
          </div>
        </div>
      </ProfileLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    groups: state.findGroup.groups,
    token: state.auth.token
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchGroups: (token, term) => dispatch(fetchFindGroups(token, term)),
    resetGroups: () => dispatch(resetFindGroups())
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(FindFriends), axios);
