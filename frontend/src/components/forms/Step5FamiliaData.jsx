import React from 'react';
import { Users2, Info } from 'lucide-react';

const FamilyCounter = ({ item, count, onUpdate }) => (
  <div className="step5-family-card">
    <div className="step5-family-header">
      <span className="step5-family-emoji">{item.icon}</span>
      <span className="step5-family-label">{item.label}</span>
    </div>
    <div className="step5-family-counter">
      <button 
        type="button" 
        className="step5-counter-btn step5-counter-minus"
        onClick={() => onUpdate(item.key, -1)}
        disabled={count === 0}
      >
        -
      </button>
      <span className="step5-counter-display">{count}</span>
      <button 
        type="button" 
        className="step5-counter-btn step5-counter-plus"
        onClick={() => onUpdate(item.key, 1)}
      >
        +
      </button>
    </div>
  </div>
);

const Step5FamiliaData = ({ familyCount, updateFamilyCount }) => {
  const familyTypes = [
    { label: 'Crianças (0-12)', icon: '👶', key: 'criancas' },
    { label: 'Jovens (13-17)', icon: '👦', key: 'jovens' },
    { label: 'Adultos (18-59)', icon: '👨', key: 'adultos' },
    { label: 'Idosos (60+)', icon: '👴', key: 'idosos' }
  ];

  return (
    <div className="step5-form-container">
      <h3 className="step5-section-title">
        <Users2 size={24} color="#f97316" />
        Composição Familiar
      </h3>
      
      <div className="step5-family-grid">
        {familyTypes.map((item) => (
          <FamilyCounter
            key={item.key}
            item={item}
            count={familyCount[item.key]}
            onUpdate={updateFamilyCount}
          />
        ))}
      </div>
      
      <div className="step5-info-banner">
        <div className="step5-info-icon">
          <Info size={24} color="#f97316" />
        </div>
        <div className="step5-info-content">
          <h3>Informação Importante</h3>
          <p>Estes dados nos ajudam a dimensionar melhor o tipo de apoio que sua família precisa e conectar com ONGs especializadas.</p>
        </div>
      </div>
    </div>
  );
};

export default Step5FamiliaData;