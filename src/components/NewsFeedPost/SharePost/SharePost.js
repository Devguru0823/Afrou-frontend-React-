import React, {Component} from 'react';
import moment from 'moment';
import ReactPlayer from '../../../components/CustomReactPlayer/CustomReactPlayer';
import {Picker} from "emoji-mart";
import {Link} from 'react-router-dom';

import axios from "../../../utils/axiosConfig";
import {BASE_URL} from "../../../constants/ImageUrls";
import {SIZE_300, SIZE_600} from "../../../constants/imageSizes";
import classes from './SharePost.module.css';

class SharePost extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      post_text: '',
      emojiVisible: false,
      sharingTo: this.props.sharingFrom || 'afroswagger',
      sharingToGroup: null,
      loadingMyGroups: null,
      myGroups: [],
      postLocation: ''
    };
  };

  componentDidMount() {
    if (this.props.sharingFrom === 'group') {
      this.fetchAllGroups();
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const success = pos => {
      const crd = pos.coords;

      /*console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);*/
      if (this.mounted) {
        this.setState({postLocation: `${crd.latitude},${crd.longitude}`});
      }
    };

    const error = () => {
      //console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onSharePost = id => {
    const config = {
      headers: {
        'Authorization': "bearer " + this.props.token
      }
    };
    const data = {
      share_post_id: id,
      post_text: this.state.post_text,
      posted_for: this.state.sharingTo,
      group_id: this.state.sharingToGroup ? Number(this.state.sharingToGroup) : null,
      post_lat_long: this.state.postLocation
    };
    axios.post('/posts', data, config)
      .then(response => {
        console.log(response);
        this.setState({post_text: ''});
        this.props.onClose('shared');
      })
      .catch(err => {
        console.log(err);
        this.setState({post_text: ''});
        this.props.onClose();
      });
  };

  fetchAllGroups = () => {
    this.setState({loadingMyGroups: true});
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };
    axios.get('/groups/my-membership-groups', config)
      .then(response => {
        this.setState({
          myGroups: response.data.data,
          sharingToGroup: response.data.data[0].group_id,
          loadingMyGroups: false
        });
      })
      .catch(err => {
        this.setState({loadingMyGroups: false});
        console.log(err);
      });
  };

  inputChangedHandler = event => {
    this.setState({post_text: event.target.value});
  };

  addEmoji = (e) => {
    let sym = e.unified.split('-');
    let codesArray = [];
    sym.forEach(el => codesArray.push('0x' + el));
    let emojiPic = String.fromCodePoint(...codesArray);
    let newValue = this.state.post_text + ' ' + emojiPic;
    this.setState({post_text: newValue});
  };

  showEmojiMenu = event => {
    event.preventDefault();

    this.setState({emojiVisible: true}, () => {
      document.addEventListener('click', this.closeEmojiMenu);
    });
  };

  closeEmojiMenu = (e) => {
    if (this.state.emojiVisible && this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.setState({emojiVisible: false}, () => {
        document.removeEventListener('click', this.closeEmojiMenu);
      });
    }
  };

  handleChange(event, sharingTo) {
    this.setState({[sharingTo]: event.target.value});
    if (sharingTo !== 'sharingToGroup') {
      this.setState({loadingMyGroups: null, sharingToGroup: null});
    }
    if (event.target.value === 'group') {
      this.fetchAllGroups();
    }
  }

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  render() {
    const {visible, onClose, data, showImages, profileImage} = this.props;
    const {
      first_name,
      last_name,
      post_date,
      post_type,
      post_text,
      post_image,
      post_video,
      post_id,
      profile_image_url,
      user_id,
      thumbnail
    } = data;

    let groupSelect = null;

    if (this.state.loadingMyGroups === true) {
      groupSelect = (
        <select className={`custom-select ${classes.Dropdown}`}>
          <option value="loading">Loading...</option>
        </select>
      );
    }

    if (this.state.loadingMyGroups === false) {
      groupSelect = (
        <select
          className={`custom-select ${classes.Dropdown}`}
          onChange={(e) => this.handleChange(e, 'sharingToGroup')}
        >
          {
            this.state.myGroups.map(group => {
              return (
                <option
                  value={group.group_id}
                  key={group._id}
                >
                  {group.group_title}
                </option>
              );
            })
          }
        </select>
      );
    }

    return (
      <div id="sharepostpop" style={{display: visible ? 'block' : 'none'}}>
      <span
        id="closesharepop"
        className="closepopp"
      >
        <a onClick={() => onClose()}>
          <i className="fa fa-close"/>
        </a>
      </span>
        <div className="topboxtxt" style={{paddingTop: '0px'}}>
          Share Post
          <div style={{display: 'block', margin: '2px 0px 0px -5px'}}>
            <select
              className={`custom-select ${classes.Dropdown}`}
              value={this.state.sharingTo}
              onChange={(event) => this.handleChange(event, 'sharingTo')}
            >
              <option value="afroswagger">Afro Swagger</option>
              <option value="afrotalent">Afro Talent</option>
              <option value="group">Afro Group</option>
            </select>
            {groupSelect}
          </div>
        </div>
        <div className="writetoshare">
          <div className="row">
            <div className="col-sm-2">
              <img src={`${BASE_URL}${profileImage}${SIZE_300}`} alt="user" className="img-responsive userimggg"/>
            </div>
            <div className="col-sm-10" id="myptarea">
              <div className="iconsymbol">
                <i
                  className="fa fa-smile-o"
                  onClick={this.showEmojiMenu}
                />
              </div>
              <textarea
                rows={1}
                className="mytextarea"
                placeholder="Write something...."
                onChange={this.inputChangedHandler}
                value={this.state.post_text}
              />
            </div>
          </div>
        </div>
		<div className="posharebttn">
          <button className="btn btn-sharepost" onClick={() => this.onSharePost(post_id)}>Share Post</button>
        </div>
        <div className="sharepostarea">
          <div className="partofpost">
            <div className="topwithname">
              <div className="userimgg"><Link to={`/profile/${user_id}`}>
                <img
                  src={`${BASE_URL}${profile_image_url}${SIZE_300}`} alt="image"
                  className="img-responsive"/>
              </Link></div>
              <div className="namewithtime">
                <Link to={`/profile/${user_id}`}>{first_name} {last_name}</Link>
                <Link to={`/post/${post_id}`}><span>{moment(post_date).fromNow()}</span></Link>
              </div>
            </div>
            <div className="postmainconts">{post_text}</div>
            {
              post_type === 'image' ?
                post_image instanceof Array && post_image.length > 1 ?
                  showImages(post_image) :
                  <div className="postimgvdo">
                    <img
                      src={`${BASE_URL}${post_image}${SIZE_600}`}
                      alt="image"
                      className="img-responsive"
                    />
                  </div> :
                null
            }
            {
              post_type === 'video' ?
                <div className="postimgvdo">
                  <ReactPlayer
                    url={`${BASE_URL}${post_video}`}
                    controls
                    style={{maxWidth: '100%'}}
                    light={`${BASE_URL}${thumbnail}`}
                  />
                </div> :
                null
            }
            <div className="clearfix"/>
          </div>
		  
        </div>
        <div ref={this.setWrapperRef}>
          {
            this.state.emojiVisible ?
              <Picker emoji="" showPreview={false} onSelect={this.addEmoji}/>
              : null
          }
        </div>
        
      </div>
    );
  }
}

export default SharePost;