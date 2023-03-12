import React from 'react';
import {Link} from "react-router-dom";

import Backdrop from "../Backdrop/Backdrop";
import classes from './BackdropWithContent.module.css';

const BackdropWithContent = props => {
  const {onPrevClick, onNextClick, onClose, imageIndex, imageArrayLength, details} = props;

  return (
    <Backdrop>
      <div className={classes.ContentContainer}>
        <div className={classes.ContentHeader}>
          <button title="Close (Esc)" className={classes.ContentClose} onClick={onClose}>
            <span>
              <svg
                fill="white"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%"
                viewBox="0 0 512 512" style={{enableBackground: 'new 0 0 512 512'}} xmlSpace="preserve"
              >
                <path
                  d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4 L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1 c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1 c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/>
              </svg>
            </span>
          </button>
        </div>
        <figure className={classes.ContentFigure}>
          {props.children}
        </figure>
        {/*<div className={classes.SpinnerOuter}>
          <div className={classes.SpinnerInner}>
            <div className={classes.SpinnerRipple}/>
          </div>
        </div>*/}
        <div className={classes.ContentFooter}>
          <div className="onboxiner">
            <div className="nooflike"><i className="fa fa-thumbs-o-up" aria-hidden="true"/>{details.likeCount}</div>
            <div className="noofcoments"><i className="fa fa-comment-o"/>{details.commentCount}</div>
            <div className="godetails"><Link to={`/post/${details.postId}`}>
              <i className="fa fa-external-link" aria-hidden="true"/>
            </Link></div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className={classes.ContentLeftArrow}
        title="Previous (Left arrow key)"
        onClick={onPrevClick}
        style={{display: imageIndex === 0 ? 'none' : 'block'}}
      >
        <span>
          <svg
            fill="white" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px" y="0px" width="100%" height="100%" viewBox="0 0 512 512" xmlSpace="preserve"
          >
            <path
              d="M213.7,256L213.7,256L213.7,256L380.9,81.9c4.2-4.3,4.1-11.4-0.2-15.8l-29.9-30.6c-4.3-4.4-11.3-4.5-15.5-0.2L131.1,247.9 c-2.2,2.2-3.2,5.2-3,8.1c-0.1,3,0.9,5.9,3,8.1l204.2,212.7c4.2,4.3,11.2,4.2,15.5-0.2l29.9-30.6c4.3-4.4,4.4-11.5,0.2-15.8 L213.7,256z"/>
          </svg>
        </span>
      </button>
      <button
        type="button"
        className={classes.ContentRightArrow}
        title="Next (Right arrow key)"
        onClick={onNextClick}
        style={{display: imageArrayLength - 1 === imageIndex ? 'none' : 'block'}}
      >
        <span>
          <svg
            fill="white" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px" y="0px" width="100%" height="100%" viewBox="0 0 512 512" xmlSpace="preserve"
          >
            <path
              d="M298.3,256L298.3,256L298.3,256L131.1,81.9c-4.2-4.3-4.1-11.4,0.2-15.8l29.9-30.6c4.3-4.4,11.3-4.5,15.5-0.2l204.2,212.7 c2.2,2.2,3.2,5.2,3,8.1c0.1,3-0.9,5.9-3,8.1L176.7,476.8c-4.2,4.3-11.2,4.2-15.5-0.2L131.3,446c-4.3-4.4-4.4-11.5-0.2-15.8 L298.3,256z"/>
          </svg>
        </span>
      </button>

    </Backdrop>
  );
};

export default BackdropWithContent;