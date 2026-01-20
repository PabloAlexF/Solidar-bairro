import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  className = '',
  id,
  required = false,
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);
  
  const inputClasses = [
    'sb-input',
    hasError ? 'sb-input-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="sb-input-group">
      {label && (
        <label 
          htmlFor={inputId}
          className="sb-input-label"
        >
          {label}
          {required && <span className="sb-input-required">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        className={inputClasses}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${inputId}-error` : 
          helperText ? `${inputId}-helper` : undefined
        }
        {...props}
      />
      
      {error && (
        <div 
          id={`${inputId}-error`}
          className="sb-input-error-text"
          role="alert"
        >
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div 
          id={`${inputId}-helper`}
          className="sb-input-helper-text"
        >
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  required: PropTypes.bool
};

export default Input;