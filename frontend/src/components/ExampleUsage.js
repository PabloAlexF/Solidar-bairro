import React, { useState } from 'react';
import CustomSelect from './CustomSelect';

const ExampleUsage = () => {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const timeOptions = [
    { value: 'manha', label: 'Manhã (8h às 12h)' },
    { value: 'tarde', label: 'Tarde (12h às 18h)' },
    { value: 'noite', label: 'Noite (18h às 22h)' },
    { value: 'qualquer', label: 'Qualquer horário' }
  ];

  const categoryOptions = [
    { value: 'food', label: 'Alimentos' },
    { value: 'clothes', label: 'Roupas' },
    { value: 'meds', label: 'Medicamentos' },
    { value: 'bills', label: 'Contas' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h3>Exemplo de Uso - Custom Select</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Melhor horário:
        </label>
        <CustomSelect
          options={timeOptions}
          value={selectedTime}
          onChange={setSelectedTime}
          placeholder="Selecione um horário"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Categoria:
        </label>
        <CustomSelect
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Selecione uma categoria"
        />
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#f3f4f6', borderRadius: '8px' }}>
        <p><strong>Valores selecionados:</strong></p>
        <p>Horário: {selectedTime || 'Nenhum'}</p>
        <p>Categoria: {selectedCategory || 'Nenhuma'}</p>
      </div>
    </div>
  );
};

export default ExampleUsage;