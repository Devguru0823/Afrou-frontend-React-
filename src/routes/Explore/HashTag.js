import React, {Component} from 'react';
import {connect} from 'react-redux';
import InfiniteScroll from "react-infinite-scroller";
import {withRouter} from "react-router-dom";

import {
  fetchHashTagList,
  resetHashTagList,
  updateHashTagList
} from '../../redux/actions';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import {BASE_URL} from "../../constants/ImageUrls";

class HashTag extends Component {
  state = {
    searchValue: ''
  };

  componentDidMount() {
    this.props.fetchHashTagList(this.props.token);
  }

  componentWillUnmount() {
    this.props.resetHashTagList();
  }

  loadItems = () => {
    if (!this.props.isLoading) {
      if (this.state.searchValue !== '') {
        this.props.fetchHashTagList(
          this.props.token,
          this.props.nextPage === null ? 1 : this.props.nextPage,
          this.state.searchValue
        );
      } else {
        this.props.fetchHashTagList(
          this.props.token,
          this.props.nextPage === null ? 1 : this.props.nextPage,
        );
      }
    }
  };

  onSearchTermChange = event => {
    const value = event.target.value;
    this.setState({searchValue: value});
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.resetHashTagList();
      this.props.fetchHashTagList(this.props.token, 1, value)
    }, 500);
  };

  handleActionClick = (e, token, hashList, hashtag_id, userId) => {
    e.stopPropagation();
    this.props.onHashFollow(token, hashList, hashtag_id, userId);
  };

  handleCoverClick = slug => {
    this.props.history.push(`/hashtags/${slug}`);
  };

  render() {
    const {
      hashList,
      token,
      followLoading,
      hasMorePage,
      userId
    } = this.props;
    const loader = <HorizontalLoader key={Date.now()}/>;
    const items = [];

    hashList.map(hashItem => {
      const {
        followers,
        hashtag_slug,
        hashtag_id,
        followed_by_me,
        cover_image
      } = hashItem;

      let backgroundUrl = '/images/hashlist-background.jpg';
      if (cover_image && cover_image !== '') {
        backgroundUrl = BASE_URL + cover_image;
      }

      items.push(
        <li key={hashtag_id}>
          <div
            className="innerhash"
            style={{
              backgroundImage: `url(${backgroundUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'pointer'
            }}
            onClick={() => this.handleCoverClick(hashtag_slug)}
          >
            <div className="innserhast_inseder">
              <div className="hashimage">
                <a href="javascript:void(0);">
                  <img src="/images/hash.png" alt="hastag" className="imgt-responsive"/>
                </a>
              </div>
              <div className="hashname" style={{cursor: 'pointer'}}><a>#{hashtag_slug}</a></div>
              <div className="bottomz">
                <div className="hastcount">{followers ? followers.length : 0} followers</div>
                <div
                  className="hashfollow"
                  style={followed_by_me ? {color: '#fff', backgroundColor: '#004f96'} : null}
                  onClick={e => this.handleActionClick(e, token, hashList, hashtag_id, userId)}
                >
                  {
                    followLoading === hashtag_id
                      ? 'Loading...'
                      : followed_by_me ? '-Unfollow' : '+Follow'
                  }
                </div>
              </div>
            </div>
          </div>
        </li>
      )
    });

    return (
      <div className="allhashing">
        <div className="insiderarea marbtm20">
          <div className="searchbar">
            <input
              className="search_input"
              type="text" placeholder="Please start typing to search..."
              onChange={this.onSearchTermChange}
              value={this.state.searchValue}
              style={{width: '100%'}}
            />
          </div>
        </div>
        <ul>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadItems}
            hasMore={hasMorePage}
            loader={loader}>
            {items}
          </InfiniteScroll>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = ({hash, auth, ui}) => ({
  hashList: hash.feed,
  hasMorePage: hash.hasMorePage,
  nextPage: hash.nextPage,
  userId: auth.user.user_id,
  token: auth.token,
  followLoading: hash.followLoading,
  isLoading: ui.isLoading,
});

const mapDispatchToProps = dispatch => {
  return {
    fetchHashTagList: (token, page, search) => dispatch(fetchHashTagList(token, page, search)),
    resetHashTagList: () => dispatch(resetHashTagList()),
    onHashFollow: (token, feeds, id, userId) => dispatch(updateHashTagList(token, feeds, id, userId))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HashTag));
