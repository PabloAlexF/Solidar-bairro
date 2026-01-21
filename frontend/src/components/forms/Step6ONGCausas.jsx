import React from 'react';
import { Heart, Award } from 'lucide-react';

export default function Step6ONGCausas({ formData, handleCheckboxChange }) {
  return (
    <div className="fam-reg-form-grid">
      <div className="fam-reg-input-group fam-reg-input-group-full">
        <label className="fam-reg-input-label">Causas Principais</label>
        <div className="fam-reg-checkbox-grid">
          {[
            "Segurança Alimentar",
            "Educação e Cultura",
            "Saúde e Bem-estar",
            "Meio Ambiente",
            "Direitos Humanos",
            "Proteção Animal"
          ].map((causa) => (
            <label key={causa} className="fam-reg-checkbox-card">
              <input
                type="checkbox"
                checked={formData.causas.includes(causa)}
                onChange={(e) => handleCheckboxChange('causas', causa, e.target.checked)}
              />
              <span>{causa}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="fam-reg-final-box">
        <Award size={48} />
        <p>Ao se registrar, sua ONG ganha visibilidade para doadores e torna-se um ponto oficial de apoio no bairro.</p>
      </div>
    </div>
  );
}
