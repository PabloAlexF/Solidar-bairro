import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const AddressInput = ({ addressData, setAddressData, required = false }) => {
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const formatCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      return;
    }

    setIsFetchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        // Show error toast or something
        console.error('CEP não encontrado');
        setAddressData(prev => ({
          ...prev,
          endereco: '',
          bairro: '',
          cidade: '',
          estado: ''
        }));
      } else {
        setAddressData(prev => ({
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsFetchingCep(false);
    }
  };

  const updateField = (field, value) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="address-input-grid">
      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">CEP {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
        <div className="fam-reg-input-wrapper">
          <MapPin className="fam-reg-input-icon" size={20} />
          <input
            type="text"
            className="fam-reg-form-input"
            placeholder="00000-000"
            value={addressData.cep || ''}
            onChange={(e) => updateField('cep', formatCEP(e.target.value))}
            onBlur={handleCepBlur}
            maxLength={9}
            required={required}
          />
          {isFetchingCep && <div className="fam-reg-spinner" />}
        </div>
      </div>

      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">Endereço (Rua, Av.) {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
        <input
          type="text"
          className="fam-reg-form-input"
          placeholder="Sua rua ou avenida"
          value={addressData.endereco || ''}
          onChange={(e) => updateField('endereco', e.target.value)}
          disabled={isFetchingCep}
          required={required}
        />
      </div>

      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">Número {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
        <input
          type="text"
          className="fam-reg-form-input"
          placeholder="Nº"
          value={addressData.numero || ''}
          onChange={(e) => updateField('numero', e.target.value)}
          required={required}
        />
      </div>

      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">Bairro {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
        <input
          type="text"
          className="fam-reg-form-input"
          placeholder="Seu bairro"
          value={addressData.bairro || ''}
          onChange={(e) => updateField('bairro', e.target.value)}
          disabled={isFetchingCep}
          required={required}
        />
      </div>

      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">Cidade {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
        <input
          type="text"
          className="fam-reg-form-input"
          placeholder="Sua cidade"
          value={addressData.cidade || ''}
          onChange={(e) => updateField('cidade', e.target.value)}
          disabled={isFetchingCep}
          required={required}
        />
      </div>

      <div className="fam-reg-input-group">
        <label className="fam-reg-input-label">Estado {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
        <input
          type="text"
          className="fam-reg-form-input"
          placeholder="UF"
          value={addressData.estado || ''}
          onChange={(e) => updateField('estado', e.target.value)}
          disabled={isFetchingCep}
          required={required}
        />
      </div>

      <div className="fam-reg-input-group fam-reg-input-group-full">
        <label className="fam-reg-input-label">Complemento / Referência</label>
        <input
          type="text"
          className="fam-reg-form-input"
          placeholder="Apto, bloco, etc."
          value={addressData.referencia || ''}
          onChange={(e) => updateField('referencia', e.target.value)}
        />
      </div>
    </div>
  );
};

export default AddressInput;
