import React, { useState } from 'react';
import './Avatar.css';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  variant = 'circle', // circle, rounded
  className = '', 
  fallback 
}) => {
  const [error, setError] = useState(false);

  const getInitials = (name) => {
    if (!name) return '?';
    const str = String(name).trim();
    if (!str) return '?';
    const parts = str.split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={`avatar avatar-${size} ${variant === 'rounded' ? 'avatar-rounded' : ''} ${className}`}>
      {src && !error ? (
        <img 
          src={src} 
          alt={alt || 'Avatar'} 
          onError={() => setError(true)} 
          className="avatar-image"
        />
      ) : (
        <span className="avatar-initials">
          {fallback || getInitials(alt)}
        </span>
      )}
    </div>
  );
};

export default Avatar;