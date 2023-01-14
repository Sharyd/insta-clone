import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

const LoadingSpinner = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="48"
        visible={true}
      />
    </div>
  );
};

export default LoadingSpinner;
