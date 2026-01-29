import React from 'react';
import './MapSkeleton.css';

const MapSkeleton = () => {
  return (
    <div className="map-skeleton-container">
      <div className="map-skeleton-grid" />
      <div className="map-skeleton-pulse" />
      <div className="map-skeleton-content">
        <div className="map-skeleton-loader" />
        <span className="map-skeleton-text">Carregando mapa...</span>
      </div>
    </div>
  );
};

export default MapSkeleton;