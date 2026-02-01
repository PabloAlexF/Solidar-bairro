import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import './PullToRefresh.css';

const PullToRefresh = ({ onRefresh, children, threshold = 60 }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setCanPull(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!canPull || isRefreshing) return;
    
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    if (diff > 0 && window.scrollY === 0) {
      e.preventDefault();
      const resistance = Math.min(diff * 0.5, threshold * 1.5);
      setPullDistance(resistance);
    }
  };

  const handleTouchEnd = async () => {
    if (!canPull || isRefreshing) return;
    
    setCanPull(false);
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
  };

  const getRefreshStatus = () => {
    if (isRefreshing) return 'refreshing';
    if (pullDistance >= threshold) return 'ready';
    if (pullDistance > 0) return 'pulling';
    return 'idle';
  };

  const getRefreshText = () => {
    const status = getRefreshStatus();
    switch (status) {
      case 'pulling': return 'Puxe para atualizar';
      case 'ready': return 'Solte para atualizar';
      case 'refreshing': return 'Atualizando...';
      default: return '';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="pull-to-refresh-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className={`pull-to-refresh-indicator ${getRefreshStatus()}`}
        style={{ 
          height: `${Math.min(pullDistance, threshold)}px`,
          opacity: pullDistance > 0 ? 1 : 0
        }}
      >
        <div className="pull-to-refresh-content">
          <RefreshCw 
            className={`pull-to-refresh-icon ${isRefreshing ? 'spinning' : ''}`} 
            size={20} 
          />
          <span className="pull-to-refresh-text">{getRefreshText()}</span>
        </div>
      </div>
      
      <div 
        className="pull-to-refresh-children"
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;