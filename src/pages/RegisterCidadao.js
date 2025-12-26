import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/RegisterForm.css';

const RegisterCidadao = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    bairro: '',
    cidade: '',
    cep: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria a lógica de cadastro
    console.log('Cadastro cidadão:', formData);
    navigate('/home');
  };

  return (
    <div className="register-form">
      <div className="container">
        <div className="form-content">
          <div className="form-header">
            <button 
              className="back-btn"
              onClick={() => navigate('/cadastro')}
            >
              ← Voltar
            </button>
            <h1>Cadastro de Cidadão</h1>
            <p>Preencha seus dados para começar a ajudar</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form-fields">
            <div className="form-section">
              <h3>Dados pessoais</h3>
              <div className="form-group">
                <label>Nome completo *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Telefone *</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Endereço</h3>
              <div className="form-group">
                <label>Endereço completo *</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Rua, número, complemento"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bairro *</label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cidade *</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Senha de acesso</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Senha *</label>
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirmar senha *</label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Criar conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterCidadao;