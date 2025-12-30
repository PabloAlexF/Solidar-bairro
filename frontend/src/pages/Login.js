import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import apiService from '../services/apiService';

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
          <div className="login-header">
            <button 
              className="back-btn"
              onClick={() => navigate('/')}
            >
              ← Voltar
            </button>
            <h1>Entrar no SolidarBairro</h1>
            <p>Acesse sua conta para continuar ajudando</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message" style={{marginBottom: '20px', padding: '10px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c33'}}>
                {error}
              </div>
            )}
            <div className="form-group">
              <label>E-mail ou telefone</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="login-footer">
            <p>Ainda não tem conta?</p>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/cadastro')}
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Login;