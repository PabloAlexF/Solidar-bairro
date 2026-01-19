import React from 'react';
import { User, Calendar } from 'lucide-react';

const Step1ResponsavelData = ({ formData, updateFormData, errors = {} }) => {
  const estadoCivilOptions = [
    'Solteiro(a)',
    'Casado(a)', 
    'Divorciado(a)',
    'Viúvo(a)'
  ];

  return (
    <div className="step1-form-grid">
      {/* LINHA 1: Nome e Data (2 colunas) */}
      <div className="step1-input-group">
        <label className="step1-input-label">Nome Completo <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="step1-input-wrapper">
          <User className="step1-input-icon" />
          <input 
            type="text" 
            className="step1-form-input" 
            placeholder="Digite seu nome completo"
            value={formData.nomeCompleto}
            onChange={(e) => updateFormData('nomeCompleto', e.target.value)}
            required 
          />
        </div>
      </div>
      
      <div className="step1-input-group">
        <label className="step1-input-label">Data de Nascimento <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="step1-input-wrapper">
          <Calendar className="step1-input-icon" />
          <input 
            type="date" 
            className="step1-form-input"
            value={formData.dataNascimento}
            onChange={(e) => updateFormData('dataNascimento', e.target.value)}
            required 
          />
        </div>
      </div>
      
      {/* LINHA 2: Estado Civil (largura total - grid 2x2) */}
      <div className="step1-radio-section">
        <label className="step1-input-label">Estado Civil <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="step1-radio-grid">
          {estadoCivilOptions.map((estado) => (
            <label key={estado} className="step1-radio-label">
              <input 
                type="radio" 
                name="estado_civil" 
                value={estado} 
                className="step1-radio-input"
                checked={formData.estadoCivil === estado}
                onChange={(e) => updateFormData('estadoCivil', e.target.value)}
              />
              <div className="step1-radio-box">{estado}</div>
            </label>
          ))}
        </div>
      </div>
      
      {/* LINHA 3: Profissão (largura total) */}
      <div className="step1-input-group step1-full-width">
        <label className="step1-input-label">Profissão <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="step1-input-wrapper">
          <User className="step1-input-icon" />
          <input 
            type="text" 
            className="step1-form-input" 
            placeholder="Qual sua profissão?"
            value={formData.profissao}
            onChange={(e) => updateFormData('profissao', e.target.value)}
            required 
          />
        </div>
      </div>
    </div>
  );
};

export default Step1ResponsavelData;