import React from 'react';
import { Home, MapPin } from 'lucide-react';
import AddressInput from '../../ui/AddressInput';

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
      {/* Address Input with CEP */}
      <div className="step4-address-section">
        <AddressInput 
          addressData={addressData}
          setAddressData={setAddressData}
          required={true}
        />
      </div>
      
      {/* Tipo de Moradia */}
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