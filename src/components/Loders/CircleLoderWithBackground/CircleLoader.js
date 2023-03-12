import React from 'react';
import './CircleLoader.css';

const circleLoader = props => {
  return (
    <div className="circle-loader-background" {...props}>Loading...</div>
  );
};

export default circleLoader;