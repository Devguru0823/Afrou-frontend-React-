import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import './AdvertList.css';
import { BASE_URL } from '../../../constants/ImageUrls';

const useStyles = makeStyles({
	root: {
		maxWidth: 345,
	},
	media: {
		height: 450,
		objectFit: 'cover',
	},
	content: {
		background: '#fff',
	},
});

export default function AdvertList(props) {
	const classes = useStyles();

	return (
		<div className="ads-container">
			<h2>View Adverts</h2>
			<div className="ads-list">
				{props.ads.map((ad) => (
					<Card className={classes.root} key={ad._id}>
						<CardActionArea>
							<CardMedia
								className={classes.media}
								image={
									ad.post.post_type === 'image'
										? `${BASE_URL}${ad.post.post_image}`
										: `${BASE_URL}${ad.post.thumbnail}`
								}
								onClick={(e) => props.openAdModal(e, 'manage', ad)}
							/>
						</CardActionArea>
					</Card>
				))}
			</div>
		</div>
	);
}
