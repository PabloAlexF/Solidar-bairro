import React from 'react';
import { IdCard, Fingerprint, DollarSign, CheckCircle2 } from 'lucide-react';

const Step2DocumentosData = ({ formData, updateFormData, errors = {}, formatters }) => {
  const rendaOptions = [
    { 
      value: 'ate_500', 
      label: 'Até R$ 500',
      description: 'Renda muito baixa',
      icon: <DollarSign size={20} />
    },
    { 
      value: '501_1000', 
      label: 'R$ 501 - R$ 1.000',
      description: 'Renda baixa',
      icon: <DollarSign size={20} />
    },
    { 
      value: '1001_2000', 
      label: 'R$ 1.001 - R$ 2.000',
      description: 'Renda moderada',
      icon: <DollarSign size={20} />
    },
    { 
      value: 'acima_2000', 
      label: 'Acima de R$ 2.000',
      description: 'Renda adequada',
      icon: <DollarSign size={20} />
    }
  ];

  return (
    <div className="step2-form-grid">
      {/* LINHA 1: CPF e RG (2 colunas) */}
      <div className="step2-input-group">
        <label className="step2-input-label">CPF <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="step2-input-wrapper">
          <IdCard className="step2-input-icon" />
          <input 
            type="text" 
            className="step2-form-input" 
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={formatters.handleCPFChange}
            maxLength={14}
            required 
          />
        </div>
      </div>
      
      <div className="step2-input-group">
        <label className="step2-input-label">RG <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="step2-input-wrapper">
          <Fingerprint className="step2-input-icon" />
          <input 
            type="text" 
            className="step2-form-input" 
            placeholder="00.000.000-0"
            value={formData.rg}
            onChange={formatters.handleRGChange}
            maxLength={14}
            required 
          />
        </div>
      </div>
      
      {/* LINHA 2: NIS (largura total) */}
      <div className="step2-input-group step2-full-width">
        <label className="step2-input-label">NIS (Cadastro Único)</label>
        <div className="step2-input-wrapper">
          <IdCard className="step2-input-icon" />
          <input 
            type="text" 
            className="step2-form-input" 
            placeholder="000.00000.00-0 (se possuir)"
            value={formData.nis}
            onChange={(e) => updateFormData('nis', e.target.value)}
          />
        </div>
      </div>
      
      {/* LINHA 3: Renda Familiar - cards 2x2 */}
      <div className="step2-renda-section">
        <label className="step2-input-label">
          Renda Familiar Mensal <span style={{ color: '#ef4444' }}>*</span>
        </label>
        
        <div className="step2-renda-grid">
          {rendaOptions.map((renda) => (
            <label key={renda.value} className="step2-renda-label">
              <input
                type="radio"
                name="rendaFamiliar"
                value={renda.value}
                checked={formData.rendaFamiliar === renda.value}
                onChange={(e) => updateFormData('rendaFamiliar', e.target.value)}
                className="step2-renda-input"
                required
              />
              <div className="step2-renda-card">
                <div className="step2-renda-icon">
                  {renda.icon}
                </div>
                <div className="step2-renda-content">
                  <h4 className="step2-renda-title">{renda.label}</h4>
                  <p className="step2-renda-desc">{renda.description}</p>
                </div>
                <div className="step2-renda-check">
                  <CheckCircle2 size={16} />
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step2DocumentosData;