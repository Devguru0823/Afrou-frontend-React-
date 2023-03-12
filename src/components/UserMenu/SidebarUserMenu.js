import React from 'react';
import {NavLink, Link} from 'react-router-dom';

const userMenu = props => {
  const {counter} = props;

  let content = (
    <div className="insiderarea">
      <div className="othersmenuleft">
        <ul>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          <li>
            <Link to="/messages">Messages</Link>
          </li>
          <li>
            <Link to="/friends">Role Models</Link>
          </li>
          <li>
            <Link to="/followings">Followings</Link>
          </li>
          <li>
            <Link to="/followers">Followers</Link>
          </li>
        </ul>
      </div>
    </div>
  );
  if (counter) {
    content = (
      <div className="insiderarea">
        <div className="othersmenuleft">
          <ul>
            <li><NavLink to="/profile" activeClassName="nav-active">Profile</NavLink></li>
            <li><NavLink to="/notifications" activeClassName="nav-active">Notifications</NavLink></li>
            <li>
              <NavLink to="/messages" activeClassName="nav-active">Messages</NavLink>
              {
                counter.messages && counter.messages !== 0 ?
                  <b className="nav-counters">{counter.messages}</b> : null
              }
            </li>
            <li>
              <NavLink to="/friends" activeClassName="nav-active">Role Models</NavLink>
              {
                counter.friends && counter.friends !== 0 ?
                  <b className="nav-counters">{counter.friends}</b> : null
              }
            </li>
            <li>
              <NavLink to="/followings" activeClassName="nav-active">Followings</NavLink>
              {
                counter.followings && counter.followings !== 0 ?
                  <b className="nav-counters">{counter.followings}</b> : null
              }
            </li>
            <li>
              <NavLink to="/followers" activeClassName="nav-active">Followers</NavLink>
              {
                counter.followers && counter.followers !== 0 ?
                  <b className="nav-counters">{counter.followers}</b> : null
              }
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return content;
};

export default userMenu;