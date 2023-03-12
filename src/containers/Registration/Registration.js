import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import axiosMain from "axios";

import withErrorHandler from "../../utils/withErrorHandler";
import axios from "../../utils/axiosConfig";
import Input from "../../components/Input/Input";
import Footer from "../../components/Footer/Footer";
import { onTryAuth, hideAlertMessage } from "../../redux/actions";
import { toastOptions } from "../../constants/toastOptions";
import { countryDialCodes } from "../../constants/countryDialCodes";
import "../Home/Home.css";

import GoogleLogin from 'react-google-login';
const controls = {
  emailMobileRadio: {
    elementType: "radio",
    elementConfig: [
      {
        type: "radio",
        name: "mobileOrEmail",
        id: "emailId",
        value: "emailMode",
      },
      {
        type: "radio",
        name: "mobileOrEmail",
        id: "mobileId",
        value: "mobileMode",
      },
    ],
    value: "emailMode",
    validation: {
      required: true,
    },
    label: [
      <label className="form-check-label" htmlFor="emailId">
        Email
      </label>,
      <label className="form-check-label" htmlFor="mobileId">
        Mobile
      </label>,
    ],
    valid: true,
    touched: true,
    onlyClassName: "form-check-input",
    onlyOuterClassName:
      "form-check form-check-inline col-md-12 radio-mode displayNone",
  },
  first_name: {
    elementType: "input",
    elementConfig: {
      type: "input",
      placeholder: "First Name",
    },
    value: "",
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    outerClassName: "col-md-6 regfname",
  },
  last_name: {
    elementType: "input",
    elementConfig: {
      type: "input",
      placeholder: "Last Name",
    },
    value: "",
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    outerClassName: "col-md-6 reglname",
  },
  email: {
    elementType: "input",
    elementConfig: {
      type: "input",
      placeholder: "Email or Phone",
      /*'data-tip': 'tooltip',
      'data-for': 'emailOrPhone'*/
    },
    value: "",
    validation: {
      required: true,
      isEmailOrPhone: true,
    },
    valid: false,
    touched: false,
    outerClassName: "col-md-6 regemail",
  },
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
    value: { label: "+213 Algeria", value: "213" },
    validation: {},
    valid: true,
    onlyClassName: "mobile-code-choose",
    onlyOuterClassName: "col-md-6 regcountry",
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
    outerClassName: "col-md-6 regpassword",
  },
  country: {
    elementType: "reactSelect",
    elementConfig: {
      options: countryDialCodes.map((country) => ({
        value: country.name,
        label: `${country.name} (${country.code})`,
      })),
      styles: {
        container: (provided) => ({ ...provided, marginBottom: "26px" }),
        menuList: (provided) => ({ ...provided, maxHeight: "190px" }),
        control: (provided) => ({ ...provided, height: "43px" }),
      },
      isDisabled: false,
    },
    value: { label: "Afghanistan (AF)", value: "Afghanistan" },
    validation: {},
    valid: true,
    onlyClassName: "mobile-code-choose",
    onlyOuterClassName: "col-md-6 regcountry displayNone",
  },
};

class Home extends Component {
  state = {
    controls: controls,
    isSignup: true,
    dataLoaded: false,
    countryCallingCode: null,
    country: '',
    countries: []
  };

  _isMounted = true;

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

  componentDidUpdate(prevProps, prevState) {
    if (this._isMounted && this.props.showMessage) {
      toast.success(this.props.alertMessage, toastOptions);
      this.props.hideAlertMessage();
      this.setState({ controls: controls });
    }
    /*if (prevState.controls.emailMobileRadio.value !== this.state.controls.emailMobileRadio.value) {
      this.setState(state => ({
        ...state,
        controls: {
          ...state.controls,
          email: {
            ...state.controls.email,
            elementConfig: {
              ...state.controls.email.elementConfig,
              placeholder: this.state.controls.emailMobileRadio.value === 'emailMode'
                ? 'Please enter email address'
                : 'Please enter phone number'
            }
          },
          countryTelephoneCode: {
            ...state.controls.countryTelephoneCode,
            elementConfig: {
              ...state.controls.countryTelephoneCode.elementConfig,
              isDisabled: this.state.controls.emailMobileRadio.value === 'emailMode'
            }
          }
        }
      }));
    }*/
  }

