import React, { useState, useEffect } from 'react';
import ApiService from '../../services/apiService';
import './CollaborationCard.css';

const CollaborationCard = ({ interesseId, onFinish }) => {
  const [collaboration, setCollaboration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCollaboration();
  }, [interesseId]);

  const loadCollaboration = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getInteresse(interesseId);
      if (response.success) {
        const interesse = response.data;
        
        // Buscar dados do pedido
        const pedidoResponse = await ApiService.getPedido(interesse.pedidoId);
        if (pedidoResponse.success) {
          setCollaboration({
            ...interesse,
            pedido: pedidoResponse.data
          });
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'pendente': return 1;
      case 'aceito': return 2;
      case 'concluido': return 3;
      default: return 1;
    }
  };

  const getUrgencyClass = (urgency) => {
    if (!urgency) return 'medium';
    const urgencyLower = urgency.toLowerCase();
    if (urgencyLower.includes('alta') || urgencyLower.includes('high')) return 'high';
    if (urgencyLower.includes('baixa') || urgencyLower.includes('low')) return 'low';
    return 'medium';
  };

  const handleFinishCollaboration = async () => {
    try {
      await ApiService.request(`/interesses/${interesseId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'concluido' })
      });
      
      if (onFinish) {
        onFinish(interesseId);
      }
      
      await loadCollaboration();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="chat-context-card loading">
        <div className="loading-spinner">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-context-card error">
        <div className="error-message">Erro: {error}</div>
      </div>
    );
  }

  if (!collaboration) {
    return null;
  }

  const currentStep = getStatusStep(collaboration.status);
  const { pedido } = collaboration;

  return (
    <div className="chat-context-card">
      <div className="card-left-section">
        <div className="card-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package" aria-hidden="true">
            <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
            <path d="M12 22V12"></path>
            <polyline points="3.29 7 12 12 20.71 7"></polyline>
            <path d="m7.5 4.27 9 5.15"></path>
          </svg>
        </div>
        <div className="card-info-text">
          <h4>Resumo da Colaboração</h4>
          <p className="help-title">{pedido?.category || 'Ajuda'}</p>
          <div className="help-tags">
            <span className={`urgency-pill ${getUrgencyClass(pedido?.urgency)}`}>
              Urgência {pedido?.urgency || 'Média'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="card-middle-section">
        <div className="status-progress-bar">
          <div className={`status-step ${currentStep >= 1 ? 'completed' : ''}`}>
            <div className="step-dot">1</div>
            <span className="step-label">Pendente</span>
          </div>
          <div className="progress-line"></div>
          <div className={`status-step ${currentStep >= 2 ? 'completed' : ''}`}>
            <div className="step-dot">2</div>
            <span className="step-label">Em curso</span>
          </div>
          <div className="progress-line"></div>
          <div className={`status-step ${currentStep >= 3 ? 'completed' : ''}`}>
            <div className="step-dot">3</div>
            <span className="step-label">Concluído</span>
          </div>
        </div>
      </div>
      
      <div className="card-right-section">
        {currentStep < 3 && (
          <button 
            className="finish-collaboration-btn"
            onClick={handleFinishCollaboration}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart" aria-hidden="true">
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
            </svg>
            Finalizar Ajuda
          </button>
        )}
        {currentStep === 3 && (
          <div className="collaboration-completed">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="green" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
            Concluído
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationCard;