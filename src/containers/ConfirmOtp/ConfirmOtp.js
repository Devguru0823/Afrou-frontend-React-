import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import Input from '../../components/Input/Input';
import Footer from '../../components/Footer/Footer';
import DetailSection from '../Home/DetailSection';
import {onTryAuth, hideAlertMessage} from '../../redux/actions'
import '../Home/Home.css';

const otpControls = {
  otp: {
    elementType: 'input',
    elementConfig: {
      type: 'input',
      placeholder: 'Enter OTP'
    },
    value: '',
    validation: {
      required: true,
      minLength: 4,
      maxLength: 4
    },
    valid: false,
    touched: false
  },
  /*confirmPassword: {
    elementType: 'input',
    elementConfig: {
      type: 'password',
      placeholder: 'Confirm Password'
    },
    value: '',
    validation: {
      required: true,
      minLength: 6
    },
    valid: false,
    touched: false
  },*/
};


class ForgotPassword extends Component {
  state = {
    controls: otpControls,
    isLoading: false
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  /*updatePurchaseState = () => {
    let isValid = true;
    for (let key in this.state.controls) {
      console.log(key, this.state.controls[key].valid);
      isValid = this.state.controls[key].valid && isValid
    }
    //console.log(isValid);
    return isValid;
  };*/

  checkValidity = (value, rules) => {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid
    }

    return isValid;
  };

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      }
    };
    let formIsValid = true;
    for (let inputIdentifier in updatedControls) {
      formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
    }
    this.setState({controls: updatedControls, formIsValid: formIsValid});
  };

  submitHandler = (event) => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in this.state.controls) {
      formData[formElementIdentifier] = this.state.controls[formElementIdentifier].value;
    }
    this.props.onTryAuth({
      username: this.props.isMobileRegistration,
      otp: formData.otp,
    }, 'mobile');
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let authRedirect = null;

    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to="/afroswagger"/>
    }

    let form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
    ));

    return (
      <div>
        <section className="bannerhomepage">
          <div className="container">
            <div className="bannerconts">
              <div className={`rightformarear homelogarea`}>
                <div className="attrlogtext">AfroWorld
                  <small>Afro Swagger</small>
                </div>
                <div className="smallheader">Confirm OTP</div>
                <form onSubmit={this.submitHandler}>
                  <div className="row" style={{marginLeft: 0, marginRight: 0}}>
                    {form}
                  </div>
                  <button
                    className="buttonlogin"
                    disabled={this.props.isLoading || (!this.state.formIsValid)}
                    style={{marginTop: this.state.isEmailConfirmed ? '120px' : 0}}
                  >
                    CONFIRM OTP
                  </button>
                </form>
                <div className="clearfix"/>
                {/*<div className="isregister">
                  {this.state.isSignup ? 'Have an account? Please ' : 'Don\'t have an account? Please '} <a
                  onClick={this.switchAuthModeHandler} style={{cursor: 'pointer'}}>
                  {this.state.isSignup ? 'Login' : 'Register'} here</a>
                </div>*/}
                <div className="clearfix"/>
              </div>
            </div>
          </div>
        </section>
        <div className="clearfix"/>
        <DetailSection/>
        <Footer idName="homefooter"/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    isAuthenticated: !!state.auth.token,
    alertMessage: state.ui.alertMessage,
    showMessage: state.ui.showMessage,
    isMobileRegistration: state.auth.isMobileRegistration
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAuth: (authData, authMode) => dispatch(onTryAuth(authData, authMode)),
    hideAlertMessage: () => dispatch(hideAlertMessage())
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(ForgotPassword), axios);