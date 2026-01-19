import React from 'react';
import { ListChecks, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Step6NecessidadesData = ({ formData, handleCheckboxChange }) => {
  const necessidades = [
    'Alimentação', 
    'Roupas', 
    'Medicamentos', 
    'Material Escolar',
    'Móveis', 
    'Eletrodomésticos', 
    'Consultas Médicas', 
    'Cursos Profissionalizantes'
  ];

  return (
    <div className="step6-form-container">
      <h3 className="step6-section-title">
        <ListChecks size={24} color="#f97316" />
        Principais Necessidades
      </h3>
      
      <div className="step6-needs-grid">
        {necessidades.map((need) => (
          <label key={need} className="step6-need-item">
            <input 
              type="checkbox" 
              name="necessidades" 
              value={need} 
              className="step6-need-input"
              checked={formData.necessidades.includes(need)}
              onChange={(e) => handleCheckboxChange('necessidades', need, e.target.checked)}
            />
            <div className="step6-need-box">
              <span className="step6-need-label">{need}</span>
              <div className="step6-check-circle">
                <CheckCircle2 size={16} />
              </div>
            </div>
          </label>
        ))}
      </div>
      
      <div className="step6-final-section">
        <div className="step6-final-card">
          <h3 className="step6-final-title">Quase Pronto!</h3>
          <p className="step6-final-text">
            Revise suas informações e clique em "Finalizar Cadastro" para enviar sua solicitação.
          </p>
          <div className="step6-final-warning">
            <ShieldCheck className="step6-warning-icon" size={24} />
            <p className="step6-warning-text">
              Seus dados serão analisados em até 24 horas. Você receberá uma confirmação por telefone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step6NecessidadesData;