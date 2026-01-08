import React from "react";
import { Check, ShieldCheck } from "lucide-react";
import "./SuccessModal.css";

export function SuccessModal({
  urgencyColor,
  urgencyLabel,
  urgencyIcon,
  reason,
  onClose,
}) {
  return (
    <div className="modal-overlay">
      <div className="success-modal-content premium compact">
        <div className="success-icon-wrapper-v3 compact">
          <Check size={32} />
        </div>
        <h2 className="success-title-v3 compact">Pedido Publicado!</h2>
        <div className="verification-badge-v3">
          <ShieldCheck size={14} /> IA VERIFICADO
        </div>

        <div
          className="urgency-result-badge"
          style={{
            background: urgencyColor + "20",
            color: urgencyColor,
          }}
        >
          {urgencyIcon} URGÊNCIA: {urgencyLabel}
        </div>

        <p className="ai-reason-text">{reason}</p>

        <p className="success-subtext compact">Seu pedido de ajuda já está visível no mapa da comunidade.</p>

        <button className="btn-finish-premium compact" onClick={onClose}>
          Ver no Mapa
        </button>
      </div>
    </div>
  );
}