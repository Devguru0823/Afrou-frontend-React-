import React, {Component} from 'react';
import Gallery from 'react-grid-gallery';
import {connect} from 'react-redux';
import ExifOrientationImg from "react-exif-orientation-img";

import withErrorHandler from '../../utils/withErrorHandler';
import UserLayout from '../../hoc/UserDetail/UserDetail';
import {fetchProfilePhotos, resetProfileFeed} from "../../redux/actions";
import {BASE_URL} from "../../constants/ImageUrls";
import axios from "../../utils/axiosConfig";
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import {SIZE_300} from "../../constants/imageSizes";
import classes from "../Messages/MessageDetail/MessageDetail.module.css";
import {toast} from "react-toastify";

class RequestAdvertisement extends Component {
  state = {
    image: {
      file: null,
      path: '',
      isLoading: false
    },
    deleteLoading: false,
    currentImage: 0
  };

  componentDidMount() {
    this.props.fetchProfilePhotos(this.props.token, this.props.match.params.id)
  }

  componentWillUnmount() {
    this.props.resetProfileFeed()
  }

  onDelete = id => {
    const config = {
      headers: {
        'Authorization': "bearer " + this.props.token,
        'content-type': 'multipart/form-data'
      }
    };
    axios.delete(`/user-photos/${id}`, config)
      .then(() => {
        this.props.fetchProfilePhotos(this.props.token, this.props.match.params.id)
      })
  };

  onChange = e => {
    const allFiles = e.target.files;
    if (allFiles.length === 0) {
      return;
    }
    const _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
    let blnValid = false;
    for (const file of allFiles) {
      const sFileName = file.name;
      if (sFileName.length > 0) {
        for (let j = 0; j < _validFileExtensions.length; j++) {
          const sCurExtension = _validFileExtensions[j];
          if (
            sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() ===
            sCurExtension.toLowerCase()
          ) {
            blnValid = true;
            break;
          }
        }
      }
    }

    if (blnValid) {
      const files = Array.from(e.target.files);
      if (files[0]) {
        const image = files[0];
        this.setState(prevState => {
          return {
            ...prevState,
            image: {
              ...prevState.image,
              file: image,
              isLoading: true
            }
          }
        });
        const config = {
          headers: {
            'Authorization': "bearer " + this.props.token,
            'content-type': 'multipart/form-data'
          }
        };
        const formData = new FormData();
        formData.append('file', image);
        axios.post('/profile/photos', formData, config)
          .then(response => {
            this.setState(prevState => {
              return {
                ...prevState,
                image: {
                  ...prevState.image,
                  file: null,
                  path: response.data.data.path,
                  isLoading: false
                }
              }
            });
            this.props.fetchProfilePhotos(this.props.token);
            console.log(response);
          })
          .catch(err => {
            console.log(err);
            this.setState(prevState => {
              return {
                ...prevState,
                image: {
                  ...prevState.image,
                  path: '',
                  isLoading: false
                }
              }
            });
          });
        //this.props.postFile(this.props.token, image);
      }
    } else {
      if (!blnValid) {
        toast.error(
          "Sorry, filename is invalid, allowed extensions are: " + _validFileExtensions.join(", "), {
            position: toast.POSITION.TOP_CENTER
          });
      }
    }
  };

  onCurrentImageChange = (index) => {
    this.setState({currentImage: index});
  };

  myImageStyleFn() {
    this.props.item.thumbnailWidth = '50%';
    this.props.item.thumbnailHeight = '100%';
  }

  myViewportStyleFn() {
    this.props.item.thumbnailWidth = '50%';
    this.props.item.thumbnailHeight = '300px';
  }

  render() {
    const imageArray = this.props.profileImages ? this.props.profileImages.map((image, index) => {
      if ((index + 1) % 3 === 0) {
        return {
          src: BASE_URL + image.image_url,
          thumbnail: BASE_URL + image.image_url + SIZE_300,
          thumbnailWidth: 320,
          thumbnailHeight: 90
        };
      } else {
        return {
          src: BASE_URL + image.image_url,
          thumbnail: BASE_URL + image.image_url + SIZE_300,
          thumbnailWidth: 320,
          thumbnailHeight: 174
        };
      }
    }) : [];

    const idArray = this.props.profileImages ?
      this.props.profileImages.map(image => image.user_photo_id) : [];

    return (
      <UserLayout>
        <div className="midleconarea">
          <div className="awhitebg">
            <div className="allphotoshere">
              <h6>Photos</h6>
              {this.props.match.params.id
                ? null
                : <label
                  htmlFor="input-photos"
                  className="input-photos"
                  style={{backgroundColor: this.state.image.isLoading ? '#aaa' : null}}
                />
              }
              {this.props.match.params.id ? null :
                <input
                  accept='image/*'
                  type="file"
                  id="input-photos"
                  onChange={this.onChange}
                  disabled={this.state.image.isLoading}
                />
              }
              <div className="row">
                <div className="col-sm-4 mb-2">
                  {this.state.image.file && this.state.image.isLoading && <div className={classes.FileLoading}/>}
                  {
                    this.state.image.file ?
                      this.state.image.isLoading ?
                        <ExifOrientationImg
                          alt="selected"
                          src={URL.createObjectURL(this.state.image.file)}
                          className="img-responsive userimggg"
                          style={{opacity: 0.5}}
                        /> :
                        <img
                          alt="selected"
                          src={URL.createObjectURL(this.state.image.file)}
                          className="img-responsive userimggg"
                        /> :
                      null
                  }
                </div>
              </div>
              {
                this.props.isLoading
                  ? <HorizontalLoader/>
                  : <Gallery
                    images={imageArray}
                    enableImageSelection={false}
                    currentImageWillChange={this.onCurrentImageChange}
                    customControls={[
                      <button
                        key="deleteImage"
                        onClick={() => this.onDelete(idArray[this.state.currentImage])}
                        className="photo-delete"
                      >
                        <i className="fa fa-trash"/>
                      </button>
                    ]}
                  />
              }
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    profileImages: state.profile.images,
    isLoading: state.ui.isLoading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProfilePhotos: (token, id) => dispatch(fetchProfilePhotos(token, id)),
    resetProfileFeed: () => dispatch(resetProfileFeed())
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(RequestAdvertisement), axios);
