import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Loader2, AlertCircle } from 'lucide-react';
import './AddressInput.css';

const AddressInput = ({ addressData = {}, setAddressData, required = false }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const suggestionRef = useRef(null);

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const searchCEP = async (cep) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;

    setIsSearching(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/address/cep/${cleanCEP}`);
      if (!response.ok) throw new Error('CEP não encontrado');

      const data = await response.json();
      setAddressData({
        ...addressData,
        cep: formatCEP(cleanCEP),
        endereco: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || ''
      });
    } catch (err) {
      setError('CEP não encontrado');
    } finally {
      setIsSearching(false);
    }
  };

  const searchAddresses = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const uf = addressData.estado || 'SP';
      const cidade = addressData.cidade || 'São Paulo';
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/address/search?uf=${uf}&cidade=${encodeURIComponent(cidade)}&logradouro=${encodeURIComponent(query)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.slice(0, 5)); // Limit to 5 suggestions
      }
    } catch (err) {
      console.error('Erro ao buscar endereços:', err);
    }
  };

  const handleCEPChange = (e) => {
    const formatted = formatCEP(e.target.value);
    if (formatted.length <= 9) {
      setAddressData({ ...addressData, cep: formatted });
      if (formatted.replace(/\D/g, '').length === 8) {
        searchCEP(formatted);
      }
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddressData({ ...addressData, endereco: value });
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for search
    const timeout = setTimeout(() => {
      searchAddresses(value);
      setShowSuggestions(true);
    }, 300);
    
    setSearchTimeout(timeout);
  };

  const selectSuggestion = (suggestion) => {
    setAddressData({
      ...addressData,
      endereco: suggestion.logradouro,
      bairro: suggestion.bairro,
      cidade: suggestion.localidade,
      estado: suggestion.uf,
      cep: suggestion.cep
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="address-input-container">
      <div className="address-input-group">
        <label>CEP {required && <span style={{color: '#ef4444'}}>*</span>}</label>
        <div className="address-input-wrapper">
          <Search size={20} />
          <input
            type="text"
            placeholder="00000-000"
            value={addressData.cep || ''}
            onChange={handleCEPChange}
            maxLength={9}
          />
          {isSearching && <Loader2 size={20} className="spin" />}
        </div>
        {error && <div className="error-msg"><AlertCircle size={16} />{error}</div>}
      </div>

      <div className="address-fields-grid">
        <div className="span-2" ref={suggestionRef}>
          <label>Endereço {required && <span style={{color: '#ef4444'}}>*</span>}</label>
          <div className="address-autocomplete">
            <input
              type="text"
              placeholder="Rua, Avenida, etc."
              value={addressData.endereco || ''}
              onChange={handleAddressChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              required={required}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="address-suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="address-suggestion-item"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    <MapPin size={16} />
                    <div>
                      <div className="suggestion-street">{suggestion.logradouro}</div>
                      <div className="suggestion-location">
                        {suggestion.bairro}, {suggestion.localidade} - {suggestion.uf}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <label>Número {required && <span style={{color: '#ef4444'}}>*</span>}</label>
          <input
            type="text"
            placeholder="123"
            value={addressData.numero || ''}
            onChange={(e) => setAddressData({ ...addressData, numero: e.target.value })}
            required={required}
          />
        </div>
        <div>
          <label>Bairro {required && <span style={{color: '#ef4444'}}>*</span>}</label>
          <input
            type="text"
            placeholder="Nome do bairro"
            value={addressData.bairro || ''}
            onChange={(e) => setAddressData({ ...addressData, bairro: e.target.value })}
            required={required}
          />
        </div>
        <div>
          <label>Cidade {required && <span style={{color: '#ef4444'}}>*</span>}</label>
          <input
            type="text"
            placeholder="Nome da cidade"
            value={addressData.cidade || ''}
            onChange={(e) => setAddressData({ ...addressData, cidade: e.target.value })}
            required={required}
          />
        </div>
        <div>
          <label>Estado {required && <span style={{color: '#ef4444'}}>*</span>}</label>
          <select
            value={addressData.estado || ''}
            onChange={(e) => setAddressData({ ...addressData, estado: e.target.value })}
            required={required}
          >
            <option value="">Selecione</option>
            <option value="SP">São Paulo</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="MG">Minas Gerais</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="PR">Paraná</option>
            <option value="SC">Santa Catarina</option>
            <option value="BA">Bahia</option>
            <option value="GO">Goiás</option>
            <option value="PE">Pernambuco</option>
            <option value="CE">Ceará</option>
          </select>
        </div>
        <div className="span-2">
          <label>Referência</label>
          <input
            type="text"
            placeholder="Próximo a..."
            value={addressData.referencia || ''}
            onChange={(e) => setAddressData({ ...addressData, referencia: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressInput;