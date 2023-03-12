import React from 'react';

import classes from './TextSliderItem.module.css';
import {BASE_URL} from "../../constants/ImageUrls";
import {SIZE_170, SIZE_45} from "../../constants/imageSizes";

const textSliderItem = props => {
  const {
    sliderBody,
    counts,
    fullName,
    userImage,
    postMedia,
    postType
  } = props;

  let imageInPost = null;
  let postCharacterCount = 100;
  let mediaClassNames = [classes.slickSlideInnerBodyContent];
  if (postMedia) {
    imageInPost = <img src={`${BASE_URL}${postMedia}${SIZE_170}`} alt='most popular media'/>;
    postCharacterCount = 20;
  }
  switch (postType) {
    case 'image': {
      mediaClassNames.push('mp-image');
      break;
    }
    case 'video': {
      mediaClassNames.push('mp-video');
      break;
    }
    case 'shared': {
      mediaClassNames.push('mp-shared');
      break;
    }
    default: mediaClassNames.push('mp-text');
  }


  return (
    <div className={classes.slickSlideInner}>
      <div className={classes.slickSlideInnerHead}>
        <div className={classes.slickSlideInnerHeadProfile}>
          <img src={`${BASE_URL}${userImage}${SIZE_45}`} alt="profile" style={{marginRight: '5px'}}/>
          <div>{fullName.length > 15 ? `${fullName.substring(0, 15)}...` : fullName}</div>
        </div>
      </div>
      <div className={classes.slickSlideInnerBody}>
        <div className={mediaClassNames.join(' ')}>
          <p>
            {
              sliderBody.length > postCharacterCount
                ? `${sliderBody.substring(0, postCharacterCount)}... See More`
                : sliderBody
            }
          </p>
          {imageInPost}
        </div>
      </div>
      <div className={classes.slickSlideInnerFooter}>
        <span>
          <i className="fa fa-thumbs-up"/> {counts.like}
        </span>
        <span>
          <i className="fa fa-comments"/> {counts.comment}
        </span>
      </div>
    </div>
  );
};

export default textSliderItem;