import React from 'react';
import { Home, MapPin } from 'lucide-react';

const MapLocationButton = ({ isLocating, onClick }) => (
  <button 
    type="button" 
    className="step4-map-button"
    onClick={onClick}
    disabled={isLocating}
  >
    <div className="step4-map-icon">
      <MapPin size={24} className={isLocating ? 'animate-pulse' : ''} />
    </div>
    <div className="step4-map-info">
      <h4 className="step4-map-title">
        {isLocating ? 'Localizando...' : 'Localizar no Mapa'}
      </h4>
      <p className="step4-map-desc">
        {isLocating ? 'Obtendo localização' : 'Ajuda as ONGs a te encontrarem com precisão'}
      </p>
    </div>
  </button>
);

const Step4EnderecoData = ({ 
  formData, 
  updateFormData, 
  addressData, 
  setAddressData, 
  isLocating, 
  handleMapLocation 
}) => {
  const tipoMoradiaOptions = [
    'Casa Própria',
    'Casa Alugada', 
    'Apartamento',
    'Outros'
  ];

  return (
    <div className="step4-form-grid">
      {/* LINHA 1: Botão do Mapa (largura total) */}
      <div className="step4-map-section">
        <MapLocationButton 
          isLocating={isLocating} 
          onClick={handleMapLocation} 
        />
      </div>
      
      {/* LINHA 2: Endereço e Bairro (2 colunas) */}
      <div className="step4-input-group">
        <label className="step4-input-label">Endereço <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="step4-input-wrapper">
          <Home className="step4-input-icon" />
          <input 
            type="text" 
            className="step4-form-input" 
            placeholder="Rua, Avenida, etc."
            value={addressData.endereco}
            onChange={(e) => setAddressData(prev => ({ ...prev, endereco: e.target.value }))}
            required 
          />
        </div>
      </div>
      
      <div className="step4-input-group">
        <label className="step4-input-label">Bairro <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="step4-input-wrapper">
          <MapPin className="step4-input-icon" />
          <input 
            type="text" 
            className="step4-form-input" 
            placeholder="Nome do bairro"
            value={addressData.bairro}
            onChange={(e) => setAddressData(prev => ({ ...prev, bairro: e.target.value }))}
            required 
          />
        </div>
      </div>
      
      {/* LINHA 3: Ponto de Referência (largura total) */}
      <div className="step4-input-group step4-full-width">
        <label className="step4-input-label">Ponto de Referência</label>
        <div className="step4-input-wrapper">
          <MapPin className="step4-input-icon" />
          <input 
            type="text" 
            className="step4-form-input" 
            placeholder="Próximo a..."
            value={addressData.referencia}
            onChange={(e) => setAddressData(prev => ({ ...prev, referencia: e.target.value }))}
          />
        </div>
      </div>
      
      {/* LINHA 4: Tipo de Moradia - cards 2x2 */}
      <div className="step4-moradia-section">
        <label className="step4-input-label">Tipo de Moradia <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="step4-moradia-grid">
          {tipoMoradiaOptions.map((tipo) => (
            <label key={tipo} className="step4-moradia-label">
              <input 
                type="radio" 
                name="tipo_moradia" 
                value={tipo} 
                className="step4-moradia-input"
                checked={formData.tipoMoradia === tipo}
                onChange={(e) => updateFormData('tipoMoradia', e.target.value)}
              />
              <div className="step4-moradia-card">
                <div className="step4-moradia-icon">
                  <Home size={20} />
                </div>
                <div className="step4-moradia-title">{tipo}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step4EnderecoData;