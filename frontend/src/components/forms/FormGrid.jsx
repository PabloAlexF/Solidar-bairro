import React from 'react';
import './FormGrid.css';

const FormGrid = ({ children, columns = 1, gap = 'normal', className = '' }) => {
  const gridClass = `form-grid form-grid-${columns} form-grid-gap-${gap} ${className}`;
  
  return (
    <div className={gridClass}>
      {children}
    </div>
  );
};

export default FormGrid;