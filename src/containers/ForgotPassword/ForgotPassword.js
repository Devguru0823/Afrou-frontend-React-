import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axiosMain from "axios";

import withErrorHandler from "../../utils/withErrorHandler";
import axios from "../../utils/axiosConfig";
import Input from "../../components/Input/Input";
import Footer from "../../components/Footer/Footer";
import { onTryAuth, hideAlertMessage } from "../../redux/actions";
import { countryDialCodes } from "../../constants/countryDialCodes";
import { toastOptions } from "../../constants/toastOptions";
import "../Home/Home.css";


const controls = {

  countryTelephoneCode: {
    elementType: "reactSelect",
    elementConfig: {
      options: countryDialCodes.map((dialCode) => ({
        value: dialCode.dial_code.substr(1),
        label: `${dialCode.dial_code} ${dialCode.name}`,
      })),
      styles: {
        container: (provided) => ({ ...provided, marginBottom: "26px" }),
        menuList: (provided) => ({ ...provided, maxHeight: "190px" }),
        control: (provided) => ({ ...provided, height: "43px" }),
      },
      isDisabled: false,
    },
    value: { label: "+93 Afghanistan", value: "93" },
    validation: {},
    valid: true,
    onlyClassName: "mobile-code-choose",
    onlyOuterClassName: "col-md-6 regcountry",
  },

  username: {
    elementType: "input",
    elementConfig: {
      type: "input",
      placeholder: "Email or Mobile",
    },
    value: "",
    validation: {
      required: true,
      isEmailOrPhone: true,
    },
    valid: false,
    touched: false,
    outerClassName: "col-12",
  },
}

// const countryCodeControls = {
//   countryTelephoneCode: {
//     elementType: "reactSelect",
//     elementConfig: {
//       options: countryDialCodes.map((dialCode) => ({
//         value: dialCode.dial_code.substr(1),
//         label: `${dialCode.dial_code} ${dialCode.name}`,
//       })),
//       styles: {
//         container: (provided) => ({ ...provided, marginBottom: "26px" }),
//         menuList: (provided) => ({ ...provided, maxHeight: "190px" }),
//         control: (provided) => ({ ...provided, height: "43px" }),
//       },
//       isDisabled: false,
//     },
//     value: { label: "+213 Algeria", value: "213" },
//     validation: {},
//     valid: true,
//     onlyClassName: "mobile-code-choose",
//     onlyOuterClassName: "col-md-6 regcountry",
//   },
// };