  componentDidMount() {

    const getUserCountry = async () => {
      try {
        const userCountry = await axiosMain.get('https://api.ipgeolocation.io/ipgeo?apiKey=bbf98c92554245b2adf35badb5b2da07');
        console.log(userCountry.data);
        this.setState({ countryCallingCode: {
          value: userCountry.data.calling_code.substr(1),
          label: `${userCountry.data.calling_code} ${userCountry.data.country_name}`,
        }, country: {
          label: `${userCountry.data.country_name} (${userCountry.data.country_code2})`,
          value: `${userCountry.data.country_name}`
        }}) 
      } catch (error) {
        console.log(error);
      }
    }

    if(this._isMounted) {
      getUserCountry();
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
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

    if (rules.isEmailOrPhone) {
      const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      const mobilePattern = /(\d{10})|(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
      isValid =
        (emailPattern.test(value) || mobilePattern.test(value)) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
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
  responseGoogle = (response) => {
    this.props.onTryAuth(
      {
        username: response.profileObj.name,
        email: response.profileObj.email,
        google_id: response.profileObj.googleId,
        first_name: response.profileObj.givenName,
        last_name: response.profileObj.familyName,
        type: 'google'
      },
      "google"
    );
  }

  submitHandler = (event) => {
    event.preventDefault();
    let username = this.state.controls.email.value;
    const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    const mobilePattern = /(\d{10})|(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
    if (mobilePattern.test(username)) {
      if (username.charAt(0) === "0") {
        username = username.substr(1);
      }
      username = `${this.state.controls.countryTelephoneCode.value.value}${username}`;
    } else {
      if (!emailPattern.test(username)) {
        return toast.error(
          "Please enter a valid email or mobile number",
          toastOptions
        );
      }
    }
    const authData = {
      first_name: this.state.controls.first_name.value,
      last_name: this.state.controls.last_name.value,
      username: username,
      password: this.state.controls.password.value,
    };
    if (this.state.formIsValid) {
      if (this.state.isSignup) {
        this.props.onTryAuth(authData, "signup");
      } else {
        this.props.onTryAuth(
          {
            username: authData.username,
            password: authData.password,
          },
          "login"
        );
      }
    } else {
      toast.warn(
        "Please make sure all fields are filled out correctly",
        toastOptions
      );
    }
  };

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/afroswagger" },
    };

    let authRedirect = null;

    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={from} />;
    }

    let otpRedirect = null;

    if (this.props.isMobileRegistration) {
      otpRedirect = <Redirect to="/verify-otp" />;
    }

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

    let errorMessage = null;

    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }

    return (
      <div>
        <section className="bannerhomepage">
          <div className="container" style={{ paddingBottom: "10px" }}>
            <div className="bannerconts">
              <div
                className={
                  this.state.isSignup
                    ? `rightformarear homeregarea`
                    : `rightformarear homelogarea`
                }
              >
                <div className="attrlogtext">
                  AfroWorld
                  <small>Afro Swagger</small>
                </div>
                {errorMessage}
                {otpRedirect}
                {!this.state.isSignup ? (
                  <p style={{ color: "white" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                ) : null}
                <div className="smallheader">
                  {this.state.isSignup ? "Sign up" : "Login"}
                </div>
                <form onSubmit={this.submitHandler} autoComplete="off">
                  <div className="row">{form}</div>
                  {/*<div style={{width: '100%', clear: 'both', color: "#fff", fontSize: '12px'}}>
                    <p>** Please enter country code at the beginning of your phone number if you
                      choose to register with your phone. **</p>
                  </div>*/}
                  <button
                    className="buttonlogin"
                    disabled={this.props.isLoading}
                  >
                    {this.state.isSignup ? "SIGNUP" : "LOGIN"}
                  </button>
                  <GoogleLogin
                    clientId="881510618695-26q6v8mpcnji2am2t61m73dao9c5a7p5.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
                    buttonText="LOGIN WITH GOOGLE"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    className="googlebtnlogin"
                  />
                </form>
                <ReactTooltip
                  id="emailOrPhone"
                  event="focusin"
                  eventOff="focusout"
                  getContent={() =>
                    this.state.controls.emailMobileRadio.value ===
                      "mobileMode" ? (
                      <p>
                        Please add phone number without the country code e.g.
                        9000090000
                      </p>
                    ) : (
                      <p>Please enter email address</p>
                    )
                  }
                  effect="solid"
                  place={"top"}
                  border={true}
                  type={"dark"}
                  className={"tooltip-react"}
                />
                <div className="isregister">
                  Have an account? Please <Link to="/login">Login here</Link>
                </div>
                <div className="clearfix" />
                {this.state.isSignup ? (
                  <div
                    style={{
                      width: "100%",
                      clear: "both",
                      marginTop: "20px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  >
                    <p>
                      By signing up, you agree to our
                      <Link to="/terms-and-privacy" className="terms">
                        Terms
                      </Link>
                      and that you have read our
                      <Link to="/terms-and-privacy#terms-2" className="terms">
                        Privacy Policy
                      </Link>{" "}
                      and
                      <Link to="/terms-and-privacy#terms-5" className="terms">
                        Content Policy
                      </Link>
                      .
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="lefttextarear">{authRedirect}</div>
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
    isMobileRegistration: state.auth.isMobileRegistration,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAuth: (authData, authMode) => dispatch(onTryAuth(authData, authMode)),
    hideAlertMessage: () => dispatch(hideAlertMessage()),
  };
};

export default withErrorHandler(
  connect(mapStateToProps, mapDispatchToProps)(Home),
  axios
);
