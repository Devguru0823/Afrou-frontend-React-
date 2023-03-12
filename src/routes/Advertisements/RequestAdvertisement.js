import React, {Component} from 'react';
import {connect} from 'react-redux';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import ProfileLayout from '../../hoc/Profile/Profile';
import RequestForm from './RequestAdvertisementForm';

class RequestAdvertisement extends Component {
  state = {
    isLoading: false,
    submitted: false
  };

  handleSubmit = data => {
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };
    this.setState({isLoading: true});
    axios.post(`/ad-request`, data, config)
      .then(() => {
        this.setState({isLoading: false, submitted: true});
      })
      .catch(err => {
        console.log(err);
        this.setState({isLoading: false});
      });
  };

  hideMessage = () => {
    setInterval(() => this.setState({submitted: false}), 3000)
  };

  render() {
    let message = null;
    if (!this.state.isLoading && this.state.submitted) {
      this.hideMessage();
      message = (
        <div className="alert alert-success">
          <strong>Success!</strong> Ad request posted successfully.
        </div>
      );
    }

    return (
      <ProfileLayout>
        <div className="midleconarea">
          <div className="awhitebg">
            <div className="formpageaspcl">
              <h6>Request for advertisement</h6>
              {message}
              <RequestForm profileDetails={this.props.profileDetails} onSubmit={this.handleSubmit}/>
            </div>
          </div>
        </div>
      </ProfileLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    profileDetails: state.profile.profileDetails,
    token: state.auth.token
  }
};

export default withErrorHandler(connect(mapStateToProps)(RequestAdvertisement), axios);
