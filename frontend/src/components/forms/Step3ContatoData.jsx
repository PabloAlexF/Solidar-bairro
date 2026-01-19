import React, { useState } from 'react';
import { Phone, Mail, Eye, EyeOff, Shield } from 'lucide-react';

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, text: '', color: '' };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    if (score < 2) return { level: 1, text: 'Muito fraca', color: '#ef4444' };
    if (score < 3) return { level: 2, text: 'Fraca', color: '#f59e0b' };
    if (score < 4) return { level: 3, text: 'Boa', color: '#10b981' };
    return { level: 4, text: 'Muito forte', color: '#059669' };
  };
  
  const strength = getStrength(password);
  
  if (!password) return null;
  
  return (
    <div className="step3-password-strength">
      <div className="step3-strength-bar">
        <div 
          className="step3-strength-fill" 
          style={{ 
            width: `${(strength.level / 4) * 100}%`,
            backgroundColor: strength.color 
          }}
        />
      </div>
      <span className="step3-strength-text" style={{ color: strength.color }}>
        {strength.text}
      </span>
    </div>
  );
};

const PasswordField = ({ label, value, onChange, placeholder, required, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="step3-password-field">
      <label className="step3-input-label">
        {label}
        {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      
      <div className="step3-password-wrapper">
        <Shield className="step3-input-icon" />
        
        <input
          type={showPassword ? 'text' : 'password'}
          className="step3-form-input step3-has-toggle"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        
        <button
          type="button"
          className="step3-password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      <PasswordStrengthIndicator password={value} />
    </div>
  );
};

const Step3ContatoData = ({ formData, updateFormData, errors = {}, formatters }) => {
  const horarioOptions = [
    'Manhã (8h-12h)',
    'Tarde (12h-18h)', 
    'Noite (18h-22h)',
    'Qualquer horário'
  ];

  const passwordsMatch = formData.senha && formData.confirmarSenha && 
                        formData.senha === formData.confirmarSenha;

  return (
    <div className="step3-form-grid">
      {/* LINHA 1: Telefone e WhatsApp (2 colunas) */}
      <div className="step3-input-group">
        <label className="step3-input-label">Telefone Principal <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="step3-input-wrapper">
          <Phone className="step3-input-icon" />
          <input 
            type="tel" 
            className="step3-form-input" 
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={formatters.handlePhoneChange}
            maxLength={15}
            required 
          />
        </div>
      </div>
      
      <div className="step3-input-group">
        <label className="step3-input-label">WhatsApp</label>
        <div className="step3-input-wrapper">
          <Phone className="step3-input-icon" />
          <input 
            type="tel" 
            className="step3-form-input" 
            placeholder="(00) 00000-0000"
            value={formData.whatsapp}
            onChange={formatters.handleWhatsAppChange}
            maxLength={15}
          />
        </div>
      </div>
      
      {/* LINHA 2: E-mail (largura total) */}
      <div className="step3-input-group step3-full-width">
        <label className="step3-input-label">E-mail</label>
        <div className="step3-input-wrapper">
          <Mail className="step3-input-icon" />
          <input 
            type="email" 
            className="step3-form-input" 
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
          />
        </div>
      </div>
      
      {/* LINHA 3: Melhor horário - radio grid 2x2 */}
      <div className="step3-radio-section">
        <label className="step3-input-label">Melhor horário para contato <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="step3-radio-grid">
          {horarioOptions.map((horario) => (
            <label key={horario} className="step3-radio-label">
              <input 
                type="radio" 
                name="horario" 
                value={horario} 
                className="step3-radio-input"
                checked={formData.horarioContato === horario}
                onChange={(e) => updateFormData('horarioContato', e.target.value)}
              />
              <div className="step3-radio-box">{horario}</div>
            </label>
          ))}
        </div>
      </div>
      
      {/* LINHA 4: Senhas (2 colunas) */}
      <PasswordField
        label="Senha de Acesso"
        placeholder="Crie uma senha segura"
        value={formData.senha}
        onChange={(e) => updateFormData('senha', e.target.value)}
        required
        error={errors.senha}
      />
      
      <div className="step3-confirm-password">
        <PasswordField
          label="Confirmar Senha"
          placeholder="Digite a senha novamente"
          value={formData.confirmarSenha}
          onChange={(e) => updateFormData('confirmarSenha', e.target.value)}
          required
          error={errors.confirmarSenha}
        />
        
        {formData.confirmarSenha && (
          <div className={`step3-password-match ${passwordsMatch ? 'match' : 'no-match'}`}>
            {passwordsMatch ? '✓ Senhas coincidem' : '✗ Senhas não coincidem'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3ContatoData;