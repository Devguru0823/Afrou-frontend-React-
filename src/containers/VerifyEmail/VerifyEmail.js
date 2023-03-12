import React, { Component } from "react";
import { connect } from "react-redux";
import { onTryAuth } from "../../redux/actions";
import "../Home/Home.css";
import withErrorHandler from "../../utils/withErrorHandler";
import axios from "../../utils/axiosConfig";
import Loader from "../../components/Loders/CircleLoderWithBackground/CircleLoader";

class VerifyEmail extends Component {
  state = {
    submitted: false,
    isOptionSelected: false,
  };

  componentDidMount() {
    console.log(this.props);
    if (!this.props.isAuthenticated) {
      this.props
        .onTryAuth({ verification_token: this.props.match.params.token },"email",1)
        .then((res) => {
          this.setState({ submitted: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    clearTimeout(this.onSuccessRedirect);
  }

  onClickContinueWithWeb = () => {
    if (this.props.isAuthenticated) {
      this.onSuccessRedirect = setTimeout(
        () => this.props.history.replace("/profile/settings/introduction"),
        10
      );
    }
  };

  render() {
    const { submitted } = this.state;
    return (
      <div className="container">
        {submitted ? (
          <div className="popup-container">
            <div className="popup-block" style={{ display: "block" }}>
              <a className="popup-option" href="afrocamgist://viaVerification">
                Continue With App
              </a>
              <div
                className="popup-option no-bottom-border"
                onClick={this.onClickContinueWithWeb}
              >
                Continue With Web
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-12">
              <div className="error-template">
                <h1>Verifying your email..</h1>
                <div className="error-details">
                  <Loader />
                  Please wait for a moment
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.ui.isLoading,
    isAuthenticated: !!state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAuth: (authData, authMode, isMobile) =>
      dispatch(onTryAuth(authData, authMode, isMobile)),
  };
};

export default withErrorHandler(
  connect(mapStateToProps, mapDispatchToProps)(VerifyEmail),
  axios
);
