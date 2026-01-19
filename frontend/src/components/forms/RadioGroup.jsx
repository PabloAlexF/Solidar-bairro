import React from 'react';
import './RadioGroup.css';

const RadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  columns = 2,
  error,
  helper
}) => {
  const groupId = `radio-group-${name}`;
  
  return (
    <div className="radio-group">
      {label && (
        <div className="radio-group-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </div>
      )}
      
      <div 
        className={`radio-options radio-columns-${columns}`}
        role="radiogroup"
        aria-labelledby={label ? groupId : undefined}
      >
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          const optionId = `${name}-${optionValue}`;
          
          return (
            <label key={optionValue} className="radio-option" htmlFor={optionId}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={optionValue}
                checked={value === optionValue}
                onChange={onChange}
                className="radio-input"
                required={required}
              />
              <div className="radio-box">
                <span className="radio-label">{optionLabel}</span>
                <div className="radio-indicator" />
              </div>
            </label>
          );
        })}
      </div>
      
      {error && (
        <div className="radio-error" role="alert">
          {error}
        </div>
      )}
      
      {helper && !error && (
        <div className="radio-helper">
          {helper}
        </div>
      )}
    </div>
  );
};

export default RadioGroup;