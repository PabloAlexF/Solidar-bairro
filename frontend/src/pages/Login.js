import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import '../styles/pages/Login.css';

const Login = () => {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria a lógica de login
    console.log('Login:', formData);
    navigate('/home');
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
            <button type="submit" className="btn btn-primary">
              Entrar
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