const otpControls = {
  otp: {
    elementType: "input",
    elementConfig: {
      type: "password",
      placeholder: "Enter OTP",
    },
    value: "",
    validation: {
      required: true,
      minLength: 4,
      maxLength: 4,
    },
    valid: false,
    touched: false,
    outerClassName: "col-12 loguser",
  },
  password: {
    elementType: "input",
    elementConfig: {
      type: "password",
      placeholder: "Password",
    },
    value: "",
    validation: {
      required: true,
      minLength: 6,
    },
    valid: false,
    touched: false,
    outerClassName: "col-12 logpass",
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
    controls: controls,
    isEmailConfirmed: false,
    confirmedEmail: true,
    isLoading: false,
    formIsValid: false,
    countryCallingCode: null,
    dataLoaded: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (state.countryCallingCode !== null && !state.dataLoaded) {
      return {
        ...state,
        dataLoaded: true,
        controls: {
          ...state.controls,
          countryTelephoneCode: {
            ...state.controls.countryTelephoneCode,
            value: state.countryCallingCode,
          }
        },
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.showMessage) {
      toast.success(this.props.alertMessage, toastOptions);
      this.props.hideAlertMessage();
      this.setState({ controls: controls });
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this._mounted = true;
    axiosMain
      .get(
        `https://api.ipgeolocation.io/ipgeo?apiKey=bbf98c92554245b2adf35badb5b2da07`
      )
      .then((response) => {
        console.log(response);
        if (this._mounted) {
          this.setState({
            countryCallingCode: {
              value: response.data.calling_code.substr(1),
              label: `${response.data.calling_code} ${response.data.country_name}`,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    this._mounted = false;
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
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isEmailOrPhone) {
      const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      const mobilePattern = /(\d{10})|(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})$/g;
      isValid =
        (emailPattern.test(value) || mobilePattern.test(value)) && isValid;
    }

    return isValid;
  };

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true,
      },
    };
    let formIsValid = true;
    for (let inputIdentifier in updatedControls) {
      formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
    }
    this.setState({ controls: updatedControls, formIsValid: formIsValid });
  };

  submitHandler = (event) => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in this.state.controls) {
      if (formElementIdentifier === "username") {
        let username = this.state.controls[formElementIdentifier].value;
        const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        const mobilePattern = /(\d{10})|(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
        if (mobilePattern.test(username)) {
          if (username.charAt(0) === "0") {
            username = username.substr(1);
          }
          username = `${this.state.countryCallingCode.value}${username}`;
        } else {
          if (!emailPattern.test(username)) {
            return toast.error(
              "Please enter a valid email or mobile number",
              toastOptions
            );
          }
        }
        formData[formElementIdentifier] = username;
      } else {
        formData[formElementIdentifier] = this.state.controls[
          formElementIdentifier
        ].value;
      }
    }
    const formDataCopy = formData;
    let url = "/users/request-password-reset";
    if (this.state.isEmailConfirmed) {
      if(formData.password){
        url = "/users/verify-password-reset";
      }else{
        url = "/users/verify-email-otp";
      }
      let username = this.state.confirmedEmail;
      if (username.charAt(0) === "0") {
        username = username.substr(1);
      }
      const mobilePattern = /(\d{10})|(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
      if (mobilePattern.test(username)) {
        formData.username = `${this.state.countryCallingCode.value}${username}`;
      } else {
        formData.username = username;
      }
    }
    this.setState({ isLoading: true });
    axios
      .post(url, formData)
      .then((response) => {
        console.log(response);
         if (this.state.isEmailConfirmed) {
           if (response.status === 200) {
              toast.success(
                "Password reset successful. Please login again to continue",
                toastOptions
              );
              this.props.history.push("/login");
           }
         } else {
          if (response.status === 200) {
            toast.success(
              "Request successful. Please check your email for otp",
              toastOptions
            );
            this.setState({ formIsValid: false });
          }
        }
        this.setState((prevState) => {
          if (prevState.isEmailConfirmed) {
            return {
              isLoading: false,
            };
          } else {
            return {
              isLoading: false,
              isEmailConfirmed: true,
              confirmedEmail: prevState.controls.username.value,
              controls: otpControls,
            };
          }
        });
        this.props.onClose();
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
    //this.props.onSubmit(formData);
  };

  render() {
    if (this.props.location.search) {
      this.props.history.push("/");
      this.props.history.go(0);
    }

    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let form = formElementsArray.map((formElement) => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        label={formElement.config.label}
        className={formElement.config.className}
        outerClassName={formElement.config.outerClassName}
        onlyClassName={formElement.config.onlyClassName}
        onlyOuterClassName={formElement.config.onlyOuterClassName}
        autoComplete="off"
        changed={(event) => this.inputChangedHandler(event, formElement.id)}
      />
    ));

    return (
      <div>
        <section className="bannerhomepage">
          <div className="container">
            <div className="bannerconts">
              <div className={`rightformarear homelogarea`}>
                <div className="attrlogtext">
                  AfroWorld
                  <small>Afro Swagger</small>
                </div>
                <div className="smallheader">Forgot Password</div>
                <form onSubmit={this.submitHandler}>
                  <div className="row">{form}</div>
                  <button
                    className="buttonlogin"
                    disabled={this.props.isLoading || !this.state.formIsValid}
                    style={{
                      marginTop: this.state.isEmailConfirmed ? "120px" : 0,
                    }}
                  >
                    {this.state.isEmailConfirmed
                      ? "RESET PASSWORD"
                      : "REQUEST OTP"}
                  </button>
                </form>
                <div className="clearfix" />
                {/*<div className="isregister">
                  {this.state.isSignup ? 'Have an account? Please ' : 'Don\'t have an account? Please '} <a
                  onClick={this.switchAuthModeHandler} style={{cursor: 'pointer'}}>
                  {this.state.isSignup ? 'Login' : 'Register'} here</a>
                </div>*/}
                <div className="isregister">
                  <Link to="/">Return to home</Link>
                </div>
                <div className="clearfix" />
              </div>
            </div>
          </div>
        </section>
        <div className="clearfix" />
        <Footer idName="homefooter" />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.ui.isLoading,
    isAuthenticated: !!state.auth.token,
    alertMessage: state.ui.alertMessage,
    showMessage: state.ui.showMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAuth: (authData, authMode) => dispatch(onTryAuth(authData, authMode)),
    hideAlertMessage: () => dispatch(hideAlertMessage()),
  };
};

export default withErrorHandler(
  connect(mapStateToProps, mapDispatchToProps)(ForgotPassword),
  axios
);
