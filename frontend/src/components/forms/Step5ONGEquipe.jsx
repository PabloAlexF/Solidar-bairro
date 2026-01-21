import React from 'react';
import { Users } from 'lucide-react';

export default function Step5ONGEquipe({ formData, updateFormData }) {
  return (
    <div className="fam-reg-form-grid fam-reg-form-grid-2">
      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">Número de Voluntários</label>
        <input
          type="number"
          className="fam-reg-form-input"
          style={{ paddingLeft: '1rem' }}
          placeholder="Ex: 50"
          value={formData.numVoluntarios}
          onChange={(e) => updateFormData('numVoluntarios', e.target.value)}
        />
      </div>
      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">Colaboradores Fixos</label>
        <input
          type="number"
          className="fam-reg-form-input"
          style={{ paddingLeft: '1rem' }}
          placeholder="Ex: 10"
          value={formData.colaboradoresFixos}
          onChange={(e) => updateFormData('colaboradoresFixos', e.target.value)}
        />
      </div>
      <div className="fam-reg-info-box" style={{ background: '#4c1d95' }}>
        <div className="fam-reg-info-icon-box" style={{ color: '#ddd6fe' }}>
          <Users size={28} />
        </div>
        <div className="fam-reg-info-content">
          <h4>Gestão de Equipe</h4>
          <p>Após o cadastro, você poderá convidar sua equipe para gerenciar as demandas no painel.</p>
        </div>
      </div>
    </div>
  );
}
