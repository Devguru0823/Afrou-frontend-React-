import React from 'react';

import {BASE_URL} from "../../constants/ImageUrls";
import {SIZE_300, SIZE_600} from "../../constants/imageSizes";

const profileDetails = props => {
  const {profileDetails, isOwnProfile} = props;
  let coverImageUrl = profileDetails ? `url(${BASE_URL}${profileDetails.profile_cover_image}${SIZE_600})` : '';
  if (props.isLoading) {
    coverImageUrl = 'url(/images/dot-loader.gif)'
  }

  let inputCoverElement = {};
  let inputGroupButton = {};
  const onClickCover = event => {
    if (event.target === inputGroupButton || event.target === inputCoverElement) {
      return
    }
    if (profileDetails.profile_cover_image) {
      props.onOpenViewBox(`${BASE_URL}${profileDetails.profile_cover_image}${SIZE_600}`)
    }
  };

  return (
    <div className="marketlistarea">
      <div
        className="groupdetailstop"
        style={{backgroundImage: coverImageUrl, cursor: 'pointer'}}
        onClick={(e) => onClickCover(e)}
      >
        <div className="bttnupload">
          <input
            style={{display: 'none'}}
            type="file"
            ref={input => inputCoverElement = input}
            onChange={(event) => props.onUploadCover(event.target.files[0], 'cover')}
          />
          {
            profileDetails && isOwnProfile ?
              <button
                type="button"
                className="btn btn-dark"
                ref={input => inputGroupButton = input}
                onClick={() => inputCoverElement.click()}
              >
                <i className="fa fa-file-image-o"/>Upload Cover Image
              </button> : null
          }
        </div>
      </div>
      <div className="clearfix"/>
      <div className="nameimgarea">
        <div className="groupprofileimg">
          <div className="groupimg">
            <img
              onClick={() => props.onOpenViewBox(`${BASE_URL}${profileDetails.profile_image_url}${SIZE_300}`)}
              src={
                profileDetails && profileDetails.profile_image_url ?
                  `${BASE_URL}${profileDetails.profile_image_url}${SIZE_300}` :
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