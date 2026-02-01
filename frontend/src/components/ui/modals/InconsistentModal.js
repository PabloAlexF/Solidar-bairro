import React from "react";
import { AlertTriangle, Lightbulb, PenTool, ArrowRight } from "lucide-react";
import "./InconsistentModal.css";

export function InconsistentModal({ onEdit, onClose, validationResult }) {
  const { specificIssues = [], analysis } = validationResult || {};
  
  return (
    <div className="modal-overlay">
      <div className="success-modal-content premium compact error">
        <div className="success-icon-wrapper-v3 compact error">
          <AlertTriangle size={32} />
        </div>
        <h2 className="success-title-v3 compact">Pedido Precisa de Ajustes</h2>
        <div className="verification-badge-v3 error">IA DETECTOU PROBLEMAS</div>

        <div className="inconsistency-box">
          <p>{analysis || 'Nosso assistente Solidar-IA detectou inconsistências no seu pedido.'}</p>
          
          {specificIssues.length > 0 && (
            <div className="specific-issues-list">
              {specificIssues.map((issue, index) => (
                <div key={index} className="issue-item">
                  <div className="issue-header">
                    <Lightbulb size={16} />
                    <span className="issue-type">{issue.type}</span>
                  </div>
                  <p className="issue-message">{issue.message}</p>
                  {issue.suggestions && issue.suggestions.length > 0 && (
                    <div className="issue-suggestions">
                      <strong>Sugestões:</strong>
                      <ul>
                        {issue.suggestions.map((sug, i) => (
                          <li key={i}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="success-subtext compact">
          Ajuste seu pedido para aumentar as chances de receber ajuda.
        </p>

        <div className="action-buttons-stack">
          <button className="btn-edit-premium" onClick={onEdit}>
            <PenTool size={18} /> Corrigir Pedido
          </button>
          <button className="btn-cancel-plain" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}