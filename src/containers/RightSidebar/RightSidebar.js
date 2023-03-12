import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import ReactSidebar from 'react-sidebar';
import moment from "moment";

import {
  uiShowRightSidebar,
  uiHideRightSidebar,
  fetchMessagesList
} from '../../redux/actions';
import {sidebarStyles} from '../../stylesheets/SidebarRight';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import {BASE_URL} from "../../constants/ImageUrls";
import {SIZE_300} from "../../constants/imageSizes";

class Sidebar extends Component {
  state = {messagesFetched: false};

  componentDidUpdate() {
    if (this.props.token && !this.state.messagesFetched) {
      this.props.fetchMessageList(this.props.token);
      this.setState({messagesFetched: true})
    }
  }

  onSetSidebarOpen = status => {
    if (status) {
      this.props.uiShowSidebar();
    } else {
      this.props.uiHideSidebar();
    }
  };

  render() {
    const {showSidebar} = this.props;
    let classNames = 'right-sidebar';
    if (showSidebar) {
      classNames = 'right-sidebar show-sidebar';
    }

    const content = (
      <div className="leftusermenu" id="usermenu" onClick={() => this.onSetSidebarOpen(false)}>
	  <div className="msgclosee"><i className="fa fa-window-close-o" aria-hidden="true"></i></div>
        <div className="midleconarea">
          <div className="awhitebg">
            <div className="allmessagelist">
              <ul>
                {
                  !this.props.isLoading ||
                  Array.isArray(this.props.messageList) ?
                    this.props.messageList.length > 0 ?
                      <ul>
                        {
                          this.props.messageList.map(
                            message => (
                              <li
                                key={message._id}
                                className="notreadyet"
                                onClick={() => this.props.history.push(`/messages/conversation/${message.user_id}`)}
                              >
                                <div className="muserimg">
                                  <img src={`${BASE_URL}${message.profile_image_url}${SIZE_300}`} alt="image"/>
                                </div>
                                <div className="lasttextmsg">
                                  <b>{`${message.first_name} ${message.last_name}`}
                                    <small>{message.unread_count || 0}</small>
                                  </b>
                                  <i className="fa fa-gg"/>
                                  {
                                    message.last_message || message.last_message_image ?
                                      message.last_message.length > 10 ?
                                        `${message.last_message.substring(0, 20)} .........` :
                                        message.last_message || 'Attachment' :
                                      'Start conversation'
                                  }
                                </div>
                                <div className="onoroff">
                                  <span className={message.online_status ? 'online' : 'offline'}/>
                                  <small>
                                    {
                                      message.last_message_time ?
                                        moment(message.last_message_time).format('hh:mm a') : null
                                    }
                                  </small>
                                </div>
                              </li>
                            )
                          )
                        }
                      </ul> :
                      <div className="insiderarea">
                        <div className='allfriendsactnot'>
                          <h4>Conversations</h4>
                        </div>
                        <span className="no-friends">
                        No Conversations to show.
                      </span>
                      </div>
                    :
                    <div className="insiderarea">
                      <div className='allfriendsactnot'>
                        <h4>Conversations</h4>
                      </div>
                      <HorizontalLoader/>
                    </div>
                }
              </ul>
            </div>
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
          rootClassName='sidebar-right-root'
          sidebarClassName='sidebar-right-main'
          contentClassName='sidebar-right-content'
          overlayClassName='sidebar-right-overlay'
          pullRight={true}
        >
          {''}
        </ReactSidebar>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    showSidebar: state.ui.showRightSidebar,
    user: state.auth.user,
    token: state.auth.token,
    navCounters: state.count.navCounters,
    isLoading: state.ui.isLoading,
    messageList: state.message.feed,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    uiShowSidebar: () => dispatch(uiShowRightSidebar()),
    uiHideSidebar: () => dispatch(uiHideRightSidebar()),
    fetchMessageList: (token) => dispatch(fetchMessagesList(token)),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar));
