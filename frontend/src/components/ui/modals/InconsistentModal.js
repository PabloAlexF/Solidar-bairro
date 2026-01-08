import React from "react";
import { AlertTriangle, Lightbulb, PenTool } from "lucide-react";
import "./InconsistentModal.css";

export function InconsistentModal({ onEdit, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="success-modal-content premium compact error">
        <div className="success-icon-wrapper-v3 compact error">
          <AlertTriangle size={32} />
        </div>
        <h2 className="success-title-v3 compact">Análise Inconclusiva</h2>
        <div className="verification-badge-v3 error">IA ALERTA</div>

        <div className="inconsistency-box">
          <p>
            Nosso assistente <strong>Solidar-IA</strong> não conseguiu validar seu pedido de ajuda.
          </p>
          <div className="error-reason">
            <Lightbulb size={16} />
            <span>
              O texto parece não ter clareza suficiente ou não condiz com a categoria selecionada.
            </span>
          </div>
        </div>

        <p className="success-subtext compact">
          Pedidos de ajuda precisam ser claros para garantir a segurança da comunidade.
        </p>

        <div className="action-buttons-stack">
          <button className="btn-edit-premium" onClick={onEdit}>
            <PenTool size={18} /> Ajustar Pedido
          </button>
          <button className="btn-cancel-plain" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}