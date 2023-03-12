import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from "react-router-dom";

import NotificationItems from '../../components/NotificationItems/NotificationItems';
import axios from "../../utils/axiosConfig";

class NotificationBox extends Component {
  state = {
    showNotification: false
  };

  handleNotification = (url, id) => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };

    axios.get('/notifications/read/' + id, config)
      .then(response => {
        console.log(url);
        this.setState({notifications: response.data.data});
        this.props.history.push(url);
      })
      .catch(err => {
        console.log(err);
        //dispatch(setFeed({data: []}));
      });
  };

  handleMarkAllNotifications = () => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };

    axios.get('/notifications/markallasread', config)
      .then(response => {
        this.setState({notifications: response.data.data});
      })
      .catch(err => {
        console.log(err);
        //dispatch(setFeed({data: []}));
      });
  };

  showMenu = event => {
    event.preventDefault();

    this.setState({ showNotification: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  };

  closeMenu = () => {
    this.setState({ showNotification: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  };

  render() {
    let item = (
      <span className="empty-notifications">
        All caught up!
        <span role="img" aria-label="Grinning face">😃</span>
      </span>
    );

    if (this.props.notifications && this.props.notifications.length !== 0) {
      item = this.props.notifications.map(notification => {
        return (
          <NotificationItems
            key={notification._id}
            notification={notification}
            onNotificationClick={this.handleNotification}
          />
        )
      })
    }

    return (
      <li
        className={
          this.state.showNotification ? 'posreltive active' : 'posreltive'
        }
        id="headernotif"
        onClick={this.showMenu}>
        <i className="fa fa-bell"/>
        {
          this.props.notificationCount && this.props.notificationCount !== 0
          ? <span>{this.props.notificationCount}</span>
            : null
        }
        <div
          id="listofnotitop"
          className={this.state.showNotification ? 'activate' : null}>
          <ul>{item}</ul>
          {
            this.props.notificationCount !== 0 ?
              <div className="readallnoti" onClick={this.handleMarkAllNotifications}><a>Mark all as read</a></div>:
              null
          }
          <div className="readallnoti"><Link to="/notifications">See all</Link></div>
        </div>
      </li>
    );
  }
}

export default withRouter(NotificationBox);
