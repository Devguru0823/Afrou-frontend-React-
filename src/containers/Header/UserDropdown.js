import React, {Component} from 'react';

import UserDropdownItems from '../../components/UserDropdownItems/UserDropdownItems';
/*import {BASE_URL} from '../../constants/ImageUrls';*/

class UserDropdown extends Component {
  state = {
    showUserDropdown: false
  };

  _isMounted = true;

  showMenu = event => {
    event.preventDefault();
    if(this._isMounted) {
      this.setState({ showUserDropdown: true }, () => {
        document.addEventListener('click', this.closeMenu);
      });
    }
  }

  closeMenu = () => {
    if(this._isMounted) {
      this.setState({ showUserDropdown: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  };

  componentWillUnmount() {
    this._isMounted= false;
  }

  render() {
    /*const {first_name, profile_image_url} = this.props.userInfo;*/

    return (
      <li
        className="posreltive"
        onClick={this.showMenu}>
        <i className="fa fa-user"/>
        <div
          id="allusermenues"
          className={this.state.showUserDropdown ? 'activate' : null}>
          <UserDropdownItems userInfo={this.props.userInfo}/>
        </div>
      </li>
    )
  }
}

export default UserDropdown;
