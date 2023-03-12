import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from '../../utils/axiosConfig';
import UserLayout from '../../hoc/UserDetail/UserDetail';
import SettingsForm from './SettingsForm';
import {fetchSettings, updateSettings, hideAlertMessage} from '../../redux/actions';
import {toastOptions} from "../../constants/toastOptions";

class Settings extends Component {
  state = {
    submitted: false
  };

  static getDerivedStateFromProps(props, state) {
    if (state.submitted && !props.isLoading) {
      return {submitted: false}
    }
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.submitted && !this.props.isLoading) {
      this.props.fetchSettings(this.props.token);
    }
    if (this.props.showMessage) {
      toast.success(this.props.alertMessage, toastOptions);
      this.props.hideAlertMessage();
    }
  }

  componentDidMount() {
    this.props.fetchSettings(this.props.token);
  }

  handleSubmit = (data) => {
    this.props.updateSettings(this.props.token, data, this.props.user);
    this.setState({submitted: true})
  };

  render() {
    return (
      <UserLayout>
        <div className="midleconarea">
          <div className="awhitebg">
            <div className="formpageaspcl">
              <h6>Settings</h6>
              <SettingsForm
                settingsData={this.props.settings}
                onSubmit={this.handleSubmit}
                isLoading={this.props.isLoading}
              />
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    settings: state.settings.settings,
    user: state.auth.user,
    isLoading: state.ui.isLoading,
    showMessage: state.ui.showMessage,
    alertMessage: state.ui.alertMessage
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSettings: token => dispatch(fetchSettings(token)),
    updateSettings: (token, data, user) => dispatch(updateSettings(token, data, user)),
    hideAlertMessage: () => dispatch(hideAlertMessage())
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(Settings), axios);
