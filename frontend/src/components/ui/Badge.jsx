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
    
    // Success states (Verde)
    if (['analyzed', 'verified', 'ativo', 'active', 'approved', 'success'].includes(lowerV)) {
      return 'badge-success';
    }
    
    // Warning/Pending states (Amarelo)
    if (['pending', 'warning', 'analise', 'análise', 'aguardando'].includes(lowerV)) {
      return 'badge-warning';
    }
    
    // Error states (Vermelho)
    if (['rejected', 'error', 'danger', 'inactive', 'inativo', 'rejeitado'].includes(lowerV)) {
      return 'badge-error';
    }
    
    // Info states (Azul)
    if (['info', 'information'].includes(lowerV)) {
      return 'badge-info';
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