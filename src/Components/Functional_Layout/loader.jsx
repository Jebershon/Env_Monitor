import React from 'react';
import './loader.css';

const DotSpinner = () => {
  return (
    <div className='dot-bg'> 
    <div className="dot-spinner">
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
    </div>
    </div>
  );
};

export default DotSpinner;
