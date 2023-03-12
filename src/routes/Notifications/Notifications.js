import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import withErrorHandler from '../../utils/withErrorHandler';
import UserLayout from '../../hoc/UserDetail/UserDetail';
import axios from "../../utils/axiosConfig";
import {BASE_URL} from "../../constants/ImageUrls";
import HorizontalLoader from "../../components/Loders/HorizontalLoder/HorizontalLoader";
import {SIZE_300} from "../../constants/imageSizes";

class Notifications extends Component {
  state = {
    notifications: null
  };

  componentDidMount() {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };

    axios.get('/notifications', config)
      .then(response => {
        //console.log(response.data.data);
        this.setState({notifications: response.data.data});
      })
      .catch(err => {
        console.log(err);
        //dispatch(setFeed({data: []}));
      });
  }

  handleNotification = (url, id) => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };

    axios.get('/notifications/read/' + id, config)
      .then(response => {
        //console.log(response.data.data);
        this.setState({notifications: response.data.data});
        this.props.history.push(url);
      })
      .catch(err => {
        console.log(err);
        //dispatch(setFeed({data: []}));
      });
  };

  render() {
    let content = <HorizontalLoader/>;
    if (this.state.notifications) {
      content = (
        <ul>
          {
            this.state.notifications ?
              this.state.notifications.map(notification => (
                <li className={notification.notification_status === 'unread' ? 'noreadyet' : null} key={notification._id}>
                  <a onClick={() => this.handleNotification(notification.notification_details.client_router_link, notification.notification_id)}>
                          <span>
                          <img
                            src={`${BASE_URL}${notification.notification_details.user_details.profile_image_url}${SIZE_300}`}
                            alt="image"
                          />
                          </span>
                    <div dangerouslySetInnerHTML={{__html: notification.notification_details.text}} />
                    <small>{moment(notification.created_date).fromNow()}</small>
                  </a>
                </li>
              )) :
              null
          }
        </ul>
      );
    }
    return (
      <UserLayout>
        <div className="midleconarea">
          <div className="awhitebg">
            <div className="alltofifictlist">
              {content}
            </div>
          </div>
        </div>
      </UserLayout>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    isLoading: state.ui.isLoading
  }
};

export default withErrorHandler(connect(mapStateToProps)(Notifications), axios);
