import React, {Component} from 'react';
import Slider from "react-slick";
import axios from "../../utils/axiosConfig";

class FriendsSuggestBox extends Component {
  state = {
    followRequestLoading: false
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.followRequestLoading && (prevProps.isLoading !== this.props.isLoading) && !this.props.isLoading) {
      this.setState({followRequestLoading: false})
    }
  }

  handleCoverClick = slug => {
    this.props.history.push(`/hashtags/${slug}`);
  };

  handleHashFollowClicked = (e, token, slug, id, followed) => {
    e.stopPropagation();
    const config = {
      headers: {'Authorization': "bearer " + token}
    };
    const type = followed ? 'unfollow' : 'follow';
    this.setState({followRequestLoading: id});
    axios.post(`hashtags/${type}`, {hashtag: slug}, config)
      .then(() => {
        this.props.fetchFriends(this.props.token);
      })
      .catch(err => console.log(err));
  };

  render() {
    const {
      friends,
      token
    } = this.props;
    const {followRequestLoading} = this.state;

    let friendList = (
      <li className="activefr">
        <div className="suggfrndimg"><img src="/images/footerlogo.jpg" alt="img" className="img-responsive"/></div>
        <div className="suggfrndname">......</div>
        <div className="suggfrndbtns">
          <button type="button" className="followbtn">..... <i className="fa fa-heart"/></button>
          <button type="button" className="adfrndbtn">...... <i className="fa fa-plus"/></button>
        </div>
      </li>
    );

    if (friends) {
      friendList = friends.map((hashItem) => {
        const {
          followers,
          hashtag_slug,
          hashtag_id,
          followed_by_me,
        } = hashItem;

        return (
          <li key={hashtag_id}>
            <div
              className="innerhash"
              style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                minHeight: 155
              }}
              onClick={() => this.handleCoverClick(hashtag_slug)}
            >
              <div className="innserhast_inseder">
                <div className="hashimage">
                  <a href="javascript:void(0);">
                    <img
                      src="/images/hash.png"
                      alt="hastag"
                      className="imgt-responsive"
                      style={{width: 50, height: 50}}
                    />
                  </a>
                </div>
                <div className="hashname" style={{cursor: 'pointer'}}><a>#{hashtag_slug}</a></div>
                <div className="bottomz">
                  <div className="hastcount">{followers ? followers.length : 0} followers</div>
                  <div
                    className="hashfollow"
                    style={followed_by_me ? {color: '#fff', backgroundColor: '#004f96'} : null}
                    onClick={e => this.handleHashFollowClicked(e, token, hashtag_slug, hashtag_id, followed_by_me)}
                  >
                    {
                      followRequestLoading === hashtag_id
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
    }

    return (
      <div className="friendsuggestbx">
        <div className="frsuggheaser">Suggested HashTags</div>
        <div className="allfriendlistsgtn">
          <Slider slidesToShow={2} infinite={false}>
            {friendList}
          </Slider>
        </div>
      </div>
    );
  }
}

export default FriendsSuggestBox;
