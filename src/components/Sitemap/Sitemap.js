import React, { useEffect } from 'react';
import './Sitemap.css';

function Sitemap() {
	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			window.scrollTo(0, 0);
		}

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div id='sitemap-content'>
			<div id='top'>
				<nav>afrocamgist.com HTML Site Map</nav>
				<h3>
					<span>
						Last updated: 2021, October 25
						<br />
						Total pages: 1
					</span>
					<a href='https://afrocamgist.com'>afrocamgist.com Homepage</a>
				</h3>
			</div>
			<div id='cont'>
				<ul class='level-0'>
					<li class='lhead'>
						/ <span class='lcount'>1 pages</span>
					</li>

					<li class='lpage last-page'>
						<a href='https://afrocamgist.com/' title='Afrocamgist'>
							Afrocamgist
						</a>
					</li>
				</ul>
				{/*
        Please note:
        You are not allowed to remove the copyright notice below.
        Thank you!*/}
			</div>
			<div id='footer'>
				Page created with{' '}
				<a target='_blank' href='https://afrocamgist.com/'>
					Afro camgist, African Social Network Site, Media & Network App
				</a>{' '}
				| Copyright &copy; 2020-2025 XML-Sitemaps.com
			</div>
		</div>
	);
}

export default Sitemap;
