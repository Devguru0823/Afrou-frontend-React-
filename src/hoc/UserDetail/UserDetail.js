import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import UserInfoNavBar from '../../components/UserInfoNavBar/UserInfoNavBar';
import {fetchProfileDetails, updateUserDetails, resetProfileDetail} from "../../redux/actions";

class UserDetail extends Component {
  componentDidMount() {
    this.props.fetchProfileDetails(this.props.token);
  }

  componentWillUnmount() {
    this.props.resetProfileDetail()
  }

  render() {
    return (
      <section className="afroinneratear">
        <div className="container">
          <div className="height20"/>
          <div className='allsubmenus' id="user-nav">
            <UserInfoNavBar navCounters={this.props.navCounters}/>
          </div>
          <div className="height50"/>
          <div className="clearfix"/>

          {this.props.children}

        </div>
      </section>
    );

  }
}

const mapStateToProps = state => {
  return {
    profileDetails: state.profile.profileDetails,
    user: state.auth.user,
    token: state.auth.token,
    isLoading: state.ui.isLoading,
    navCounters: state.count.navCounters
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProfileDetails: (token, id) => dispatch(fetchProfileDetails(token, id)),
    updateUserDetails: (user, newData) => dispatch(updateUserDetails(user, newData)),
    resetProfileDetail: () => dispatch(resetProfileDetail())
  }
};

export default withRouter(withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(UserDetail), axios));