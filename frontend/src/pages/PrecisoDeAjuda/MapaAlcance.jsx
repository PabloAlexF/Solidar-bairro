import React from 'react';

const MapaAlcance = ({ radius, onRadiusChange, userLocation }) => {
  return (
    <div style={{
      width: '100%',
      height: '300px',
      background: '#f3f4f6',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ margin: 0, color: '#374151' }}>Alcance do Pedido</h4>
        <p style={{ margin: '0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
          Raio de {radius}km
        </p>
      </div>
      
      <div style={{ width: '100%', maxWidth: '200px' }}>
        <input
          type="range"
          min="1"
          max="50"
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: '#e5e7eb',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
      </div>
      
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: '#f97316',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '0.75rem',
        fontWeight: 'bold'
      }}>
        Você
      </div>
    </div>
  );
};

export default MapaAlcance;