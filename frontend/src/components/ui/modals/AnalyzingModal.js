import React from "react";
import { Sparkles, Check } from "lucide-react";
import "./AnalyzingModal.css";

export function AnalyzingModal({ stages, analysisStage }) {
  return (
    <div className="modal-overlay">
      <div className="success-modal-content premium compact">
        <div className="analyzing-view">
          <div className="ai-scanner">
            <div className="scanner-line"></div>
            <Sparkles size={64} className="ai-icon-pulse" />
          </div>
          <div className="analysis-status">
            <h3>Analisando seu pedido de ajuda...</h3>
            <div className="stages-list">
              {stages.map((s, i) => (
                <div
                  key={i}
                  className={`stage-item ${
                    i === analysisStage ? "current" : i < analysisStage ? "done" : ""
                  }`}
                >
                  <div className="stage-dot">
                    {i < analysisStage ? <Check size={14} /> : <div className="dot-pulse" />}
                  </div>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}