import React from 'react';
import { Phone, Mail, Globe } from 'lucide-react';
import PasswordField from '../ui/PasswordField';

export default function Step3ONGContact({ formData, updateFormData, formatters }) {
  return (
    <div className="fam-reg-form-grid fam-reg-form-grid-2">
      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">Telefone Comercial <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="fam-reg-input-wrapper">
          <Phone className="fam-reg-input-icon" size={20} />
          <input
            required
            type="tel"
            className="fam-reg-form-input"
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={formatters.handlePhoneChange}
            maxLength={15}
          />
        </div>
      </div>
      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">E-mail Institucional <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="fam-reg-input-wrapper">
          <Mail className="fam-reg-input-icon" size={20} />
          <input
            required
            type="email"
            className="fam-reg-form-input"
            placeholder="contato@ong.org"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
          />
        </div>
      </div>
      <div className="fam-reg-input-group fam-reg-input-group-full">
        <label className="fam-reg-input-label">Website ou Rede Social</label>
        <div className="fam-reg-input-wrapper">
          <Globe className="fam-reg-input-icon" size={20} />
          <input
            type="url"
            className="fam-reg-form-input"
            placeholder="https://www.suaong.org"
            value={formData.website}
            onChange={(e) => updateFormData('website', e.target.value)}
          />
        </div>
      </div>
      <PasswordField
        label="Senha de Acesso"
        placeholder="Crie uma senha segura"
        required
      />
      <PasswordField
        label="Confirmar Senha"
        placeholder="Digite a senha novamente"
        required
      />
    </div>
  );
}
