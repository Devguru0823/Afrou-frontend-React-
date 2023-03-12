import React, {Component} from 'react';

import GroupItem from '../../components/AfroGroup/GroupItem';

class GroupList extends Component {
  render() {
    const {isLoading, otherGroups, ownGroups, groupType, groupInvitations} = this.props;
    let loader = <li>...Loading</li>;

    if (!isLoading && (ownGroups || otherGroups || groupInvitations)) {
      if (groupType === 'other') {
        otherGroups.length === 0 ?
          loader = <span className='empty-groups'>Please join some groups to see them here</span> :
          loader = otherGroups.map(group => {
            return (
              <GroupItem
                groupDetails={group}
                key={group._id}
                groupType={groupType}
                onButtonClick={this.handleButtonClick}
                onRequestButton={this.props.onRequestButton}
              />
            );
          })
      } else if (groupType === 'invitations') {
        groupInvitations.length === 0 ?
          loader = <span className='empty-groups'>All caught up!</span> :
          loader = groupInvitations.map(group => {
            return (
              <GroupItem
                groupDetails={group}
                key={group._id}
                groupType={groupType}
                onButtonClick={this.handleButtonClick}
                onRequestButton={this.props.onRequestButton}
              />
            );
          })
      } else {
        ownGroups.length === 0 ?
          loader = <span className='empty-groups'>Please create some groups to see them here</span> :
          loader = ownGroups.map(group => {
            return (
              <GroupItem
                groupDetails={group}
                key={group._id}
                groupType={groupType}
                onButtonClick={this.handleButtonClick}
                onRequestButton={this.props.onRequestButton}
              />
            );
          })
      }
    }

    return (
      <div className="allgrouplistarea">
        <div className="grouplisting">
          <ul>
            {loader}
          </ul>
        </div>
      </div>
    )
  }
}

export default GroupList;