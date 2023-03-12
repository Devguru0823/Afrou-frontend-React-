import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from '../../utils/axiosConfig';
import UserInfoNavBar from '../../components/UserInfoNavBar/UserInfoNavBar';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import FriendSuggestBox from '../../components/FriendSuggestBox/FriendSuggestBox';
import {
	fetchProfileDetails,
	updateUserDetails,
	fetchSuggestedFriends,
	resetProfileDetail,
	resetMostPopular
} from '../../redux/actions';

class Timeline extends Component {
	componentDidMount() {
		this.props.fetchProfileDetails(this.props.token);
		this.props.fetchSuggestedFriends(this.props.token);
	}

	componentWillUnmount() {
		this.props.resetProfileDetail();
		this.props.resetMostPopular();
	}

	render() {
		const { navCounters } = this.props;

		return (
			<section className='afroinneratear'>
				<div className='container'>
					<div className='height20' />
					<div className='allsubmenus' id='user-nav'>
						<UserInfoNavBar navCounters={navCounters} />
					</div>
					<div className='height50' />
					<div className='clearfix' />
					<div className='midleconarea'>
						{this.props.suggestedFriends ? (
							this.props.suggestedFriends.length === 0 ? (
								<div className='friendsuggestbx'>
									<div className='frsuggheaser'>Suggested People</div>
									<span className='no-friend-suggestion'>
										No suggestions to show
									</span>
								</div>
							) : (
								<FriendSuggestBox
									friends={this.props.suggestedFriends}
									token={this.props.token}
									history={this.props.history}
									fetchFriends={() =>
										this.props.fetchSuggestedFriends(this.props.token)
									}
								/>
							)
						) : (
							<div className='friendsuggestbx'>
								<div className='frsuggheaser'>Suggested People</div>
								<HorizontalLoader />
							</div>
						)}
					</div>
					<div className='clearfix' />

					{this.props.children}
				</div>
			</section>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		profileDetails: state.profile.profileDetails,
		token: state.auth.token,
		user: state.auth.user,
		mostPopularFeed: state.commonFeed.mostPopularFeed,
		suggestedFriends: state.profile.suggestedFriends,
		isLoading: state.ui.isLoading,
		navCounters: state.count.navCounters,
		ads: state.ads.ads
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchProfileDetails: (token, id) =>
			dispatch(fetchProfileDetails(token, id)),
		updateUserDetails: (user, newData) =>
			dispatch(updateUserDetails(user, newData)),
		fetchSuggestedFriends: (token) => dispatch(fetchSuggestedFriends(token)),
		resetProfileDetail: () => dispatch(resetProfileDetail()),
		resetMostPopular: () => dispatch(resetMostPopular())
	};
};

export default withRouter(
	withErrorHandler(
		connect(mapStateToProps, mapDispatchToProps)(Timeline),
		axios
	)
);
