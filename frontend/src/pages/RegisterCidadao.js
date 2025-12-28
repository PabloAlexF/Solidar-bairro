import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/CadastroFamilia.css';

const RegisterCidadao = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
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
  const [cidadeError, setCidadeError] = useState('');

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cidade') {
      const normalizedValue = value.toLowerCase().trim();
      const normalizedLagoaSanta = 'lagoa santa';
      
      if (value && normalizedValue !== normalizedLagoaSanta) {
        setCidadeError('Atualmente atendemos apenas Lagoa Santa - MG');
      } else {
        setCidadeError('');
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const normalizedCidade = formData.cidade.toLowerCase().trim();
    if (normalizedCidade !== 'lagoa santa') {
      setCidadeError('Atualmente atendemos apenas Lagoa Santa - MG');
      return;
    }
    
    console.log('Cadastro cidadão:', formData);
    navigate('/home');
  };

  return (
    <div className="cadastro-familia">
      <div className="container-wide">
        <div className="wizard-container">
          {currentStep === 1 && (
            <div className="page-intro">
              <h2>Cadastro de Cidadão</h2>
              <p>Preencha seus dados para começar a ajudar</p>
            </div>
          )}

          <div className="progress-bar">
            {[1, 2, 3].map((step) => (
              <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
                <div className="step-circle">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Dados Pessoais'}
                  {step === 2 && 'Endereço'}
                  {step === 3 && 'Senha'}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="wizard-form">
            {currentStep === 1 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="dados pessoais" width="32" height="32" style={{marginRight: '8px'}} /> Dados pessoais</h3>
                <div className="form-group">
                  <label>Nome completo *</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone *</label>
                    <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>E-mail</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png" alt="endereço" width="32" height="32" style={{marginRight: '8px'}} /> Endereço</h3>
                <div className="form-group">
                  <label>Endereço completo *</label>
                  <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Rua, número, complemento" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bairro *</label>
                    <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Cidade *</label>
                    <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Lagoa Santa" className={cidadeError ? 'error' : ''} required />
                    {cidadeError && <span className="error-message">{cidadeError}</span>}
                  </div>
                  <div className="form-group">
                    <label>CEP</label>
                    <input type="text" name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="senha" width="32" height="32" style={{marginRight: '8px'}} /> Senha de acesso</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Senha *</label>
                    <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Confirmar senha *</label>
                    <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required />
                  </div>
                </div>
              </div>
            )}

            <div className="wizard-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="btn btn-secondary">Voltar</button>
              )}
              {currentStep < totalSteps ? (
                <button type="button" onClick={nextStep} className="btn btn-primary">Próximo</button>
              ) : (
                <button type="submit" className="btn btn-primary btn-large">Criar conta</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterCidadao;