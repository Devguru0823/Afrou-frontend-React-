import React from 'react';
import {BASE_URL} from "../../constants/ImageUrls";

const adItem = props => {
  const {data} = props;
  return (
    <li>
      <a
        href={data.link} target="_blank"
        rel="noreferrer"
      >
        <img src={`${BASE_URL}${data.adImage}`} alt="advertisement" className="img-responsive"/>
      </a>
    </li>
  );
};

export default adItem;