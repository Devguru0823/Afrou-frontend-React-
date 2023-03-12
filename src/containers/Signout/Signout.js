import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {authLogout} from '../../redux/actions';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";

class Logout extends Component {

  _isMounted = true;

  componentDidMount() {
    if(this._isMounted) {
      this.props.onLogout(this.props.token);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return this._isMounted ? <Redirect to="/?=logout"/> : null;
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: (token) => dispatch(authLogout(token))
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(Logout), axios);
