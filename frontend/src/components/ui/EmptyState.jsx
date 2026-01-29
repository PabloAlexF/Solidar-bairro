import React from 'react';
import { Search, FilterX } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ 
  title = "Nenhum resultado encontrado", 
  description = "Tente ajustar seus filtros ou termos de busca para encontrar o que procura.",
  actionLabel,
  onAction,
  icon: Icon = FilterX
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon-wrapper">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <button className="empty-state-button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;