import React from 'react';
import {Link} from 'react-router-dom';
import {BASE_URL} from "../../constants/ImageUrls";

const suggestedHash = ({posts}) => {
  return (
    <div className="allmostradings">
      <div className="alltrhead">Trending hash_tags
        <div style={{display: 'inline-block', marginLeft: 9}}>
          <Link to="/hashtags">See More <i className="fa fa-caret-right"/></Link>
        </div>
      </div>
      <ul>
        {
          posts ? posts.map(post => {
            let backgroundUrl = '/images/hashlist-background.jpg';
            if (post.cover_image && post.cover_image !== '') {
              backgroundUrl = BASE_URL + post.cover_image;
            }

            return (
              <li
                key={post._id}
                style={{
                  backgroundImage: `url(${backgroundUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer'
                }}
              >
                <Link to={`/hashtags/${post.hashtag_slug}`}>{post.hashtag_slug}</Link>
                <small>-- ({post.followers ? post.followers.length : 0} followers)</small>
              </li>
            )
          }) : null
        }
      </ul>
    </div>
  )
};

export default suggestedHash;
