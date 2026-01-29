import React from 'react';
import './Badge.css';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '' 
}) => {
  // Helper to map API status to CSS classes
  const getVariantClass = (v) => {
    if (!v) return 'badge-default';
    const lowerV = v.toString().toLowerCase();
    
    // Success states
    if (['analyzed', 'verified', 'ativo', 'ok', 'success', 'active'].includes(lowerV)) {
      return 'badge-success';
    }
    
    // Warning/Pending states
    if (['pending', 'warning', 'analise', 'análise'].includes(lowerV)) {
      return 'badge-warning';
    }
    
    // Error states
    if (['rejected', 'error', 'danger', 'inactive'].includes(lowerV)) {
      return 'badge-error';
    }
    
    return 'badge-default';
  };

  return (
    <span className={`badge ${getVariantClass(variant)} badge-${size} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;