import React, {Component} from 'react';
import {connect} from 'react-redux';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import {
  createNewGroup,
  fetchGroups,
  removeGroupId
} from '../../redux/actions';
import UserTemplate from '../../hoc/UserDetail/UserDetail';
import CreateGroup from './CreateGroupForm';
import GroupList from './GroupList';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';

class Afrogroup extends Component {
  state = {
    showNewGroupForm: false,
    selectedType: 'own'
  };

  componentDidMount() {
    this.props.fetchGroups(this.props.token, this.state.selectedType);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.newGroupId) {
      this.props.history.push(`/afrogroup/${this.props.newGroupId}`);
      this.props.removeNewlyCreatedGroupId();
    }
  }

  handleCloseNewGroupForm = () => {
    this.setState({showNewGroupForm: false});
  };

  handleCreateGroup = data => {
    window.scrollTo(0, 0);
    this.props.createGroup(this.props.token, data, this.state.selectedType);
    this.setState({showNewGroupForm: false});
  };

  handleGroupChangeClick = type => {
    this.setState({selectedType: type});
    this.props.fetchGroups(this.props.token, type);
  };

  handleButtonClickRequest = (link, linkType) => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };
    if (linkType === 'get') {
      axios.get(link, config)
        .then(() => {
          this.props.fetchGroups(this.props.token, this.state.selectedType);
        });
    }
    if (linkType === 'delete') {
      axios.delete(link, config)
        .then(() => {
          this.props.fetchGroups(this.props.token, this.state.selectedType);
        });
    }
  };

  render() {
    let content = <HorizontalLoader/>;
    if (!this.props.isLoading) {
      content = (
        <GroupList
          groupType={this.state.selectedType}
          ownGroups={this.props.ownGroups}
          otherGroups={this.props.otherGroups}
          groupInvitations={this.props.groupInvitations}
          isLoading={this.props.isLoading}
          onRequestButton={this.handleButtonClickRequest}
        />
      );
    }

    return (
      <UserTemplate>
        <CreateGroup
          token={this.props.token}
          visible={this.state.showNewGroupForm}
          onClose={this.handleCloseNewGroupForm}
          createGroup={this.handleCreateGroup}
          isLoading={this.props.isLoading}
        />
        <div className="midleconarea">
          <div className="awhitebg">
            <div className="marketlistarea">
              <div className="grouptexttx">
                <div
                  className={`groupbttntxt gmangedbyy ${this.state.selectedType === 'own' ? 'current' : null}`}
                  onClick={() => this.handleGroupChangeClick('own')}
                >
                  Groups You Manage
                </div>
                <div
                  className={`groupbttntxt gyoumjoinn ${this.state.selectedType === 'other' ? 'current' : null}`}
                  onClick={() => this.handleGroupChangeClick('other')}
                >
                  Joined Groups
                </div>
                <div
                  className={`groupbttntxt gyoumjoinn ${this.state.selectedType === 'invitations' ? 'current' : null}`}
                  onClick={() => this.handleGroupChangeClick('invitations')}
                >
                  Invitations
                </div>
              </div>
              <div className="clearfix"/>
              <div
                className="bttnaddgroup"
                style={{marginLeft: 10}}
                onClick={() => this.props.history.push('/find-groups')}
              >
                <i className="fa fa-search" aria-hidden="true"/>
              </div>
              <div className="bttnaddgroup" onClick={() => this.setState({showNewGroupForm: true})}>
                <i className="fa fa-plus"/> Create Group
              </div>
              <div className="clearfix"/>
              {content}
            </div>
          </div>
        </div>
      </UserTemplate>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    ownGroups: state.group.ownGroups,
    otherGroups: state.group.otherGroups,
    groupInvitations: state.group.groupInvitations,
    isLoading: state.ui.isLoading,
    newGroupId: state.group.groupId
  }
};

const mapDispatchToProps = dispatch => {
  return {
    createGroup: (token, data, type) => dispatch(createNewGroup(token, data, type)),
    fetchGroups: (token, type) => dispatch(fetchGroups(token, type)),
    removeNewlyCreatedGroupId: () => dispatch(removeGroupId())
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(Afrogroup), axios);
