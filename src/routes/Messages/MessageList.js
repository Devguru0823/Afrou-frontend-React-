import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from "react-router-dom";

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import UserLayout from '../../hoc/UserDetail/UserDetail';
import { fetchMessagesList, api, fetchProfileDetails, resetMessageDetail } from '../../redux/actions'
import { BASE_URL } from "../../constants/ImageUrls";
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import { SIZE_300, SIZE_45 } from "../../constants/imageSizes";
import './MessageList.css';

class MessageList extends Component {
  state = {
    selectedType: 'messages',
    messageList: [],
    contactIsLoading: true,
    contactList: []
  };

  componentDidMount() {
    console.log(this.props.isLoading);
    this.props.fetchMessageList(this.props.token);
    if(this.props.profileDetails && this.props.profileDetails.friends_list) {
      this.setState({ contactIsLoading: false, contactList: this.props.profileDetails.friends_list });
      return;
    }

    const config = {
      headers: { 'Authorization': "bearer " + this.props.token }
    };

    let url = '/profile';

    axios.get(url, config)
      .then(response => {
        this.setState({ contactIsLoading: false, contactList: response.data.data.friends_list });
      })
      .catch(err => {
        console.log(err);
        //dispatch(setFeed({data: []}));
      });
  }

  componentWillUnmount() {
    this.props.resetMessageDetail();
  }

  handleTabChange = type => {
    this.setState({ selectedType: type });
    // if (type === 'messages') {
    //   this.props.fetchMessageList(this.props.token);
    // }
    // if (type === 'contacts') {
    //   // this.props.fetchProfileDetails(this.props.token);
    //   console.log('friends list: ', this.props.profileDetails.friends_list);
    //   // this.setState({ contactList: this.props.profileDetails.friends_list });
    // }
  };

  // function to filter contact list
  handleSearchChange = (e) => {
    // destructure contact list in props
    const contactList = [...this.props.profileDetails.friends_list];
    if (e.target.value === '') {
      this.setState({ contactList });
      return;
    }
    const result = contactList.filter((contact) => {
      const full_name = contact.first_name.toLocaleLowerCase() + ' ' + contact.last_name.toLocaleLowerCase();
      return contact.first_name.toLocaleLowerCase().indexOf(e.target.value.toLowerCase()) !== -1 ||
        contact.last_name.toLocaleLowerCase().indexOf(e.target.value.toLowerCase()) !== -1 ||
        full_name.indexOf(e.target.value.toLowerCase()) !== -1;
    });
    this.setState({ contactList: result });
  };

  render() {
    let content = <HorizontalLoader />;
    if (this.props.messageList && this.state.selectedType === 'messages') {
      content = (
        <ul>
          {
            this.props.messageList.map(
              message => (
                <li
                  key={message._id}
                  className="notreadyet"
                  onClick={() => this.props.history.push(`messages/conversation/${message.user_id}`)}
                >
                  <div className="muserimg">
                    <img src={`${BASE_URL}${message.profile_image_url}${SIZE_300}`} alt="image" />
                  </div>
                  <div className="lasttextmsg">
                    <b>{`${message.first_name} ${message.last_name}`}
                      <small>{message.unread_count || 0}</small>
                    </b>
                    <i className="fa fa-gg" />
                    {
                      message.last_message || message.last_message_image ?
                        message.last_message.length > 10 ?
                          `${message.last_message.substring(0, 20)} .........` :
                          message.last_message || 'Attachment' :
                        'Start conversation'
                    }
                  </div>
                  <div className="onoroff">
                    <span className={message.online_status ? 'online' : 'offline'} />
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
        </ul>
      );
    }

    console.log(this.state.contactIsLoading);
    if (!this.state.contactIsLoading && this.state.selectedType === 'contacts') {
      content = (
        <div>
          <form role="search" id="searchForm" onSubmit={(e) => e.preventDefault()}>
            <label id="searchLabel" htmlFor="search">Search</label>
            <input id="search" onChange={this.handleSearchChange} type="search" placeholder="Search..." autoFocus autoComplete="off" />
            {/* <button type="submit"></button> */}
          </form>
          {
            this.props.profileDetails && Array.isArray(this.props.profileDetails.friends_list) ?
              this.props.profileDetails.friends_list.length !== 0 ?
                <div className='allfriendsactnot'>
                  <ul>
                    {
                      this.state.contactList.map(friendDetail => (
                        <li key={friendDetail.user_id}>
                          <span>
                            <span className="imagefriend">
                              <Link to={`/profile/${friendDetail.user_id}`}>
                                <img src={`${BASE_URL}${friendDetail.profile_image_url}${SIZE_45}`} alt="friend online" />
                              </Link>
                            </span>
                            <span className="fiendsname">
                              <Link to={`/profile/${friendDetail.user_id}`}>
                                {`${friendDetail.first_name} ${friendDetail.last_name}`}
                              </Link>
                            </span>
                            <span className="friends-online">
                              <Link to={`/messages/conversation/${friendDetail.user_id}`}>
                                <i className="fa fa-envelope" aria-hidden="true" />
                              </Link>
                            </span>
                            <span className={friendDetail.online_status ? `fiendactive` : `fiendnonactive`} />
                          </span>
                        </li>
                      ))
                    }
                  </ul>
                </div> :
                <div className='allfriendsactnot'>
                  <span className="no-friends">
                    No Contacts to show. Please add some contacts to get most of the Afrocamgist
                  </span>
                </div>
              :
              <div className='allfriendsactnot'>
                <h4>Conversations</h4>
              </div>
          }
        </div>
      );
    }

    return (
      <UserLayout>
        <div className="midleconarea">
          <div className="awhitebg">
            <div className="allmessagelist">
              <div className="friendtexttx">
                <div
                  className={`groupbttntxt gyoumjoinn ${this.state.selectedType === 'messages' ? 'current' : null}`}
                  onClick={() => this.handleTabChange('messages')}
                >
                  Messages
                </div>
                <div
                  className={`groupbttntxt gmangedbyy ${this.state.selectedType === 'contacts' ? 'current' : null}`}
                  onClick={() => this.handleTabChange('contacts')}
                >
                  Contacts
                </div>
              </div>
              <div className="clearfix" />
              <ul>
                {content}
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
    messageList: state.message.feed,
    token: state.auth.token,
    profileDetails: state.profile.profileDetails,
    isLoading: state.ui.isLoading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProfileDetails: (token, id) => dispatch(fetchProfileDetails(token, id)),
    fetchMessageList: (token) => dispatch(fetchMessagesList(token)),
    resetMessageDetail: () => dispatch(resetMessageDetail())
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(MessageList), axios);