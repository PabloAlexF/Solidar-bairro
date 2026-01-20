import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ 
  size = 'base', 
  className = '',
  fullScreen = false,
  text = '',
  ...props 
}) => {
  const sizeClasses = size !== 'base' ? `sb-loading-${size}` : '';
  
  const spinnerClasses = [
    'sb-loading',
    sizeClasses,
    className
  ].filter(Boolean).join(' ');

  const content = (
    <div className="sb-loading-container">
      <div className={spinnerClasses} {...props} />
      {text && <p className="sb-loading-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="sb-loading-fullscreen">
        {content}
      </div>
    );
  }

  return content;
};

const Skeleton = ({ 
  width = '100%', 
  height = '20px', 
  className = '',
  ...props 
}) => {
  const style = {
    width,
    height,
    ...props.style
  };

  return (
    <div 
      className={`sb-skeleton ${className}`}
      style={style}
      {...props}
    />
  );
};

Loading.Skeleton = Skeleton;

Loading.propTypes = {
  size: PropTypes.oneOf(['sm', 'base', 'lg']),
  className: PropTypes.string,
  fullScreen: PropTypes.bool,
  text: PropTypes.string
};

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string
};

export default Loading;
