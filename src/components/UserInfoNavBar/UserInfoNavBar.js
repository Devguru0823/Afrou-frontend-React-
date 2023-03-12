import React from 'react';
import { NavLink } from 'react-router-dom';

const userInfoNavBar = (props) => {
	const { navCounters } = props;
	let options = (
		<ul>
			<li>
				<NavLink to='/afroswagger' activeClassName='active'>
					<span>
						<i className='fa fa-thermometer-empty' aria-hidden='true' />
					</span>
					Afro Swagger
				</NavLink>
			</li>
			<li>
				{/* <NavLink to="/afrotalent" activeClassName="active">
          <span><i className="fa fa-thermometer-quarter" aria-hidden="true"/></span>
          Afro Talent
        </NavLink> */}
			</li>
			<li>
				<NavLink to='/afrogroup' activeClassName='active'>
					<span>
						<i className='fa fa-thermometer-half' aria-hidden='true' />
					</span>
					Afro Group
				</NavLink>
			</li>
			<li>
				<NavLink to='/hashtags' activeClassName='active'>
					<span>
						<i className='fa fa-thermometer-full' aria-hidden='true' />
					</span>
					HashTag
				</NavLink>
			</li>
			<li>
				<NavLink to='/messages' activeClassName='active'>
					<span>
						<i
							className='fa fa-comments'
							id='messageIcon'
							aria-hidden='true'
						></i>
						{navCounters && navCounters.messages !== 0 ? (
							<b className='counter'>{navCounters.messages}</b>
						) : null}
					</span>
					Messages
				</NavLink>
			</li>
		</ul>
	);

	if (navCounters) {
		options = (
			<ul>
				<li>
					<NavLink to='/afroswagger' activeClassName='active'>
						<span>
							<i className='fa fa-thermometer-empty' aria-hidden='true' />
						</span>
						Afro Swagger
					</NavLink>
				</li>
				{/* <li>
          <NavLink to="/afrotalent" activeClassName="active">
            <span><i className="fa fa-thermometer-quarter" aria-hidden="true"/></span>
            Afro Talent
          </NavLink>
        </li> */}
				<li>
					<NavLink to='/afrogroup' activeClassName='active'>
						<span>
							<i className='fa fa-thermometer-half' aria-hidden='true' />
						</span>
						Afro Group
					</NavLink>
				</li>
				<li>
					<NavLink to='/hashtags' activeClassName='active'>
						<span>
							<i className='fa fa-thermometer-full' aria-hidden='true' />
						</span>
						HashTag
					</NavLink>
				</li>
				<li>
					<NavLink to='/messages' activeClassName='active'>
						<span>
							<i
								className='fa fa-comments'
								id='messageIcon'
								aria-hidden='true'
							></i>
							{navCounters.messages !== 0 ? (
								<b className='counter'>{navCounters.messages}</b>
							) : null}
						</span>
						Messages
					</NavLink>
				</li>
			</ul>
		);
	}

	return options;
};

export default userInfoNavBar;
