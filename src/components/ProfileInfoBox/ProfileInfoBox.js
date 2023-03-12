import React, {Component} from 'react';

import {BASE_URL} from "../../constants/ImageUrls";
import ProfileImageBox from './ProfileImageBox';
import ProfileImageView from './ProfileImageView';
import {SIZE_300} from "../../constants/imageSizes";

class ProfileInfoBox extends Component {
  state = {
    showEditor: false,
    showViewer: false
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.showEditor !== prevState.showEditor) {
      this.props.onViewEditorChange(this.state.showEditor);
    }
  }

  handleCloseImageBox = () => {
    this.setState({showEditor: false});
  };

  handleCloseViewBox = () => {
    this.setState({showViewer: false});
  };

  render() {
    const {
      first_name,
      last_name,
      profile_image_url,
      profile_strength
    } = this.props.profileDetails;

    return (
      <div className="profilewall" style={{height: this.props.ifOthersProfile ? '135px' : null}}>
        {
          this.state.showEditor ?
            <ProfileImageBox
              closeImageBox={this.handleCloseImageBox}
              imageUrl={`${BASE_URL}${profile_image_url}`}
              token={this.props.token}
              updateProfileDetail={this.props.updateProfileDetail}
            /> :
            null
        }
        {
          this.state.showViewer ?
            <ProfileImageView
              visible={this.state.showViewer}
              closeImageBox={this.handleCloseViewBox}
              imageUrl={`${BASE_URL}${profile_image_url}${SIZE_300}`}
            /> :
            null
        }
        <div className="profileimg" style={{cursor: 'pointer'}}>
          <a onClick={() => this.setState(({showViewer: true}))}>
            <img src={`${BASE_URL}${profile_image_url}${SIZE_300}`} alt="profile" className="img-responsive"/>
          </a>
        </div>
        <div className="profilename">
          {`${first_name ? first_name.split(" ")[0] : ''} ${last_name ? last_name.split(" ")[0] : ''}`}
        </div>
        {
          !this.props.ifOthersProfile ?
            <div className="cngprofimg" style={{cursor: 'pointer'}}>
              <a onClick={() => this.setState(({showEditor: true}))}>
                <i className="fa fa-image"/>Change Photo
              </a>
            </div> : null
        }
        <hr/>
        {!this.props.ifOthersProfile ?
          <div className="profcomptxt">Profile Strength<span>{profile_strength}%</span></div> : null}
        {
          !this.props.ifOthersProfile ?
            <div className="progress profilebar" style={{height: '10px'}}>
              <div className="progress-bar" style={{width: `${profile_strength}%`, height: '10px'}}/>
            </div> : null
        }
      </div>
    );
  }
}

export default ProfileInfoBox;