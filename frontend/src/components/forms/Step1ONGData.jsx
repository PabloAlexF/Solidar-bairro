import React from 'react';
import { Building2 } from 'lucide-react';

export default function Step1ONGData({ formData, updateFormData }) {
  return (
    <div className="fam-reg-form-grid fam-reg-form-grid-2">
      <div className="fam-reg-input-group fam-reg-input-group-full">
        <label className="fam-reg-input-label">Nome Fantasia da ONG <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="fam-reg-input-wrapper">
          <Building2 className="fam-reg-input-icon" size={20} />
          <input
            required
            type="text"
            className="fam-reg-form-input"
            placeholder="Nome da organização"
            value={formData.nomeFantasia}
            onChange={(e) => updateFormData('nomeFantasia', e.target.value)}
          />
        </div>
      </div>
      <div className="fam-reg-input-group fam-reg-input-group-full">
        <label className="fam-reg-input-label">Razão Social <span style={{ color: '#ef4444' }}>*</span></label>
        <input
          required
          type="text"
          className="fam-reg-form-input"
          style={{ paddingLeft: '1rem' }}
          placeholder="Razão social completa"
          value={formData.razaoSocial}
          onChange={(e) => updateFormData('razaoSocial', e.target.value)}
        />
      </div>
    </div>
  );
}
