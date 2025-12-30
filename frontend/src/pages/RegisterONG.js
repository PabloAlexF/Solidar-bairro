import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import apiService from '../services/apiService';
import '../styles/components/progress-steps.css';

const RegisterONG = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const totalSteps = 6;
  const [formData, setFormData] = useState({
    nomeEntidade: '',
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    responsavelNome: '',
    responsavelCpf: '',
    telefone: '',
    email: '',
    endereco: '',
    bairro: '',
    cidade: '',
    cep: '',
    descricaoAtuacao: '',
    areaTrabalho: '',
    estatutoSocial: null,
    ataDiretoria: null,
    certidoesNegativas: null,
    senha: '',
    confirmarSenha: '',
    aceitaTermos: false,
    aceitaPrivacidade: false,
    aceitaPoliticaOng: false,
    declaracaoVeracidade: false
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
    const { name, value, type, checked, files } = e.target;
    
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
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const normalizedCidade = formData.cidade.toLowerCase().trim();
    if (normalizedCidade !== 'lagoa santa') {
      setCidadeError('Atualmente atendemos apenas Lagoa Santa - MG');
      return;
    }
    
    if (!formData.aceitaTermos || !formData.aceitaPrivacidade || !formData.aceitaPoliticaOng || !formData.declaracaoVeracidade) {
      setError('Você deve aceitar todos os termos e declarações');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await apiService.createONG(formData);
      console.log('Cadastro ONG realizado:', response);
      alert('Cadastro enviado para verificação. Você receberá um e-mail em até 48h.');
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar ONG:', error);
      setError(error.message || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const areasTrabalho = [
    'Alimentação', 'Educação', 'Saúde', 'Roupas e Calçados', 'Moradia',
    'Assistência Social', 'Meio Ambiente', 'Cultura e Esporte', 'Direitos Humanos', 'Outros'
  ];

  return (
    <>
      <Header showLoginButton={false} />
      <div className="cadastro-familia">
      <div className="container-wide">
        <div className="wizard-container">
          {currentStep === 1 && (
            <div className="page-intro">
              <h2>Cadastro de ONG</h2>
              <p>Cadastro com verificação obrigatória de documentos</p>
            </div>
          )}

          <div className="progress-bar">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
                <div className="step-circle">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Entidade'}
                  {step === 2 && 'Responsável'}
                  {step === 3 && 'Endereço'}
                  {step === 4 && 'Documentos'}
                  {step === 5 && 'Senha'}
                  {step === 6 && 'Termos'}
                </div>
                {step < 6 && <div className={`progress-line ${currentStep > step ? 'completed' : ''}`}></div>}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="wizard-form">
            {error && (
              <div className="error-message" style={{marginBottom: '20px', padding: '10px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c33'}}>
                {error}
              </div>
            )}
            {currentStep === 1 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/3079/3079652.png" alt="entidade" width="32" height="32" style={{marginRight: '8px'}} /> Dados da Entidade</h3>
                <div className="form-group">
                  <label>Nome completo da entidade *</label>
                  <input type="text" name="nomeEntidade" value={formData.nomeEntidade} onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>CNPJ *</label>
                    <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" required />
                  </div>
                  <div className="form-group">
                    <label>Área de trabalho *</label>
                    <select name="areaTrabalho" value={formData.areaTrabalho} onChange={handleChange} required>
                      <option value="">Selecione</option>
                      {areasTrabalho.map(area => <option key={area} value={area}>{area}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Razão social *</label>
                    <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Nome fantasia</label>
                    <input type="text" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descrição da atuação *</label>
                  <textarea name="descricaoAtuacao" value={formData.descricaoAtuacao} onChange={handleChange} placeholder="Descreva as principais atividades da ONG" required />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="responsável" width="32" height="32" style={{marginRight: '8px'}} /> Responsável Legal</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome do responsável *</label>
                    <input type="text" name="responsavelNome" value={formData.responsavelNome} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>CPF do responsável *</label>
                    <input type="text" name="responsavelCpf" value={formData.responsavelCpf} onChange={handleChange} placeholder="000.000.000-00" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone institucional *</label>
                    <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>E-mail institucional *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png" alt="endereço" width="32" height="32" style={{marginRight: '8px'}} /> Endereço da Sede</h3>
                <div className="form-group">
                  <label>Endereço completo *</label>
                  <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} required />
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
                    <label>CEP *</label>
                    <input type="text" name="cep" value={formData.cep} onChange={handleChange} required />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="documentos" width="32" height="32" style={{marginRight: '8px'}} /> Documentos Obrigatórios</h3>
                <p style={{color: '#666', marginBottom: '20px'}}>Os documentos serão solicitados após a aprovação inicial.</p>
              </div>
            )}

            {currentStep === 5 && (
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

            {currentStep === 6 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="termos" width="32" height="32" style={{marginRight: '8px'}} /> Termos e Declarações</h3>
                <div className="checkbox-group">
                  <input type="checkbox" name="aceitaTermos" checked={formData.aceitaTermos} onChange={handleChange} required />
                  <label>Aceito os Termos de Uso *</label>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" name="aceitaPrivacidade" checked={formData.aceitaPrivacidade} onChange={handleChange} required />
                  <label>Aceito a Política de Privacidade *</label>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" name="aceitaPoliticaOng" checked={formData.aceitaPoliticaOng} onChange={handleChange} required />
                  <label>Aceito a Política de ONGs e Responsabilidade *</label>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" name="declaracaoVeracidade" checked={formData.declaracaoVeracidade} onChange={handleChange} required />
                  <label>Declaro que todas as informações são verdadeiras *</label>
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
                <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar para verificação'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegisterONG;