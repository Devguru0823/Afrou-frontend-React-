import React from 'react';
import { Link } from 'react-router-dom';

const userDropdownItems = (props) => {
	const { friend_ids, follower_ids, following_ids } = props.userInfo;
	return (
		<ul>
			<li>
				<Link to="/profile">My Profile</Link>
			</li>
			<li>
				<Link to="/profile/photos">Photos</Link>
			</li>
			<li>
				<Link to="/friends">
					Role Models <span>{friend_ids ? friend_ids.length : 0}</span>
				</Link>
			</li>
			<li>
				<Link to="/followers">
					Followers <span>{follower_ids ? follower_ids.length : 0}</span>
				</Link>
			</li>
			<li>
				<Link to="/followings">
					Following <span>{following_ids ? following_ids.length : 0}</span>
				</Link>
			</li>
			<li>
				<Link to="/profile/settings">Setting</Link>
			</li>
			<li>
				<Link to="/ehealth">Ehealth</Link>
			</li>
			<li>
				<Link to="/logout">Logout</Link>
			</li>
		</ul>
	);
};

export default userDropdownItems;
