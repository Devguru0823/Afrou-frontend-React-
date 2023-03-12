import React from 'react';

import AdItem from './AdItem';
import HorizontalLoader from "../Loders/HorizontalLoder/HorizontalLoader";

const advertisement = props => {
  const {adDetails} = props;
  return (
    <ul>
      {
        adDetails && adDetails !== null ?
          adDetails.length !== 0 ?
            adDetails.map(detail => {
              return (
                <AdItem key={detail._id} data={detail}/>
              );
            }) :
            null :
          <HorizontalLoader/>
      }
    </ul>
  )
};

export default advertisement;