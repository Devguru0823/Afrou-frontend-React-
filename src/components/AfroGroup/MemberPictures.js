import React from 'react';
import {Link} from 'react-router-dom';
import {BASE_URL} from "../../constants/ImageUrls";
import {SIZE_45} from "../../constants/imageSizes";

const memberPictures = props => {
  const {details} = props;

  return (
    <div className="useringroup">
      <ul>
        {
          details.map((detail, index) => {
            if (index < 5) {
              return (
                <li key={detail.user_id}>
                  <Link to={`/profile/${detail.user_id}`}>
                    <img src={`${BASE_URL}${detail.profile_image_url}${SIZE_45}`} alt="members"/>
                  </Link>
                </li>
              );
            }
            return null
          })
        }
        {
          details.length > 5 ?
            <li> + More {details.length - 5}</li> :
            null
        }
      </ul>
    </div>
  );
};

export default memberPictures;
