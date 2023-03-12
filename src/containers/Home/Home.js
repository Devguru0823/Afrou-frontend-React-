import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {toast} from 'react-toastify';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import Footer from '../../components/Footer/Footer';
import DetailSection from './DetailSection';
import {onTryAuth, hideAlertMessage} from '../../redux/actions'
import {toastOptions} from '../../constants/toastOptions';
import { isAndroid, isIOS } from 'react-device-detect';
import swal from '@sweetalert/with-react';
import './Home.css';
import './Popup.css'

class Home extends Component {
  componentDidUpdate() {
    if(this.props.showMessage) {
      toast.success(this.props.alertMessage, toastOptions);
      this.props.hideAlertMessage();
    }
  }

  componentDidMount() {
// Check if device is android
    if (isAndroid) {
      // Render android app download popup
      swal(
          <div>
              <h2>Download Afrocamgist Now!</h2>
              <div id="popup-content">
                  <a href="https://play.google.com/store/apps/details?id=com.TBI.afrocamgist&hl=en">
                      <button type="button">
                          <img src="/images/gp.png" alt="Download app" class="img-responsive" />
                      </button>
                  </a>
              </div>
          </div>, {
              buttons: false
          })
  }

  // Check if device is iOS
  if (isIOS) {
    // Render iOS app download popup
      swal(
          <div>
              <h2>Download Afrocamgist Now!</h2>
              <div id="popup-content">
                  <a href="https://apps.apple.com/us/app/afrocamgist/id1499804233">
                      <button type="button">
                          <img src="/images/ap.png" alt="Download app" class="img-responsive" />
                      </button>
                  </a>
              </div>
          </div>, {
              buttons: false
          })
  }

    let myIndex = 0;
    const carousel = () => {
      let i;
      const x = document.getElementsByClassName("mySlides");
      for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
      }
      myIndex++;
      if (myIndex > x.length) {myIndex = 1}
      x[myIndex-1].style.display = "block";
    };
    carousel();
    this.carouselInterval = setInterval(carousel, 4500);

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    clearInterval(this.carouselInterval);
  }

  render() {
    const {from} = this.props.location.state || {from: {pathname: '/afroswagger'}};

    let authRedirect = null;

    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={from}/>
    }

    let otpRedirect = null;

    if (this.props.isMobileRegistration) {
      otpRedirect = <Redirect to="/verify-otp"/>
    }

    if (this.props.location.search) {
      this.props.history.push('/');
      this.props.history.go(0);
    }

    return (
      <div>
        <section className="bannerhomepage">
          <div className="container">
            <div className="bannerconts">
              <div className="landing-header"><h1>Welcome To Afroworld</h1></div>
              <div className="lefttextarear">
                {authRedirect}
                {otpRedirect}
                <div className="banarearr">
                  <div className="banleftprt"><img src="/images/banleft.png" alt="left banner" className="img-responsive"/>
                  </div>
                  <div className="banrightprt" style={{backgroundImage: 'url(/images/banmob.png)'}}>
                    <div className="w3-content w3-section">
                      <img className="mySlides w3-animate-top" src="/images/innerban.png" alt="inner banner" style={{width: '100%'}}/>
                      <img className="mySlides w3-animate-left" src="/images/innerban1.png" alt="inner banner 1" style={{width: '100%'}}/>
                      <img className="mySlides w3-animate-bottom" src="/images/innerban2.png" alt="inner banner 2" style={{width: '100%'}}/>
                      <img className="mySlides w3-animate-right" src="/images/innerban3.png" alt="inner banner 3" style={{width: '100%'}}/>
                    </div>
                  </div>
                </div>
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

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(Home), axios);