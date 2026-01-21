import React from 'react';
import { Home, Building2, Compass, Sun, Sunrise, Warehouse, Map, CheckCircle2 } from 'lucide-react';

export default function Step4ONGAtuacao({ formData, updateFormData, selectedAreas, setSelectedAreas }) {
  return (
    <div className="fam-reg-form-grid">
      <div className="fam-reg-input-group fam-reg-input-group-full">
        <label className="fam-reg-input-label">Sede da ONG <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="fam-reg-input-wrapper">
          <Home className="fam-reg-input-icon" size={20} />
          <input
            required
            type="text"
            className="fam-reg-form-input"
            placeholder="Endereço completo da sede"
            value={formData.sede}
            onChange={(e) => updateFormData('sede', e.target.value)}
          />
        </div>
      </div>
      <div className="fam-reg-input-group fam-reg-input-group-full">
        <label className="fam-reg-input-label">Áreas de Cobertura (Selecione os bairros onde atuam)</label>
        <div className="fam-reg-coverage-grid">
          {[
            { name: "Centro", icon: <Building2 size={20} />, desc: "Região central" },
            { name: "Zona Norte", icon: <Compass size={20} />, desc: "Bairros norte" },
            { name: "Zona Sul", icon: <Sun size={20} />, desc: "Bairros sul" },
            { name: "Zona Leste", icon: <Sunrise size={20} />, desc: "Bairros leste" },
            { name: "Periferia", icon: <Warehouse size={20} />, desc: "Áreas periféricas" },
            { name: "Região Metropolitana", icon: <Map size={20} />, desc: "Cidades vizinhas" }
          ].map((zona) => {
            const isSelected = selectedAreas.includes(zona.name);
            return (
              <label key={zona.name} className="fam-reg-coverage-card">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    setSelectedAreas(prev =>
                      prev.includes(zona.name)
                        ? prev.filter(area => area !== zona.name)
                        : [...prev, zona.name]
                    );
                  }}
                />
                <div className="fam-reg-coverage-card-inner">
                  <div className="fam-reg-coverage-icon">
                    {zona.icon}
                  </div>
                  <h4 className="fam-reg-coverage-name">{zona.name}</h4>
                  <p className="fam-reg-coverage-desc">{zona.desc}</p>
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#8b5cf6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircle2 size={12} />
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
