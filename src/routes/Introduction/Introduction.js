import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from "react-router-dom";

import UserDetails from "./forms/UserDetails";
import PersonalDetails from "./forms/PersonalDetails";
import Interests from "./forms/Interestes";
import Confirm from "./forms/Confirm";
import {updateSettings} from '../../redux/actions';

class Introduction extends Component {
  state = {
    step: 1,
    userData: {},
    personalData: {},
    interestData: {}
  };

  handleNextStep = () => {
    this.setState(prevState => ({step: prevState.step + 1}));
  };

  handlePrevStep = () => {
    this.setState(prevState => ({step: prevState.step - 1}));
  };

  handleUserDetails = formData => {
    this.setState(prevState => ({userData: {...prevState.userData, ...formData}}));
    this.handleNextStep();
  };

  handlePersonalDetails = formData => {
    this.setState(prevState => ({personalData: {...prevState.personalData, ...formData}}));
    this.handleNextStep();
  };

  handleInterestDetails = formData => {
    this.setState(prevState => ({
      interestData: {
        ...prevState.interestData,
        sports_interests: [...formData.sports_interests]
      }
    }));
    this.handleNextStep();
  };

  handleSubmit = () => {
    const {userData, personalData, interestData} = this.state;
    const allData = {...userData, ...personalData, ...interestData, introduced: true};
    this.props.updateSettings(this.props.token, allData, this.props.user);
  };

  render() {
    let content = null;
    const {userData, personalData, interestData} = this.state;
    const allData = {...userData, ...personalData, ...interestData};
    const headingText = [
      'Tell us something about yourself',
      'A little bit more...',
      'Things that keep you hooked',
      'Please confirm your details'
    ];

    if (this.state.step === 1) {
      content = (
        <UserDetails
          settingsData={userData}
          onSubmit={this.handleUserDetails}
          isLoading={this.props.isLoading}
        />
      );
    }

    if (this.state.step === 2) {
      content = (
        <PersonalDetails
          settingsData={personalData}
          onSubmit={this.handlePersonalDetails}
          isLoading={this.props.isLoading}
          prevStep={this.handlePrevStep}
        />
      );
    }

    if (this.state.step === 3) {
      content = (
        <Interests
          settingsData={interestData}
          onSubmit={this.handleInterestDetails}
          isLoading={this.props.isLoading}
          prevStep={this.handlePrevStep}
        />
      );
    }

    if (this.state.step === 4) {
      content = (
        <Confirm
          allData={allData}
          onSubmit={this.handleSubmit}
          isLoading={this.props.isLoading}
          prevStep={this.handlePrevStep}
        />
      );
    }

    let redirect = null;
    if (this.props.user.introduced) {
      redirect = <Redirect to="/afroswagger"/>
    }

    return (
      <div style={styles.container}>
        {redirect}
        <div className="awhitebg">
          <div className="formpageaspcl">
            <h6 style={styles.headingLeft}>
              {
                this.state.step === 1 ? headingText[0] :
                  this.state.step === 2 ? headingText[1] :
                    this.state.step === 3 ? headingText[2] :
                      headingText[3]
              }
            </h6>
            <p style={styles.headingRight}>Page {this.state.step} of 4</p>
            {content}
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    width: '100%',
    position: 'relative',
    padding: '10px 10px',
    margin: '0px auto',
    clear: 'both'
  },
  headingLeft: {
    display: 'inline-block',
    fontSize: '18px'
  },
  headingRight: {
    display: 'inline-block',
    float: 'right',
    fontSize: '10px'
  },
  selectPageHeight: {
    height: '400px'
  }
};

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    token: state.auth.token,
    user: state.auth.user
  }
};

const mapDispatchToProps = dispatch => {
  return {
    updateSettings: (token, data, user) => dispatch(updateSettings(token, data, user, 'intro'))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Introduction);
