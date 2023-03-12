// jshint esversion:8
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'flatpickr/dist/themes/material_orange.css';
import 'emoji-mart/css/emoji-mart.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Home from '../Home/Home';
import Login from '../Login/Login';
import Registration from '../Registration/Registration';
import Signout from '../Signout/Signout';
import VerifyEmail from '../VerifyEmail/VerifyEmail';
import NotFound from '../ErrorPages/NotFound/NotFound';
import MainApp from './MainApp';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import RightSidebar from '../RightSidebar/RightSidebar';
import Footer from '../../components/Footer/Footer';
import RestrictedRoute from '../../hoc/RestrictedRoute/RestrictedRoute';
import { setInitUrl, checkAuthState } from '../../redux/actions';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import VerifyOtp from '../ConfirmOtp/ConfirmOtp';
import TermsAndPrivacy from '../TermsAndPrivacy/TermsAndPrivacy';
import TwoFactor from '../Two-Factor/TwoFactor';
import TwoFactorVerify from '../Two-Factor/TwoFactorVerify';
import Sitemap from '../../components/Sitemap/Sitemap';
import Ehealth from '../../routes/AfroEhealth/Ehealth';
import SuccessPage from '../../routes/AfroEhealth/Success/Success';
import Invoice from '../../routes/AfroEhealth/Invoice/Invoice';

class App extends Component {
	constructor(props) {
		super(props);
		if (props.initURL === '') {
			props.setInitUrl(this.props.history.location.pathname);
		}
		props.onTryAutoSignin();
	}

	render() {
		const { match, location, initURL, authUser } = this.props;

		if (location.pathname === '/') {
			if (authUser) {
				if (initURL === '' || initURL === '/') {
					return <Redirect to={'/afroswagger'} />;
				} else {
					return <Redirect to={initURL} />;
				}
			} else {
				return <Redirect to="/login" />;
			}
		}

		return (
			<div>
				<Header />
				<ToastContainer hideProgressBar autoClose={4000} />
				<Sidebar />
				<div className="partafterheader">
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/2fa" exact component={TwoFactor} />
						<Route path="/2fa/verify" component={TwoFactorVerify} />
						<Route
							path="/user/unsubscribe/:user_id"
							component={TwoFactorVerify}
						/>
						<Route path="/login" exact component={Login} />
						<Route path="/register" exact component={Registration} />
						<Route path="/logout" exact component={Signout} />
						<Route path="/verify-email/:token" exact component={VerifyEmail} />
						<Route path="/not-found" exact component={NotFound} />
						<Route path="/forgot-password" exact component={ForgotPassword} />
						<Route path="/verify-otp" exact component={VerifyOtp} />
						<Route
							path="/terms-and-privacy"
							exact
							component={TermsAndPrivacy}
						/>
						<Route path="/sitemap" exact component={Sitemap} />
						<Route
							path="/ehealth/subscription/history/:id"
							component={Invoice}
						/>
						<Route path="/ehealth/verify" component={SuccessPage} />
						<Route path="/ehealth" component={Ehealth} />
						<RestrictedRoute path={`${match.url}`} component={MainApp} />
					</Switch>
				</div>
				<RightSidebar />
				<Footer />
			</div>
		);
	}
}

const mapStateToProps = ({ auth }) => {
	const { initURL, token } = auth;
	const authUser = !!token;
	return { initURL, authUser };
};

const mapDispatchToProps = (dispatch) => {
	return {
		setInitUrl: (url) => dispatch(setInitUrl(url)),
		onTryAutoSignin: () => dispatch(checkAuthState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
