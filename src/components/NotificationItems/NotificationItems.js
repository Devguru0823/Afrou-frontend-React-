import React from 'react';
import moment from 'moment';

const notificationItems = props => {
  return (
    <li
      className={props.notification.notification_status === 'unread' ? 'notreadyet' : null}
      onClick={
        () => props.onNotificationClick(props.notification.notification_details.client_router_link, props.notification.notification_id)
      }
      style={{cursor: "pointer"}}
    >
      <a href="#">
        <div dangerouslySetInnerHTML={{__html: props.notification.notification_details.text}} />
        <span><i className="fa fa-clock-o"/>{moment(props.notification.created_date).fromNow()}</span>
      </a>
    </li>
  );
};

export default notificationItems;
