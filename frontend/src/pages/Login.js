import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import apiService from '../services/apiService';
import '../styles/pages/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
            {/* Card do formulário */}
            <div className="login-card">
              {/* Botão voltar - desktop */}
              <div className="login-back-desktop">
                <button 
                  className="back-button-desktop"
                  onClick={() => navigate('/')}
                >
                  <div className="back-icon">
                    <i className="fi fi-rr-arrow-left"></i>
                  </div>
                </button>
              </div>

              <div className="login-card-header">
                <div className="login-card-header-content">
                  <h2>Fazer Login</h2>
                  <p>Acesse sua conta para continuar</p>
                </div>
                <div className="login-icon">
                  <i className="fi fi-rr-user"></i>
                </div>
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
                  <div className="password-input-wrapper">
                    <input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      placeholder="Digite sua senha"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'}`}></i>
                    </button>
                  </div>
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

              {/* Botão voltar - mobile */}
              <div className="login-back-mobile">
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