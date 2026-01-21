import React from 'react';
import { FileText, Calendar } from 'lucide-react';

export default function Step2ONGLegal({ formData, updateFormData, formatters }) {
  return (
    <div className="fam-reg-form-grid fam-reg-form-grid-2">
      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">CNPJ <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="fam-reg-input-wrapper">
          <FileText className="fam-reg-input-icon" size={20} />
          <input
            required
            type="text"
            className="fam-reg-form-input"
            placeholder="00.000.000/0000-00"
            value={formData.cnpj}
            onChange={formatters.handleCNPJChange}
            maxLength={18}
          />
        </div>
      </div>
      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">Data de Fundação <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="fam-reg-input-wrapper">
          <Calendar className="fam-reg-input-icon" size={20} />
          <input
            required
            type="date"
            className="fam-reg-form-input"
            value={formData.dataFundacao}
            onChange={(e) => updateFormData('dataFundacao', e.target.value)}
          />
        </div>
      </div>
      <div className="fam-reg-info-box">
        <div className="fam-reg-info-icon-box">
          <FileText size={28} />
        </div>
        <div className="fam-reg-info-content">
          <h4>Validação Necessária</h4>
          <p>ONGs cadastradas passam por uma auditoria documental para garantir a segurança da plataforma.</p>
        </div>
      </div>
    </div>
  );
}
