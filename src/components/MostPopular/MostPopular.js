import React from 'react';

const mostPopular = ({posts, onShowSlider}) => {
  return (
    <div className="allmostradings">
      <div className="alltrhead">Most Popular <span><a href="#">See More <i
        className="fa fa-caret-right"/></a></span></div>
      <ul>
        {
          posts ? posts.map((post, index) => index < 4 ? (
            <li key={post.post_id}>
              <a onClick={() => onShowSlider(index)} style={{cursor: 'pointer'}}>{post.post_text}</a>
              <span><i className="fa fa-thumbs-up"/>{post.like_count} Likes</span><span><i
              className="fa fa-comments"/>{post.comment_count} Comments</span>
            </li>
          ) : null) : null
        }
      </ul>
    </div>
  )
};

export default mostPopular;
