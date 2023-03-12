import React from 'react';
import {Link} from 'react-router-dom';
import {BASE_URL} from "../../constants/ImageUrls";
import {SIZE_45} from "../../constants/imageSizes";

const friendItem = props => {
  const {friendDetail} = props;

  return (
    <li>
      <span>
        <span className="imagefriend">
          <Link to={`/hashtags/${friendDetail}`}>
            <img src={`${BASE_URL}uploads/hashtags.jpg${SIZE_45}`} alt="friend online"/>
          </Link>
        </span>
        <span className="fiendsname">
          <Link to={`/hashtags/${friendDetail}`}>
            {friendDetail}
          </Link>
        </span>
        {
          props.type !== "disabled" ?
            <span className={friendDetail.online_status ? `fiendactive` : `fiendnonactive`}/> :
            null
        }
      </span>
    </li>
  );
};

export default friendItem;
