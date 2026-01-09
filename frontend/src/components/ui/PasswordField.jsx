import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordField = ({ 
  label = "Senha", 
  placeholder = "Digite sua senha", 
  required = true,
  className = "",
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`form-group ${className}`}>
      <label className="field-label input-label">{label}</label>
      <div className="input-with-icon input-wrapper password-field">
        <Lock className="field-icon input-icon" size={20} />
        <input
          type={showPassword ? "text" : "password"}
          className="form-input input-field"
          placeholder={placeholder}
          required={required}
          {...props}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;