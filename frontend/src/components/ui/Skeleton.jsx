import React from 'react';
import './Skeleton.css';

export const Skeleton = ({ className, style }) => {
  return <div className={`skeleton ${className || ''}`} style={style} />;
};

export const SkeletonListItem = () => (
  <div className="skeleton-list-item">
    <Skeleton className="skeleton-icon" />
    <div className="skeleton-content">
      <Skeleton className="skeleton-text-lg" />
      <Skeleton className="skeleton-text-sm" />
    </div>
    <div className="skeleton-actions">
      <Skeleton className="skeleton-badge" />
      <Skeleton className="skeleton-btn" />
    </div>
  </div>
);

export default Skeleton;