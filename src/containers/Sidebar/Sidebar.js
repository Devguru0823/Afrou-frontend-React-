import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactSidebar from 'react-sidebar';

import {uiShowSidebar, uiHideSidebar, updateUserDetails} from '../../redux/actions';
import {sidebarStyles} from '../../stylesheets/Sidebar';
import UserMenu from '../../components/UserMenu/UserMenu';
import SidebarUserMenu from '../../components/UserMenu/SidebarUserMenu';
import ProfileInfoBox from '../../components/ProfileInfoBox/ProfileInfoBox';
import CircleLoader from "../../components/Loders/CircleLoder/CircleLoader";

class Sidebar extends Component {
  state = {
    isProfileImageEditorOpen: false,
    isTouchEnabled: true
  };

  static getDerivedStateFromProps(props, state) {
    if (state.isProfileImageEditorOpen && state.isTouchEnabled) {
      return {
        ...state,
        isTouchEnabled: false
      }
    }
    if (!state.isProfileImageEditorOpen && !state.isTouchEnabled) {
      return {
        ...state,
        isTouchEnabled: true
      }
    }
    return null;
  };

  onSetSidebarOpen = status => {
    if (status) {
      this.props.uiShowSidebar();
    } else {
      this.props.uiHideSidebar();
    }
  };

  userDetailUpdateHandler = newData => {
    this.props.updateUserDetails(this.props.user, newData)
  };

  handleViewEditorChange = status => {
    this.setState({isProfileImageEditorOpen: status})
  };

  render() {
    const {showSidebar} = this.props;
    let classNames = 'left-sidebar';
    if (showSidebar) {
      classNames = 'left-sidebar show-sidebar';
    }
    const content = (
      <div className="container">
        <div className="leftusermenu" id="usermenu">
          {
            this.props.user ?
              <ProfileInfoBox
                profileDetails={this.props.user}
                token={this.props.token}
                updateProfileDetail={this.userDetailUpdateHandler}
                onViewEditorChange={this.handleViewEditorChange}
              /> :
              <div className="profilewall" style={{height: this.props.ifOthersProfile ? '135px' : null}}>
                <CircleLoader/>
              </div>
          }
          <div onClick={() => this.onSetSidebarOpen(false)}>
            <div className="clearfix"/>
            <SidebarUserMenu counter={this.props.navCounters}/>
            <div className="clearfix"/>
            <UserMenu/>
          </div>
        </div>
      </div>
    );

    return (
      <div className={classNames}>
        <ReactSidebar
          styles={sidebarStyles}
          sidebar={content}
          open={showSidebar}
          onSetOpen={this.onSetSidebarOpen}
          rootClassName='sidebar-root'
          sidebarClassName='sidebar-main'
          contentClassName='sidebar-content'
          overlayClassName='sidebar-overlay'
          touch={this.state.isTouchEnabled}
        >
          {''}
        </ReactSidebar>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    showSidebar: state.ui.showSidebar,
    profileDetails: state.profile.profileDetails,
    token: state.auth.token,
    user: state.auth.user,
    navCounters: state.count.navCounters
  }
};

const mapDispatchToProps = dispatch => {
  return {
    uiShowSidebar: () => dispatch(uiShowSidebar()),
    uiHideSidebar: () => dispatch(uiHideSidebar()),
    updateUserDetails: (user, newData) => dispatch(updateUserDetails(user, newData))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);