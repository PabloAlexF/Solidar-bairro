import React from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, Rocket, CheckCircle, AlertTriangle, Info, PenTool, Layers, Zap, Lightbulb, WifiOff, ArrowLeft } from 'lucide-react';

const getSuggestionIcon = (type) => {
  const lowerType = type?.toLowerCase() || '';
  if (lowerType.includes('description') || lowerType.includes('text')) {
    return <PenTool size={16} />;
  }
  if (lowerType.includes('category')) {
    return <Layers size={16} />;
  }
  if (lowerType.includes('urgency')) {
    return <Zap size={16} />;
  }
  if (lowerType.includes('error')) {
    return <AlertTriangle size={16} />;
  }
  return <Lightbulb size={16} />;
};

/**
 * Modal de validação da IA, estilizado como um bottom sheet para mobile.
 * Exibe o resultado da análise do pedido e oferece ações ao usuário.
 */
export const ValidationModal = ({ isOpen, onClose, validationResult, onReview, onAccept, shakeReviewButton }) => {
  if (!isOpen || !validationResult) return null;

  const { canPublish, analysis, confidence, suggestions = [] } = validationResult;
  const isErrorState = analysis === 'Erro de Conexão';

  return (
    <div className="pdam-modal-overlay" onClick={onClose}>
      <motion.div
        className="pdam-modal"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pdam-modal-header">
          <div className="pdam-validation-header">
            <div className={`pdam-validation-icon-wrapper ${isErrorState ? 'error' : canPublish ? 'success' : 'warning'}`}>
              {isErrorState ? <WifiOff size={24} /> : canPublish ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div className="pdam-validation-title">
              <h3>
                {isErrorState ? 'Falha na Conexão' : canPublish ? 'Análise Positiva' : 'Revisão Sugerida'}
              </h3>
              <p>
                {analysis || (canPublish ? 'Seu pedido parece ótimo!' : 'Encontramos pontos de melhoria.')}
              </p>
            </div>
          </div>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="pdam-validation-modal-content">
          {/* Confidence Score */}
          {!isErrorState && (
            <div className="pdam-confidence-score">
              <div className="pdam-confidence-header">
                <span className="pdam-confidence-label">Confiança da Análise</span>
                <span className={`pdam-confidence-value ${canPublish ? 'success' : 'warning'}`}>{confidence}%</span>
              </div>
              <div className="pdam-confidence-bar-bg">
                <div
                  className={`pdam-confidence-bar-fill ${canPublish ? 'success' : 'warning'}`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="pdam-suggestions-container">
              <h4 className="pdam-suggestions-title">
                <Info size={14} /> 
                {isErrorState ? 'Detalhes do Erro' : 'Sugestões de Melhoria'}
              </h4>
              {suggestions.map((suggestion, index) => (
                <div key={index} className={`pdam-suggestion-card ${suggestion.type === 'error' ? 'error' : ''}`}>
                  <div className="pdam-suggestion-icon">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="pdam-suggestion-text">
                    <p>{suggestion.message}</p>
                    {suggestion.evidence && <small>Evidência: {suggestion.evidence}</small>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pdam-validation-actions">
            {isErrorState ? (
              <button onClick={onClose} className="pdam-btn-next">
                <RefreshCw size={18} /> Tentar Novamente
              </button>
            ) : (
              <>
                {!canPublish && (
                  <button onClick={onReview} className={`pdam-btn-review ${shakeReviewButton ? 'shake' : ''}`}>
                    <ArrowLeft size={18} /> Revisar Pedido
                  </button>
                )}
                <button
                  onClick={onAccept}
                  className={canPublish ? "pdam-btn-publish" : "pdam-btn-secondary"}
                >
                  <Rocket size={18} /> {canPublish ? 'Publicar Agora' : 'Publicar Mesmo Assim'}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};