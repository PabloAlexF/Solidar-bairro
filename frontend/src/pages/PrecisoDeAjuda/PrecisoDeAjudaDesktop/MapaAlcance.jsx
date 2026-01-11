import React from 'react';
import { MapPin, Minus, Plus } from 'lucide-react';

export const MapaAlcance = ({ radius, onRadiusChange, userLocation }) => {
  const adjustRadius = (delta) => {
    const newRadius = Math.max(1, Math.min(50, radius + delta));
    onRadiusChange(newRadius);
  };

  return (
    <div style={{
      background: '#f8fafc',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '16px',
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <MapPin size={16} />
        RAIO DE ALCANCE
      </div>

      <div style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        margin: '0 auto 20px',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid #0ea5e9'
      }}>
        <div style={{
          position: 'absolute',
          width: `${Math.min(180, (radius / 50) * 180)}px`,
          height: `${Math.min(180, (radius / 50) * 180)}px`,
          background: 'rgba(249, 115, 22, 0.2)',
          borderRadius: '50%',
          border: '2px dashed #f97316'
        }} />
        
        <div style={{
          width: '12px',
          height: '12px',
          background: '#f97316',
          borderRadius: '50%',
          border: '3px solid white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }} />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <button
          onClick={() => adjustRadius(-1)}
          disabled={radius <= 1}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid #e2e8f0',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: radius > 1 ? 'pointer' : 'not-allowed',
            opacity: radius <= 1 ? 0.5 : 1
          }}
        >
          <Minus size={16} />
        </button>

        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b',
          minWidth: '80px'
        }}>
          {radius} km
        </div>

        <button
          onClick={() => adjustRadius(1)}
          disabled={radius >= 50}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid #e2e8f0',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: radius < 50 ? 'pointer' : 'not-allowed',
            opacity: radius >= 50 ? 0.5 : 1
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      <div style={{
        fontSize: '12px',
        color: '#64748b',
        lineHeight: '1.4'
      }}>
        Pessoas em um raio de <strong>{radius}km</strong> da sua localização verão seu pedido
      </div>
    </div>
  );
};