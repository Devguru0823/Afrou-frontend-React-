import React from 'react';

import {BASE_URL} from "../../constants/ImageUrls";
import {SIZE_300, SIZE_600} from "../../constants/imageSizes";

const profileDetails = props => {
  const {profileDetails} = props;
  let coverImageUrl = 'url(/images/dot-loader.gif)';
  if (profileDetails && profileDetails.cover_image) {
    coverImageUrl = `url(${BASE_URL}${profileDetails.cover_image}${SIZE_600})`
  }

  const onClickCover = () => {
    props.onOpenViewBox(`${BASE_URL}${profileDetails.cover_image}${SIZE_600}`)
  };

  return (
    <div className="marketlistarea hashtag-details">
      <div
        className="groupdetailstop"
        style={{
          backgroundImage: coverImageUrl,
          cursor: 'pointer',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => onClickCover()}
      />
      <div className="clearfix"/>
      <div className="nameimgarea">
        <div className="groupprofileimg">
          <div className="groupimg">
            <img
              onClick={() => props.onOpenViewBox(`${BASE_URL}${profileDetails.profile_image}${SIZE_300}`)}
              src={
                profileDetails && profileDetails.profile_image ?
                  `${BASE_URL}${profileDetails.profile_image}${SIZE_300}` :
                  '/images/group_default.jpg'
              }
              alt="group" className="img-responsive"
              style={{cursor: 'pointer'}}
            />
          </div>
        </div>
      </div>
      <div className="clearfix"/>
    </div>
  );
};

export default profileDetails;
