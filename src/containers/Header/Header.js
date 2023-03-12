import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PostModal from '../../components/PostModal/PostModal';
import withErrorHandler from '../../utils/withErrorHandler';
import axios from '../../utils/axiosConfig';
import NotificationBox from './NotificationBox';
import UserDropdown from './UserDropdown';
import {
	fetchCounts,
	uiHideSidebar,
	uiShowSidebar,
	uiShowRightSidebar,
	uiHideRightSidebar,
	hideSlider
} from '../../redux/actions';

class Header extends Component {
	state = {
		fetched: false
	};

	_isMounted = true;
	componentDidMount() {
		if (this.props.isAuthenticated && this._isMounted) {
			this.props.fetchCounts(this.props.token);
		}

		this.intervalIdHeader = setInterval(
			() =>
				this.props.isAuthenticated && this._isMounted
					? this.props.fetchCounts(this.props.token)
					: null,
			6000
		);

		setTimeout(() => {
			clearInterval(this.intervalIdHeader);
		}, 15000);
	}

	componentWillUnmount() {
		clearInterval(this.intervalIdHeader);
		this._isMounted = false;
	}

	handleSideMenuClicked = () => {
		if (!this.props.showSidebar) {
			this.props.uiShowSidebar();
		} else {
			this.props.uiHideSidebar();
		}
	};

	handleSideMenuRightClicked = () => {
		if (!this.props.showRightSidebar) {
			this.props.uiShowRightSidebar();
		} else {
			this.props.uiHideRightSidebar();
		}
	};

	render() {
		return (
			<header>
				<div className='innerheader'>
					{this.props.isAuthenticated ? (
						<div className='leftmenu' onClick={this.handleSideMenuClicked}>
							<i className='fa fa-bars' />
						</div>
					) : null}
					{this.props.sliderVisible ? (
						<PostModal onHideSlider={this.props.hideSlider} />
					) : null}
					<div
						className='middlelogo'
						style={this.props.isAuthenticated ? null : styles.headerStyle}
					>
						<Link to='/afroswagger'>
							<img src='/images/logo-mobile.png' alt='image' />
						</Link>
					</div>
					{this.props.isAuthenticated ? (
						''
					) : (
						<div className='app-button-main'>
							<div className='app-button m-l-5'>
								<a
									target='_blank'
									href='https://apps.apple.com/us/app/afrocamgist/id1499804233'
								>
									<img
										src='/images/ap.png'
										alt='Download app'
										className='img-responsive'
									/>
								</a>
							</div>
							<div className='app-button'>
								<a
									target='_blank'
									href='https://play.google.com/store/apps/details?id=com.TBI.afrocamgist&amp;hl=en'
								>
									<img
										src='/images/gp.png'
										alt='Download app'
										className='img-responsive'
									/>
								</a>
							</div>
						</div>
					)}
					<div className='righticonuser'>
						{this.props.isAuthenticated ? (
							<ul>
								<NotificationBox
									notificationCount={this.props.notificationCount}
									notifications={this.props.notifications}
									token={this.props.token}
								/>
								{/* <li
                    className="posreltive"
                    onClick={this.handleSideMenuRightClicked}>
                    <i className="fa fa-envelope"/>
                    {
                      this.props.navCounters && this.props.navCounters.messages !== 0
                        ? <span>{this.props.navCounters.messages}</span>
                        : null
                    }
                  </li> */}
								<UserDropdown userInfo={this.props.user} />
							</ul>
						) : (
							<ul>
								<li className='posreltive' style={styles.headerMenuStyle}>
									<Link to='/login'>Login</Link>
								</li>
								<li className='posreltive' style={styles.headerMenuStyle}>
									<Link to='/register'>Register</Link>
								</li>
							</ul>
						)}
					</div>
				</div>
			</header>
		);
	}
}

const styles = {
	headerStyle: {
		width: 'auto',
		margin: '0px auto',
		display: 'inline-block'
	},
	headerMenuStyle: {
		paddingLeft: '10px'
	}
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: !!state.auth.token,
		token: state.auth.token,
		user: state.auth.user,
		showSidebar: state.ui.showSidebar,
		showRightSidebar: state.ui.showRightSidebar,
		notificationCount: state.count.notificationCount,
		notifications: state.count.notifications,
		navCounters: state.count.navCounters,
		sliderVisible: state.ui.sliderVisible
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchCounts: (token) => dispatch(fetchCounts(token)),
		uiShowSidebar: () => dispatch(uiShowSidebar()),
		uiHideSidebar: () => dispatch(uiHideSidebar()),
		uiShowRightSidebar: () => dispatch(uiShowRightSidebar()),
		uiHideRightSidebar: () => dispatch(uiHideRightSidebar()),
		hideSlider: () => dispatch(hideSlider())
	};
};

export default withRouter(
	withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(Header), axios)
);
