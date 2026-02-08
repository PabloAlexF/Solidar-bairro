import React, { useState } from 'react';
import { X, FileText, Shield, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsModal({ isOpen, onClose, onAccept, title, type }) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="terms-modal" style={{
        background: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="terms-modal-header" style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {type === 'terms' ? (
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                padding: '0.5rem',
                borderRadius: '8px',
                color: 'white'
              }}>
                <FileText size={20} />
              </div>
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                padding: '0.5rem',
                borderRadius: '8px',
                color: 'white'
              }}>
                <Shield size={20} />
              </div>
            )}
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0
              }}>
                {title}
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0.25rem 0 0 0'
              }}>
                Leia atentamente antes de continuar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <X size={20} />
          </button>
        </div>

        <div className="terms-modal-content" style={{
          padding: '2rem',
          overflowY: 'auto',
          flex: 1
        }}>
          {type === 'terms' ? (
            <div className="terms-content">
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  1. Aceitação dos Termos
                </h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                  Ao usar o SolidarBairro, você concorda em cumprir estes Termos de Uso. Se não concordar,
                  não poderá acessar o serviço.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  2. Responsabilidades do Usuário
                </h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                  Você se compromete a fornecer informações verdadeiras, manter a confidencialidade da senha,
                  usar a plataforma para fins de solidariedade e respeitar outros usuários.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  3. Privacidade e Dados
                </h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                  Seus dados são protegidos conforme nossa Política de Privacidade e a LGPD.
                  Não compartilhamos informações sem consentimento.
                </p>
              </div>

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link
                  to="/termos-uso"
                  target="_blank"
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}
                >
                  Ler termos completos →
                </Link>
              </div>
            </div>
          ) : (
            <div className="privacy-content">
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  Como protegemos seus dados
                </h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                  Coletamos apenas dados necessários para conectar famílias e ONGs. Seus dados são criptografados,
                  armazenados com segurança e usados exclusivamente para fins de solidariedade social.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  Seus direitos (LGPD)
                </h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                  Você tem direito de acessar, corrigir, excluir seus dados e revogar consentimentos a qualquer momento.
                  Não vendemos nem compartilhamos seus dados sem autorização.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  Segurança
                </h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                  Utilizamos criptografia, controle de acesso e monitoramento contínuo para proteger suas informações.
                  Seus dados são mantidos apenas pelo tempo necessário.
                </p>
              </div>

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link
                  to="/politica-privacidade"
                  target="_blank"
                  style={{
                    color: '#10b981',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}
                >
                  Ler política completa →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="terms-modal-footer" style={{
          padding: '1.5rem 2rem',
          borderTop: '1px solid #e5e7eb',
          background: '#f9fafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              id="accept-terms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              style={{
                width: '1.125rem',
                height: '1.125rem',
                borderRadius: '4px',
                border: '2px solid #d1d5db',
                background: accepted ? '#3b82f6' : 'white',
                cursor: 'pointer'
              }}
            />
            <label
              htmlFor="accept-terms"
              style={{
                fontSize: '0.9rem',
                color: '#374151',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              Li e concordo com os {type === 'terms' ? 'Termos de Uso' : 'Política de Privacidade'}
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#d1d5db';
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleAccept}
              disabled={!accepted}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: accepted ? (type === 'terms' ? '#3b82f6' : '#10b981') : '#d1d5db',
                color: 'white',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: accepted ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (accepted) {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (accepted) {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <CheckCircle2 size={16} />
              Aceitar e Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
