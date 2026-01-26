import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X, RefreshCw } from 'lucide-react';

// AI Validation Modal Component
export const AIValidationModal = ({ isOpen, onClose, validationResult, onAccept, onReview }) => {
  if (!isOpen) return null;
  
  const { isValid, validations, suggestions, confidence } = validationResult;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Assistente IA</h3>
                <p className="text-sm text-gray-500">Análise do seu pedido</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Confiança da Análise</span>
              <span className="text-lg font-bold text-blue-600">{confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            {Object.entries(validations).map(([key, validation]) => (
              <div key={key} className="flex items-start gap-3 p-3 rounded-lg border">
                {validation.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {validation.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {suggestions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Sugestões de Melhoria
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">{suggestion.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            {!isValid && (
              <button
                onClick={onReview}
                className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
              >
                Revisar Pedido
              </button>
            )}
            <button
              onClick={onAccept}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                isValid 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isValid ? 'Publicar Pedido' : 'Publicar Mesmo Assim'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analysis Notification Component
export const AnalysisNotification = ({ isVisible, stage, onComplete }) => {
  const stages = [
    { label: 'Analisando categoria...', duration: 1000 },
    { label: 'Verificando urgência...', duration: 1000 },
    { label: 'Avaliando descrição...', duration: 1500 },
    { label: 'Gerando sugestões...', duration: 500 }
  ];
  
  useEffect(() => {
    if (!isVisible) return;
    
    let currentStage = 0;
    const timer = setInterval(() => {
      if (currentStage < stages.length - 1) {
        currentStage++;
      } else {
        clearInterval(timer);
        setTimeout(onComplete, 500);
      }
    }, stages[currentStage]?.duration || 1000);
    
    return () => clearInterval(timer);
  }, [isVisible, onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 right-4 z-[9998] max-w-sm">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              Assistente IA Analisando
            </p>
            <p className="text-xs text-gray-500">
              {stages[stage]?.label || 'Finalizando análise...'}
            </p>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${((stage + 1) / stages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Notification Component
export const SuccessNotification = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 right-4 z-[9998] max-w-sm">
      <div className="bg-green-50 border border-green-200 rounded-xl shadow-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900">
              Pedido Publicado!
            </p>
            <p className="text-xs text-green-700">
              Sua solicitação está sendo analisada pela comunidade
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-green-100 rounded">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      </div>
    </div>
  );
};