import React, {Component} from 'react';

class ProfileImageView extends Component {
  componentDidMount() {
    document.body.classList.add("newpopup");
  }

  componentWillUnmount() {
    document.body.classList.remove("newpopup");
  }

  render() {
    const {closeImageBox} = this.props;

    return (
      <div id="myprofileimgbox" style={{display: 'block'}}>
        <span id="closempib" style={{cursor: 'pointer'}}>
          <a onClick={() => closeImageBox()}><i className="fa fa-close"/></a>
        </span>
        <img src={this.props.imageUrl} alt="profile zoomed" className="img-responsive"/>
      </div>
    )
  }
}

export default ProfileImageView;
