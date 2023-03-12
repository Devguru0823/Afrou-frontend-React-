import React, { Component } from "react";
import Lightbox from "react-images";
import { BASE_URL } from "../../../constants/ImageUrls";
import { SIZE_600 } from "../../../constants/imageSizes";

class SingleImagePost extends Component {
  state = {
    lightboxIsOpen: false,
  };
  componentDidUpdate = () => {
    if (this.props.isVisible && this.props.postId) {
      this.props.handleViewPost(this.props.postId);
    }
  };
  closeLightbox = () => {
    this.setState({ lightboxIsOpen: false });
  };

  openLightbox = () => {
    this.setState({ lightboxIsOpen: true });
  };

  render() {
    const { post_image } = this.props.data;
    return (
      <div className="postimgvdo">
        <Lightbox
          images={[{ src: `${BASE_URL}${post_image}${SIZE_600}` }]}
          isOpen={this.state.lightboxIsOpen}
          onClose={this.closeLightbox}
          showImageCount={false}
          backdropClosesModal={true}
        />
        <img
          src={`${BASE_URL}${post_image}${SIZE_600}`}
          alt="image"
          className="img-responsive"
          onClick={this.openLightbox}
        />
      </div>
    );
  }
}

export default SingleImagePost;
