import React from 'react';

const socialShareBox = props => {
  return (
    <div className="socialtoshare" style={{display: props.visible ? 'block' : 'none'}}>
      <div className="urlpost">{`https://afrocamgist.com/post/${props.postId}`}</div>
      <ul>
        <li
          onClick={
            () => window.open(
              `https://www.facebook.com/sharer.php?u=https://afrocamgist.com/post/${props.postId}`,
              "_blank")
          }
        >
          <a>
            <i className="fa fa-facebook" title='Share on Facebook'/>
          </a>
        </li>
        <li
          onClick={
            () => window.open(
              `https://twitter.com/intent/tweet?url=https://afrocamgist.com/post/${props.postId}`,
              "_blank")
          }
        >
          <a>
            <i className="fa fa-twitter" title='Share on Twitter'/>
          </a>
        </li>
        <li
          onClick={
            () => window.open(
              `https://wa.me/?text=https://afrocamgist.com/post/${props.postId}`,
              "_blank")
          }
        >
          <a>
            <i className="fa fa-whatsapp" title='Share on Whatsapp'/>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default socialShareBox;