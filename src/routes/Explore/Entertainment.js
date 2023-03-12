import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from "react-router-dom";
import Image from "react-graceful-image";

import {
  fetchEntertainmentList,
  resetEntertainmentList,
} from '../../redux/actions';
import {BASE_URL} from "../../constants/ImageUrls";
import GalleryWithBackdrop from "../../components/GalleryWithBackdrop/GalleryWithBackdrop";

class Entertainment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderVisible: false
    };

    window.onscroll = () => {

      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (this.props.isLoading) return;

      // Checks that the page has scrolled to the bottom
      if (
        Math.floor(window.innerHeight + document.documentElement.scrollTop) + 1 >= document.documentElement.offsetHeight
      ) {
        this.loadItems();
      }
    }
  }

  componentDidMount() {
    this.props.fetchHashTagList(this.props.token);
  }

  componentWillUnmount() {
    this.props.resetHashTagList();
  }

  loadItems = () => {
    this.props.fetchHashTagList(
      this.props.token,
      this.props.nextPage === null ? 1 : this.props.nextPage,
    );
  };

  handleItemClick = (index) => {
    this.setState({sliderVisible: index});
  };

  handleGalleryClose = () => {
    this.setState({sliderVisible: false});
  };

  /*handleCoverClick = slug => {
    this.props.history.push(`/hashtags/${slug}`);
  };*/

  render() {
    const {hashList, isLoading} = this.props;
    const {sliderVisible} = this.state;
    const items = [];
    const imageList = [];
    const detailsList = [];

    hashList.map((hashItem, index) => {
      const {
        post_image,
        thumbnail,
        like_count,
        comment_count,
        post_id
      } = hashItem;

      let backgroundUrl = '/images/hashlist-background.jpg';
      if (thumbnail && thumbnail !== '') {
        backgroundUrl = BASE_URL + thumbnail + '?width=300&height=300';
        imageList.push(BASE_URL + thumbnail + '?width=600');
        detailsList.push({likeCount: like_count, commentCount: comment_count, postId: post_id});
      } else if (post_image && post_image.length !== 0) {
        backgroundUrl = BASE_URL + post_image[0] + '?width=300&height=300';
        imageList.push(BASE_URL + post_image[0] + '?width=600');
        detailsList.push({likeCount: like_count, commentCount: comment_count, postId: post_id});
      }

      items.push(
        <li key={post_id} onClick={() => this.handleItemClick(index)}>
          <Image
            src={backgroundUrl}
            alt="image"
            className="img-responsive"
            placeholderColor="#ffaa64"
            width="300"
            height="300"
          />
          <div className="onhoverbox">
            <div className="onboxiner">
              <div className="nooflike"><i className="fa fa-thumbs-o-up" aria-hidden="true"/>{like_count}</div>
              <div className="noofcoments"><i className="fa fa-comment-o"/>{comment_count}</div>
              <div className="godetails"><Link to={`/post/${post_id}`}>
                <i className="fa fa-external-link" aria-hidden="true"/>
              </Link></div>
            </div>
          </div>
        </li>
      )
    });

    if (isLoading) {
      items.push(<p style={{color: '#ff7400', textAlign: 'center', fontSize: '2em'}}>Loading...</p>)
    }

    return (
      <div className="entertentgrid">
        {sliderVisible !== false
          ? <GalleryWithBackdrop
            images={imageList}
            details={detailsList}
            onClose={this.handleGalleryClose}
            selectedImage={sliderVisible}
          />
          : null}
        <ul>
          {items}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = ({auth, entertainment}) => ({
  hashList: entertainment.feed,
  hasMorePage: entertainment.hasMorePage,
  nextPage: entertainment.nextPage,
  userId: auth.user.user_id,
  token: auth.token,
  isLoading: entertainment.isLoading
});

const mapDispatchToProps = dispatch => {
  return {
    fetchHashTagList: (token, page, search) => dispatch(fetchEntertainmentList(token, page, search)),
    resetHashTagList: () => dispatch(resetEntertainmentList())
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Entertainment));
