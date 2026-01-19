import React from 'react';
import './FormStep.css';

const FormStep = ({ 
  title, 
  description, 
  children, 
  currentStep, 
  totalSteps,
  onNext,
  onPrev,
  canGoNext = true,
  isLastStep = false,
  isLoading = false
}) => {
  return (
    <div className="form-step">
      <div className="form-step-header">
        <div className="progress-indicator">
          <span className="step-badge">Etapa {currentStep} de {totalSteps}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        <h1 className="step-title">{title}</h1>
        <p className="step-description">{description}</p>
      </div>

      <div className="form-step-content">
        {children}
      </div>

      <div className="form-step-footer">
        {currentStep > 1 && (
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onPrev}
          >
            Anterior
          </button>
        )}
        
        <div className="spacer" />
        
        <button 
          type="submit"
          className={`btn ${isLastStep ? 'btn-success' : 'btn-primary'}`}
          disabled={!canGoNext || isLoading}
        >
          {isLoading ? 'Processando...' : isLastStep ? 'Finalizar' : 'Próximo'}
        </button>
      </div>
    </div>
  );
};

export default FormStep;