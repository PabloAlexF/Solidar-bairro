import React from 'react';
const PageWrapper = ({ 
  children, 
  className = '', 
  fullHeight = false,
  noPadding = false,
  containerSize = 'default'
}) => {
  const getContainerClass = () => {
    switch (containerSize) {
      case 'wide': return 'container-wide';
      case 'sm': return 'container-sm';
      case 'full': return 'container-full';
      default: return 'container';
    }
  };

  return (
    <div className={`page-wrapper ${fullHeight ? 'page-wrapper-full' : ''} ${className}`}>
      <div className={`page-container ${getContainerClass()} ${noPadding ? 'no-padding' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;