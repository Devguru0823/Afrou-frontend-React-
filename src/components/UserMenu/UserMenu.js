import React from 'react';
import { NavLink } from 'react-router-dom';

const userMenu = (props) => {
	return (
		<div className="insiderarea">
			{!props.ifOthersProfile ? (
				<div className="othersmenuleft">
					<ul>
					<li>
							<NavLink activeClassName="nav-active" to="/ehealth">
								Ehealth
							</NavLink>
						</li>
						<li>
							<NavLink activeClassName="nav-active" to="/profile/photos">
								Photos
							</NavLink>
						</li>
						<li>
							<NavLink activeClassName="nav-active" to="/profile/settings">
								Settings
							</NavLink>
						</li>
						<li>
							<NavLink activeClassName="nav-active" to="/find-friends">
								Find Users
							</NavLink>
						</li>
						<li>
							<NavLink activeClassName="nav-active" to="/find-groups">
								Find Groups
							</NavLink>
						</li>
						<li>
							<NavLink activeClassName="nav-active" to="/advert">
								Create Advert
							</NavLink>
						</li>
					</ul>
				</div>
			) : null}
			{props.ifOthersProfile && !props.isMyFriend ? (
				<div className="othersmenuleft" id="othermenu">
					<ul>
						<li>Add this person as a friend to check out photos</li>
					</ul>
				</div>
			) : null}
			{props.isMyFriend ? (
				<div className="othersmenuleft" id="othermenu">
					<ul>
						<li>
							<NavLink
								activeClassName="nav-active"
								to={`/profile/${props.userId}/photos`}
							>
								Photos
							</NavLink>
						</li>
					</ul>
				</div>
			) : null}
		</div>
	);
};

export default userMenu;
