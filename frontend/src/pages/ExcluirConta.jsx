import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import ReusableHeader from '../components/layout/ReusableHeader';
import SimpleFooter from '../components/layout/SimpleFooter';
import ApiService from '../services/apiService';

export default function ExcluirConta() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha o email e a senha.');
      return;
    }

    if (confirmText !== 'EXCLUIR') {
      setError('Por favor, digite EXCLUIR para confirmar.');
      return;
    }

    setLoading(true);

    try {
      const result = await ApiService.deleteAccount();
      
      if (result.success) {
        setSubmitted(true);
        // Redirecionar para a página inicial após 3 segundos
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(result.error || 'Erro ao excluir conta. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao excluir conta:', err);
      setError(err.message || 'Erro ao excluir conta. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="excluir-conta-page">
      <ReusableHeader mobileLoginOnly={true} />

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '120px 2rem 4rem',
      }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#6b7280',
          textDecoration: 'none',
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              padding: '0.75rem',
              borderRadius: '12px',
              color: 'white'
            }}>
              <Trash2 size={24} />
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: 0,
              color: '#1e293b'
            }}>
              Excluir Conta
            </h1>
          </div>

          {!submitted ? (
            <>
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '2rem',
                display: 'flex',
                gap: '0.75rem'
              }}>
                <AlertTriangle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.9rem', color: '#991b1b' }}>
                  <strong>Atenção:</strong> Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
                </div>
              </div>

              <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                O que será excluído:
              </h2>
              <ul style={{ color: '#4b5563', marginBottom: '2rem', lineHeight: '1.8' }}>
                <li>Informações pessoais (nome, email, telefone, endereço)</li>
                <li>Histórico de conversas e mensagens</li>
                <li>Pedidos e doações realizados</li>
                <li>Fotos e documentos enviados</li>
                <li>Preferências e configurações</li>
              </ul>

              <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                Confirmar Exclusão:
              </h2>
              <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
                Para confirmar a exclusão da sua conta, insira suas credenciais e digite EXCLUIR no campo abaixo.
              </p>

              {error && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  color: '#dc2626',
                  fontSize: '0.9rem'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '0.5rem'
                  }}>
                    Email da conta *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '0.5rem'
                  }}>
                    Senha atual *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha atual"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '600',
                    color: '#dc2626',
                    marginBottom: '0.5rem'
                  }}>
                    Digite EXCLUIR para confirmar *
                  </label>
                  <input
                    type="text"
                    required
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="EXCLUIR"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      textTransform: 'uppercase'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Excluindo conta...
                    </>
                  ) : (
                    'Excluir Minha Conta'
                  )}
                </button>
              </form>

              <p style={{
                marginTop: '1.5rem',
                fontSize: '0.875rem',
                color: '#6b7280',
                textAlign: 'center'
              }}>
                Dúvidas? Entre em contato: <a href="mailto:privacidade@solidarbrasil.com" style={{ color: '#10b981' }}>privacidade@solidarbrasil.com</a>
              </p>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#dcfce7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                Conta Excluída
              </h2>
              <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
                Sua conta foi excluída com sucesso. Todos os seus dados foram removidos do sistema.
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Você será redirecionado para a página inicial em alguns segundos...
              </p>
            </div>
          )}
        </div>
      </div>

      <SimpleFooter />
    </div>
  );
}
