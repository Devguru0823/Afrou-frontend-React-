import React from 'react';
import './CircleLoader.css';

const circleLoader = props => {
  return (
    <div className="circle-loader" {...props}>Loading...</div>
  );
};

export default circleLoader;