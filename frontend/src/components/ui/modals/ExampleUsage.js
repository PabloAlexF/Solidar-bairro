import React, { useState } from 'react';
import { AnalyzingModal, InconsistentModal, SuccessModal } from '../components/ui/modals';

export function ExampleModalUsage() {
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [showInconsistent, setShowInconsistent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);

  const stages = [
    'Verificando categoria e descrição',
    'Analisando urgência e contexto',
    'Validando dados de segurança',
    'Finalizando aprovação'
  ];

  const simulateAnalysis = () => {
    setShowAnalyzing(true);
    setAnalysisStage(0);
    
    const interval = setInterval(() => {
      setAnalysisStage(prev => {
        if (prev >= stages.length - 1) {
          clearInterval(interval);
          setShowAnalyzing(false);
          // 80% chance de sucesso
          if (Math.random() > 0.2) {
            setShowSuccess(true);
          } else {
            setShowInconsistent(true);
          }
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Exemplo de Uso dos Modais</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={simulateAnalysis}>
          Simular Análise Completa
        </button>
        <button onClick={() => setShowAnalyzing(true)}>
          Mostrar Analisando
        </button>
        <button onClick={() => setShowInconsistent(true)}>
          Mostrar Inconsistente
        </button>
        <button onClick={() => setShowSuccess(true)}>
          Mostrar Sucesso
        </button>
      </div>

      {/* Modal de Análise */}
      {showAnalyzing && (
        <AnalyzingModal 
          stages={stages} 
          analysisStage={analysisStage} 
        />
      )}

      {/* Modal de Inconsistência */}
      {showInconsistent && (
        <InconsistentModal
          onEdit={() => {
            setShowInconsistent(false);
            console.log('Editando pedido...');
          }}
          onClose={() => {
            setShowInconsistent(false);
            console.log('Cancelando...');
          }}
        />
      )}

      {/* Modal de Sucesso */}
      {showSuccess && (
        <SuccessModal
          urgencyColor="#ef4444"
          urgencyLabel="ALTA"
          urgencyIcon="🚨"
          reason="Pedido de ajuda validado com sucesso. Todas as informações estão claras e condizem com a categoria selecionada."
          onClose={() => {
            setShowSuccess(false);
            console.log('Indo para o mapa...');
          }}
        />
      )}
    </div>
  );
}