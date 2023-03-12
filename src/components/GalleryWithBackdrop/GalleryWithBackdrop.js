import React from 'react';

import BackdropWithContent from "../BackdropWithContent/BackdropWithContent";
import classes from './GalleryWithBackdrop.module.css';

class GalleryWithBackdrop extends React.Component {
  state = {
    selectedImage: this.props.selectedImage ? this.props.selectedImage : 0
  };

  handleNext = () => {
    if (this.state.selectedImage === this.props.images.length - 1) return;
    this.setState(prevState => ({...prevState, selectedImage: prevState.selectedImage + 1}))
  };

  handlePrev = () => {
    if (this.state.selectedImage === 0) return;
    this.setState(prevState => ({...prevState, selectedImage: prevState.selectedImage - 1}))
  };

  render() {
    const {images, onClose, details} = this.props;
    const {selectedImage} = this.state;

    return (
      <BackdropWithContent
        onNextClick={this.handleNext}
        onPrevClick={this.handlePrev}
        onClose={onClose}
        imageIndex={this.state.selectedImage}
        imageArrayLength={this.props.images.length}
        details={details[selectedImage]}
      >
        <img
          alt="gallery"
          className={classes.GalleryImage}
          src={images[selectedImage]}
          style={{cursor: 'auto', maxHeight: 'calc(100vh - 180px)'}}
        />
      </BackdropWithContent>
    );
  }
}

export default GalleryWithBackdrop;