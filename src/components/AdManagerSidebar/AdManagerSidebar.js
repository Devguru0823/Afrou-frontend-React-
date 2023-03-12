import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar" data-color="purple" data-background-color="white" data-image="../assets/img/sidebar-1.jpg">
      <div className="logo"><a href="http://www.creative-tim.com" className="simple-text logo-normal">
        Ad Manager
        </a></div>
      <div className="sidebar-wrapper">
        <ul className="nav">
          <li className="nav-item active  ">
            <Link to="/admanager/dashboard" className="nav-link">
              <i className="material-icons">dashboard</i>
              <p>Dashboard</p>
            </Link>
          </li>
          <li className="nav-item ">
            <Link to="/admanager/create-ad" className="nav-link">
              <i className="material-icons">create</i>
              <p>Create New Ad</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar;