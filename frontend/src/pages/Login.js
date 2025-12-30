import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import apiService from '../services/apiService';
import '../styles/pages/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await apiService.login(formData.email, formData.senha);
      
      if (response.success) {
        // Salvar dados do usuário no localStorage
        localStorage.setItem('solidar-user', JSON.stringify(response.data.user));
        
        // Disparar evento para atualizar outros componentes
        window.dispatchEvent(new CustomEvent('userUpdated'));
        
        console.log('Login realizado:', response.data.user);
        navigate('/');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header showLoginButton={false} />
      <div className="login">
        <div className="container">
          <div className="login-content">
            {/* Header com badge e título */}
            <div className="login-header">
              <div className="login-badge">
                <span className="badge-text">🔐 Área do Usuário</span>
              </div>
              
              <div className="login-brand">
                <span className="brand-name">SolidarBairro</span>
                <h1 className="login-title">Bem-vindo de volta!</h1>
                <p className="login-subtitle">
                  Entre na sua conta e continue fazendo a diferença na sua comunidade
                </p>
              </div>
            </div>

            {/* Card do formulário */}
            <div className="login-card">
              <div className="login-card-header">
                <div className="login-icon">
                  <i className="fi fi-rr-user"></i>
                </div>
                <h2>Fazer Login</h2>
                <p>Acesse sua conta para continuar</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                {error && (
                  <div className="error-alert">
                    <i className="fi fi-rr-exclamation"></i>
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fi fi-rr-envelope"></i>
                    E-mail ou telefone
                  </label>
                  <input
                    id="email"
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Digite seu e-mail ou telefone"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="senha">
                    <i className="fi fi-rr-lock"></i>
                    Senha
                  </label>
                  <input
                    id="senha"
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
                
                <button type="submit" className="login-button" disabled={loading}>
                  <div className="button-content">
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Entrando...</span>
                      </>
                    ) : (
                      <>
                        <i className="fi fi-rr-sign-in-alt"></i>
                        <span>Entrar na plataforma</span>
                        <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </div>
                  <div className="button-glow"></div>
                </button>
              </form>

              <div className="login-divider">
                <div className="divider-line"></div>
                <span className="divider-text">
                  <i className="fi fi-rr-menu-dots"></i>
                  <span>ou continue com</span>
                  <i className="fi fi-rr-menu-dots"></i>
                </span>
                <div className="divider-line"></div>
              </div>

              <div className="login-footer">
                <div className="footer-content">
                  <div className="footer-text">
                    <i className="fi fi-rr-interrogation"></i>
                    <span>Ainda não faz parte da comunidade?</span>
                  </div>
                  <button 
                    className="register-button"
                    onClick={() => navigate('/cadastro')}
                  >
                    <div className="register-icon">
                      <i className="fi fi-rr-user-add"></i>
                    </div>
                    <div className="register-content">
                      <span className="register-title">Criar conta gratuita</span>
                      <span className="register-subtitle">Junte-se à rede de solidariedade</span>
                    </div>
                    <div className="register-arrow">
                      <i className="fi fi-rr-arrow-right"></i>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Botão voltar */}
            <div className="login-back">
              <button 
                className="back-button"
                onClick={() => navigate('/')}
              >
                <div className="back-icon">
                  <i className="fi fi-rr-arrow-left"></i>
                </div>
                <div className="back-content">
                  <span className="back-title">Voltar ao início</span>
                  <span className="back-subtitle">Explorar sem cadastro</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorações de fundo */}
        <div className="login-decorations">
          <div className="decoration decoration-1"></div>
          <div className="decoration decoration-2"></div>
          <div className="decoration decoration-3"></div>
        </div>
      </div>
    </>
  );
};

export default Login;