import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Link} from 'react-router-dom';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import ProfileLayout from '../../hoc/Profile/Profile';
import CircleLoader from '../../components/Loders/CircleLoder/CircleLoader';
import {fetchMarketItem, resetMarketItem} from '../../redux/actions';
import {BASE_URL} from '../../constants/ImageUrls';
import {SIZE_300, SIZE_600} from "../../constants/imageSizes";

class ItemDetail extends Component {
  state = {
    selectedImage: null,
  };

  componentDidMount() {
    this.props.fetchItem(this.props.token, this.props.match.params.itemId);
  }

  componentWillUnmount() {
    this.props.resetMarketItem();
  }

  imageChangeHandler = url => {
    this.setState({selectedImage: `${BASE_URL}${url}`});
  };

  render() {
    const {
      item_name,
      description,
      mobile_number,
      city,
      country,
      posted_by,
      price,
      main_image,
      sub_image1,
      sub_image2,
      sub_image3,
      created_date,
      currency
    } = this.props.item;

    let details = <CircleLoader/>;
    if (!this.props.isLoading) {
      details = (
        <div className="marketlistarea">
          <div className="productnamee">{item_name}
            <small>For Sale</small>
          </div>
          <div className="descproduct">{description}
          </div>
          <div className="markproimg">
            <img
              src={
                this.state.selectedImage ?
                  `${this.state.selectedImage}${SIZE_600}` :
                  `${BASE_URL}${main_image}${SIZE_600}`
              }
              alt="image" className="img-responsive"
            />
          </div>
          <div className="subimagess">
            <ul>
              <li onClick={() => this.imageChangeHandler(main_image)}>
                <img src={`${BASE_URL}${main_image}${SIZE_300}`} alt="image" className="img-responsive"/>
              </li>
              {
                sub_image1 ?
                  <li onClick={() => this.imageChangeHandler(sub_image1)}>
                    <img src={`${BASE_URL}${sub_image1}${SIZE_300}`} alt="image" className="img-responsive"/>
                  </li> :
                  null
              }
              {
                sub_image2 ?
                  <li onClick={() => this.imageChangeHandler(sub_image2)}>
                    <img src={`${BASE_URL}${sub_image2}${SIZE_300}`} alt="image" className="img-responsive"/>
                  </li> :
                  null
              }
              {
                sub_image3 ?
                  <li onClick={() => this.imageChangeHandler(sub_image3)}>
                    <img src={`${BASE_URL}${sub_image3}${SIZE_300}`} alt="image" className="img-responsive"/>
                  </li> :
                  null
              }
            </ul>
          </div>
          <div className="clearfix"/>
          <div className="row">
            <div className="col-md-7">
              <div className="contactdetails">
                <ul>
                  <li><i className="fa fa-phone"/> <a href={`tel:${mobile_number}`}>{mobile_number}</a></li>
                  {
                    posted_by && (this.props.user.user_id  !== posted_by.user_id) ?
                      <li><i className="fa fa-comments"/> <Link to={`/messages/conversation/${posted_by.user_id}`}>
                        {`Chat with ${posted_by.first_name}`}
                      </Link></li> :
                      null
                  }
                  <li><i className="fa fa-envelope"/> {
                    posted_by?
                      <a href={`mailto:${posted_by.email}`}>{posted_by.email}</a> :
                      ''
                  }</li>
                  <li><i className="fa fa-university"/> {city}</li>
                  <li><i className="fa fa-globe"/> {country}</li>
                </ul>
              </div>
            </div>
            <div className="col-md-5">
              <div className="productprice">{currency} {price}</div>
              <div className="productupby">Post by {posted_by ? posted_by.first_name : ''}</div>
              <div className="productposton">{moment(created_date).fromNow()}</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <ProfileLayout>
        <div className="midleconarea">
          <div className="awhitebg">
            {details}
          </div>
        </div>
      </ProfileLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    item: state.market.item,
    user: state.auth.user,
    isLoading: state.ui.isLoading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchItem: (token, id) => dispatch(fetchMarketItem(token, id)),
    resetMarketItem: () => dispatch(resetMarketItem())
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(ItemDetail), axios);
