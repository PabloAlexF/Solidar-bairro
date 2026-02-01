import React, { useEffect } from 'react';
import { X, Filter } from 'lucide-react';
import './BottomSheet.css';

const BottomSheet = ({ 
  isOpen, 
  onClose, 
  title = "Filtros",
  children,
  onApply,
  onClear
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="bottom-sheet-overlay" onClick={handleBackdropClick}>
      <div className="bottom-sheet-container">
        {/* Handle bar */}
        <div className="bottom-sheet-handle" />
        
        {/* Header */}
        <div className="bottom-sheet-header">
          <div className="bottom-sheet-title">
            <Filter size={20} />
            <h3>{title}</h3>
          </div>
          <button className="bottom-sheet-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="bottom-sheet-content">
          {children}
        </div>

        {/* Footer */}
        <div className="bottom-sheet-footer">
          <button className="bottom-sheet-btn-secondary" onClick={onClear}>
            Limpar
          </button>
          <button className="bottom-sheet-btn-primary" onClick={onApply}>
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;