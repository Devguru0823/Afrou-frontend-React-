import React, {Component} from 'react';
import Slider from "react-slick";

import SliderItem from '../TextSliderItem/TextSliderItem';

class TextSlider extends Component {
  render() {
    const {settings, posts, onShowSlider} = this.props;

    return (
      <div>
        <h6 className="slider-heading">
          Most Popular Posts
        </h6>
        <Slider {...settings}>
          {
            posts ? posts.map((post, index) => {
              const {
                post_text,
                like_count,
                comment_count,
                post_id,
                first_name,
                last_name,
                profile_image_url,
                posted_by,
                thumbnail,
                post_image,
                post_type,
                user_name
              } = post;

              let mediaUrl = null;
              if (post_image) {
                mediaUrl = post_image[0];
              }
              if (thumbnail) {
                mediaUrl = thumbnail;
              }

              return (
                <div key={post_id} onClick={() => onShowSlider(index)}>
                  <SliderItem
                    sliderBody={post_text}
                    counts={{like: like_count, comment: comment_count}}
                    postId={post_id}
                    fullName={user_name ? `${user_name}`:`${first_name} ${last_name}`}
                    userId={posted_by}
                    userImage={profile_image_url}
                    postMedia={mediaUrl}
                    postType={post_type}
                  />
                </div>
              )
            }) : null
          }
        </Slider>
      </div>
    );
  }
}

export default TextSlider;