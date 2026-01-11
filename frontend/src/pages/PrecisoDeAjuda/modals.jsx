import React from 'react';

export const AnalyzingModal = ({ stages, analysisStage }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      textAlign: 'center',
      maxWidth: '400px'
    }}>
      <h3>Analisando pedido...</h3>
      <p>{stages[analysisStage]}</p>
      <div style={{ marginTop: '1rem' }}>
        <div style={{
          width: '100%',
          height: '4px',
          background: '#f0f0f0',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((analysisStage + 1) / stages.length) * 100}%`,
            height: '100%',
            background: '#f97316',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  </div>
);

export const SuccessModal = ({ urgencyColor, urgencyLabel, urgencyIcon, reason, onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      textAlign: 'center',
      maxWidth: '400px'
    }}>
      <div style={{ color: '#10b981', fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
      <h3>Pedido Publicado!</h3>
      <p>{reason}</p>
      <button 
        onClick={onClose}
        style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Continuar
      </button>
    </div>
  </div>
);

export const InconsistentModal = ({ onEdit, onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      textAlign: 'center',
      maxWidth: '400px'
    }}>
      <div style={{ color: '#ef4444', fontSize: '3rem', marginBottom: '1rem' }}>⚠</div>
      <h3>Pedido Inconsistente</h3>
      <p>Detectamos algumas inconsistências no seu pedido. Por favor, revise as informações.</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button 
          onClick={onEdit}
          style={{
            background: '#f97316',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Editar
        </button>
        <button 
          onClick={onClose}
          style={{
            background: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
);