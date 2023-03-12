import React, {PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import AvatarEditor from 'react-avatar-editor';
import {toast} from 'react-toastify';

import axios from "../../utils/axiosConfig";
import {toastOptions} from "../../constants/toastOptions";

const EXIF = require('exif-js');

class ProfileImageBox extends PureComponent {
  state = {
    profileImage: null,
    allowZoomOut: false,
    scale: 1.2,
    rotationAngle: 0,
    isLoading: false
  };

  componentDidMount() {
    document.body.classList.add("newpopup");
  }

  componentWillUnmount() {
    document.body.classList.remove("newpopup");
  }

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
      const that = this;
      if (files[0]) {
        EXIF.getData(e.target.files[0], function () {
          const orientation = EXIF.getTag(this, "Orientation");
          let rotatePic = 0;
          switch (orientation) {
            case 8:
              rotatePic = 270;
              break;
            case 6:
              rotatePic = 90;
              break;
            case 3:
              rotatePic = 180;
              break;
            default:
              rotatePic = 0;

          }
          that.setState({rotationAngle: rotatePic});
        });
        this.setState({profileImage: files[0]});
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

  onClickSave = () => {
    if (this.editor) {
      this.setState({isLoading: true});
      const canvasURL = this.editor.getImage().toDataURL();
      this.setState({profileImage: canvasURL});
      fetch(canvasURL)
        .then(res => res.blob())
        .then(blob => {
          const config = {
            headers: {
              'Authorization': "bearer " + this.props.token,
              'content-type': 'multipart/form-data'
            }
          };
          const formData = new FormData();
          formData.append('file', blob);
          axios.post('/profile/update-profile-picture', formData, config)
            .then(response => {
              this.setState({profileImage: null, isLoading: false});
              //console.log(response.data.data);
              this.props.updateProfileDetail(response.data.data);
              this.props.closeImageBox();
              this.props.history.go(0);
            })
            .catch(() => {
              toast('Error uploading image. Please try again', toastOptions);
              this.setState({profileImage: null, isLoading: false});
            });
        });
    }
  };

  handleScale = e => {
    const scale = parseFloat(e.target.value);
    this.setState({scale});
  };

  setEditorRef = editor => this.editor = editor;

  render() {
    const {closeImageBox} = this.props;

    return (
      <div id="changeproimagebox" style={{display: 'block'}}>
      <span id="closecpimb" style={{cursor: 'pointer'}}>
        <button className="btn" onClick={() => closeImageBox()}><i className="fa fa-close"/></button>
      </span>
        <div className="topboxtxt">Change Image</div>
        <div className="currentshow">
          {
            this.state.isLoading ?
              <img src={this.state.profileImage} alt={"after-edit"}/> :
              <AvatarEditor
                ref={this.setEditorRef}
                image={this.state.profileImage ? URL.createObjectURL(this.state.profileImage) : null}
                scale={parseFloat(this.state.scale)}
                width={200}
                height={200}
                border={30}
                color={[255, 255, 255, 0.6]} // RGBA
                rotate={this.state.rotationAngle}
              />
          }
        </div>
        <div className="avatar-editor-scale">
          <input
            name="scale"
            type="range"
            onChange={this.handleScale}
            min={this.state.allowZoomOut ? '0.1' : '1'}
            max="2"
            step="0.01"
            defaultValue="1"
          />
        </div>
        <p className="warning-profile">Only image is accepted</p>
        <div className="buttonforupnew">
          <input type="file" accept='image/*' className="uploadimg" onChange={this.onChange} disabled={this.state.isLoading}/>
        </div>
        <div className="updatemyproimg">
          <button type="submit" className="updatebtnn" onClick={this.onClickSave} disabled={this.state.isLoading || !this.state.profileImage}>
            {this.state.isLoading ? <img src="/images/dot-loader.gif" alt="loading" style={{width: 50}}/> : 'Update'}
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(ProfileImageBox);
