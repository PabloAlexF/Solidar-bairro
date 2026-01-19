import React from 'react';
import './InputField.css';

const InputField = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  error,
  helper,
  disabled = false,
  maxLength,
  ...props
}) => {
  const inputId = `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="input-field">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon">
            <Icon size={20} />
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          className={`input-control ${Icon ? 'has-icon' : ''} ${error ? 'error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          {...props}
        />
      </div>
      
      {error && (
        <div className="input-error" role="alert">
          {error}
        </div>
      )}
      
      {helper && !error && (
        <div className="input-helper">
          {helper}
        </div>
      )}
    </div>
  );
};

export default InputField;