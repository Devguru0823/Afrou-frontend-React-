import React from 'react';

import {BASE_URL} from '../../constants/ImageUrls';
import {SIZE_300} from "../../constants/imageSizes";

const itemList = props => {
  const {item_name, price, main_image, market_post_id, posted_by, currency} = props.data;
  let marketElement = {};
  let editElement = {};
  let editElementSpan = {};
  let editElementDiv = {};
  const handleMarketOpen = event => {
    if (event.target === editElement || event.target === editElementSpan || event.target === editElementDiv) {
      return;
    }
    props.history.push(`/afromarket/${market_post_id}`)
  };

  return (
    <div
      className="partmarketbox"
      onClick={e => handleMarketOpen(e)}
      ref={input => marketElement = input}
      style={{cursor: 'pointer'}}
    >
      <div className="innerarear">
        <div className="imageadd"><img src={BASE_URL + main_image + SIZE_300} alt="image"/></div>
        {
          Number(posted_by) === Number(props.userId) ?
            <div className="editit" ref={input => editElementDiv = input} onClick={props.onEditClicked}>
                <span style={{cursor: 'pointer'}} ref={input => editElementSpan = input}>
                  <i className="fa fa-edit" ref={input => editElement = input}/>
                </span>
            </div> :
            null
        }
        <div className="alldataintots">
          <div className="itsname">{item_name}</div>
          <div className="itsprice">{currency} {price}</div>
        </div>
      </div>
    </div>
  )
};

export default itemList;