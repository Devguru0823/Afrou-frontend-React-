import React from 'react';
import { Link } from 'react-router-dom';

const footer = (props) => (
	<footer className='footer' id={props.idName || ''}>
		<div className='topfooter'>
			<div className='container'>
				<div className='row'>
					<div className='col-md-5'>
						<div className='footerlogo'>
							<a href='index.php'>
								<img
									src='/images/footerlogo.png'
									alt='imgage'
									className='img-responsive'
								/>
							</a>
						</div>
						<div className='footerabout'>
							<h1>THE BEAUTY OF DIVERSITY BUT SAME PEOPLE.</h1>
							<p>
								A voice is a voice, some makes other people's day.Make yours
								count!
							</p>
						</div>
					</div>
					<div className='col-md-3'>
						<Link to='/sitemap' id='sitemap'>
							Sitemap
						</Link>
					</div>
					<div className='col-md-3' />
					{/* <div className="col-md-4">
            <div className="fsocialbox">
              <div className="menuheader">Connect with US</div>
              <ul className="socialicons">
                <li>
                  <a href="https://www.facebook.com/Afrocamgist-397384824014300/" target="_blank" className="facebook">
                    <i className="fa fa-facebook" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/Afrocamgist1" target="_blank" className="twitter">
                    <i className="fa fa-twitter" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/afrocamgist/" target="_blank" className="instagram">
                    <i className="fa fa-instagram" />
                  </a>
                </li>
                <li>
                  <a href="http://plus.google.com/u/0/discover" target="_blank" className="google-plus">
                    <i className="fa fa-google-plus-square" />
                  </a>
                </li>
              </ul>
            </div>
          </div> */}
				</div>
			</div>
		</div>
		<div className='bootomfooter'>
			<div className='container'>
				<div className='lefttext'>
					Copyright © 2018 Afrocampus All Rights Reserved
				</div>
				<div className='righttext'>
					Powered by{' '}
					<a href='https://broadifitech.com/' target='_blank'>
						Broadifi Technologies
					</a>
				</div>
			</div>
		</div>
	</footer>
);

export default footer;
