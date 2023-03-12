import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import AvatarEditor from 'react-avatar-editor';
const EXIF = require('exif-js');

class CustomAvatarEditor extends Component {
  state = {
    profileImage: null,
    allowZoomOut: false,
    scale: 1.2,
    rotationAngle: 0
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.visible) {
      document.body.classList.add("actpopup");
    } else {
      document.body.classList.remove("actpopup");
    }
  };

  onChange = e => {
    const files = Array.from(e.target.files);
    const that = this;
    if (files[0]) {
      EXIF.getData ( e.target.files[0], function() {
        const orientation = EXIF.getTag(this,"Orientation");
        let rotatePic = 0;
        switch(orientation){
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
            rotatePic=0;

        }
        that.setState({rotationAngle: rotatePic});
      });
      this.setState({profileImage: files[0]});
    }
  };

  handleClickSave = () => {
    if (this.editor) {
      this.setState({loading: true});
      const canvasURL = this.editor.getImage().toDataURL();
      fetch(canvasURL)
        .then(res => res.blob())
        .then(blob => {
          this.props.onImageUpload(blob);
          this.setState({profileImage: null, loading: false});
        })
    }
  };

  handleScale = e => {
    const scale = parseFloat(e.target.value);
    this.setState({scale});
  };

  setEditorRef = editor => this.editor = editor;

  render() {
    const {visible, closeImageBox} = this.props;

    return (
      <div id="changeproimagebox" style={{display: visible ? 'block' : 'none', top: '64px'}}>
      <span id="closecpimb" style={{cursor: 'pointer'}}>
        <a onClick={() => closeImageBox()}><i className="fa fa-close"/></a>
      </span>
        <div className="topboxtxt">Change Image</div>
        <div className="currentshow">
          <AvatarEditor
            ref={this.setEditorRef}
            image={this.state.profileImage ? URL.createObjectURL(this.state.profileImage) : null}
            scale={parseFloat(this.state.scale)}
            width={200}
            height={200}
            border={30}
            color={[255, 255, 255, 0.6]} // RGBA
            rotate={this.state.rotationAngle}/>
        </div>
        <div className="avatar-editor-scale">
          <input
            className="avatar-editor-scale"
            name="scale"
            type="range"
            onChange={this.handleScale}
            min={this.state.allowZoomOut ? '0.1' : '1'}
            max="2"
            step="0.01"
            defaultValue="1"
          />
        </div>
        <div className="buttonforupnew"><input type="file" className="uploadimg" onChange={this.onChange}/></div>
        <div className="updatemyproimg">
          <button type="submit" className="updatebtnn" onClick={this.handleClickSave}>Update</button>
        </div>
      </div>
    );
  }
}

export default withRouter(CustomAvatarEditor);
