import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import apiService from '../services/apiService';
import '../styles/pages/CadastroFamilia.css';
const CadastroFamilia = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const totalSteps = 5;
  const [formData, setFormData] = useState({
    // Dados do responsável
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    email: '',
    tipoCadastro: '',
    
    // Endereço
    endereco: '',
    bairro: '',
    pontoReferencia: '',
    
    // Composição familiar
    numeroPessoas: '1',
    criancas: '0',
    adolescentes: '0',
    adultos: '0',
    idosos: '0',
    gestantes: false,
    pessoasDeficiencia: false,
    familiaChefiadaMulher: false,
    situacaoRua: false,
    
    // Situação socioeconômica
    rendaFamiliar: '',
    semEmpregoFormal: false,
    recebeBeneficio: false,
    situacaoFamilia: '',
    
    // Necessidades
    necessidades: []
  });

  const bairros = ['São Lucas', 'Centro', 'Vila Nova', 'Jardim América', 'Santa Rita'];
  const necessidadesOptions = [
    'Alimentos', 'Roupas', 'Material de higiene', 'Remédios', 
    'Emprego / renda', 'Apoio psicológico', 'Reforma / reparos na casa'
  ];

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleNecessidadeChange = (necessidade, checked) => {
    setFormData(prev => ({
      ...prev,
      necessidades: checked 
        ? [...prev.necessidades, necessidade]
        : prev.necessidades.filter(n => n !== necessidade)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const dadosEnvio = {
        ...formData,
        vulnerabilidade: calcularVulnerabilidade(formData)
      };
      
      const response = await apiService.createFamilia(dadosEnvio);
      console.log('Cadastro família realizado:', response);
      
      navigate('/painel-social');
    } catch (error) {
      console.error('Erro ao cadastrar família:', error);
      setError(error.message || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const calcularVulnerabilidade = (data) => {
    let pontos = 0;
    if (data.rendaFamiliar === 'sem-renda') pontos += 3;
    if (data.rendaFamiliar === 'ate-1-salario') pontos += 2;
    if (data.situacaoRua) pontos += 3;
    if (data.gestantes) pontos += 1;
    if (data.pessoasDeficiencia) pontos += 1;
    if (data.familiaChefiadaMulher) pontos += 1;
    
    if (pontos >= 5) return 'alta';
    if (pontos >= 3) return 'media';
    return 'baixa';
  };

  return (
    <div className="cadastro-familia">
      <Header showLoginButton={false} />

      <main className="form-content">
        <div className="container-wide">
          <div className="wizard-container">
            {currentStep === 1 && (
              <div className="page-intro">
                <h2>Cadastro de Família</h2>
                <p>Preencha as informações básicas para mapear esta família no SolidarBairro.</p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="progress-bar">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
                  <div className="step-circle">{step}</div>
                  <div className="step-label">
                    {step === 1 && 'Responsável'}
                    {step === 2 && 'Endereço'}
                    {step === 3 && 'Composição'}
                    {step === 4 && 'Renda'}
                    {step === 5 && 'Necessidades'}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="wizard-form">
              {error && (
                <div className="error-message" style={{marginBottom: '20px', padding: '10px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c33'}}>
                  {error}
                </div>
              )}
              {/* Step 1: Dados do responsável */}
              {currentStep === 1 && (
                <div className="step-content">
                  <h3><img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="responsável" width="32" height="32" style={{marginRight: '8px'}} /> Dados do responsável</h3>
                  
                  <div className="form-group">
                    <label>Nome completo do responsável *</label>
                    <input
                      type="text"
                      value={formData.nomeCompleto}
                      onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>CPF (opcional)</label>
                      <input
                        type="text"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange('cpf', e.target.value)}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div className="form-group">
                      <label>Telefone / WhatsApp *</label>
                      <input
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>E-mail (opcional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Tipo de cadastro *</label>
                    <div className="radio-group-cards">
                      <label className={`radio-card ${formData.tipoCadastro === 'familia' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="tipoCadastro"
                          value="familia"
                          checked={formData.tipoCadastro === 'familia'}
                          onChange={(e) => handleInputChange('tipoCadastro', e.target.value)}
                        />
                        <div className="radio-card-content">
                          <div className="radio-card-icon"><img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="família" width="32" height="32" /></div>
                          <div className="radio-card-text">
                            <h4>Família</h4>
                            <p>Grupo familiar com múltiplas pessoas</p>
                          </div>
                        </div>
                      </label>
                      <label className={`radio-card ${formData.tipoCadastro === 'pessoa-sozinha' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="tipoCadastro"
                          value="pessoa-sozinha"
                          checked={formData.tipoCadastro === 'pessoa-sozinha'}
                          onChange={(e) => handleInputChange('tipoCadastro', e.target.value)}
                        />
                        <div className="radio-card-content">
                          <div className="radio-card-icon"><img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="pessoa" width="32" height="32" /></div>
                          <div className="radio-card-text">
                            <h4>Pessoa sozinha</h4>
                            <p>Indivíduo morando sozinho</p>
                          </div>
                        </div>
                      </label>
                      <label className={`radio-card ${formData.tipoCadastro === 'instituicao' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="tipoCadastro"
                          value="instituicao"
                          checked={formData.tipoCadastro === 'instituicao'}
                          onChange={(e) => handleInputChange('tipoCadastro', e.target.value)}
                        />
                        <div className="radio-card-content">
                          <div className="radio-card-icon"><img src="https://cdn-icons-png.flaticon.com/512/3079/3079652.png" alt="instituição" width="32" height="32" /></div>
                          <div className="radio-card-text">
                            <h4>Instituição / Abrigo</h4>
                            <p>Casa de acolhimento ou instituição</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Endereço */}
              {currentStep === 2 && (
                <div className="step-content">
                  <h3><img src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png" alt="endereço" width="32" height="32" style={{marginRight: '8px'}} /> Endereço / Localização</h3>
                  
                  <div className="form-group">
                    <label>Endereço (rua, número, complemento) *</label>
                    <input
                      type="text"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Bairro *</label>
                      <select
                        value={formData.bairro}
                        onChange={(e) => handleInputChange('bairro', e.target.value)}
                        required
                      >
                        <option value="">Selecione o bairro</option>
                        {bairros.map(bairro => (
                          <option key={bairro} value={bairro}>{bairro}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Cidade / UF</label>
                      <input type="text" value="Lagoa Santa / MG" disabled />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Ponto de referência</label>
                    <input
                      type="text"
                      value={formData.pontoReferencia}
                      onChange={(e) => handleInputChange('pontoReferencia', e.target.value)}
                      placeholder="Ex: Próximo ao posto de saúde"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Composição familiar */}
              {currentStep === 3 && (
                <div className="step-content">
                  <h3><img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="família" width="32" height="32" style={{marginRight: '8px'}} /> Composição familiar</h3>
                  
                  <div className="composicao-grid">
                    <div className="pessoas-contador">
                      <label>Número de pessoas na casa *</label>
                      <div className="contador-input">
                        <button 
                          type="button" 
                          className="contador-btn"
                          onClick={() => {
                            const atual = parseInt(formData.numeroPessoas) || 1;
                            if (atual > 1) handleInputChange('numeroPessoas', (atual - 1).toString());
                          }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={formData.numeroPessoas}
                          onChange={(e) => handleInputChange('numeroPessoas', e.target.value)}
                          className="contador-display"
                        />
                        <button 
                          type="button" 
                          className="contador-btn"
                          onClick={() => {
                            const atual = parseInt(formData.numeroPessoas) || 1;
                            handleInputChange('numeroPessoas', (atual + 1).toString());
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="idades-grid">
                    <div className="idade-card">
                      <div className="idade-icon"><img src="https://cdn-icons-png.flaticon.com/512/2784/2784403.png" alt="crianças" width="32" height="32" /></div>
                      <div className="idade-content">
                        <h4>Crianças</h4>
                        <p>0–12 anos</p>
                        <div className="contador-input small">
                          <button 
                            type="button" 
                            className="contador-btn"
                            onClick={() => {
                              const atual = parseInt(formData.criancas) || 0;
                              if (atual > 0) handleInputChange('criancas', (atual - 1).toString());
                            }}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={formData.criancas}
                            onChange={(e) => handleInputChange('criancas', e.target.value)}
                            className="contador-display"
                          />
                          <button 
                            type="button" 
                            className="contador-btn"
                            onClick={() => {
                              const atual = parseInt(formData.criancas) || 0;
                              handleInputChange('criancas', (atual + 1).toString());
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="idade-card">
                      <div className="idade-icon"><img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="adolescentes" width="32" height="32" /></div>
                      <div className="idade-content">
                        <h4>Adolescentes</h4>
                        <p>13–17 anos</p>
                        <div className="contador-input small">
                          <button 
                            type="button" 
                            className="contador-btn"
                            onClick={() => {
                              const atual = parseInt(formData.adolescentes) || 0;
                              if (atual > 0) handleInputChange('adolescentes', (atual - 1).toString());
                            }}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={formData.adolescentes}
                            onChange={(e) => handleInputChange('adolescentes', e.target.value)}
                            className="contador-display"
                          />
                          <button 
                            type="button" 
                            className="contador-btn"
                            onClick={() => {
                              const atual = parseInt(formData.adolescentes) || 0;
                              handleInputChange('adolescentes', (atual + 1).toString());
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="idade-card">
                      <div className="idade-icon"><img src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png" alt="adultos" width="32" height="32" /></div>
                      <div className="idade-content">
                        <h4>Adultos</h4>
                        <p>18–59 anos</p>
                        <div className="contador-input small">
                          <button 
                            type="button" 
                            className="contador-btn"
                            onClick={() => {
                              const atual = parseInt(formData.adultos) || 0;
                              if (atual > 0) handleInputChange('adultos', (atual - 1).toString());
                            }}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={formData.adultos}
                            onChange={(e) => handleInputChange('adultos', e.target.value)}
                            className="contador-display"
                          />
                          <button 
                            type="button" 
                            className="contador-btn"
                            onClick={() => {
                              const atual = parseInt(formData.adultos) || 0;
                              handleInputChange('adultos', (atual + 1).toString());
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="idade-card">
                      <div className="idade-icon"><img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="idosos" width="32" height="32" /></div>
                      <div className="idade-content">
                        <h4>Idosos</h4>
                        <p>60+ anos</p>
                        <div className="contador-input small">
                          <button 
                            type="button" 
                            className="contador-btn"
                            onClick={() => {
                              const atual = parseInt(formData.idosos) || 0;
                              if (atual > 0) handleInputChange('idosos', (atual - 1).toString());
                            }}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={formData.idosos}
                            onChange={(e) => handleInputChange('idosos', e.target.value)}
                            className="contador-display"
                          />
                          <button 
                            type="button" 
                            className="contador-btn"
                            onClick={() => {
                              const atual = parseInt(formData.idosos) || 0;
                              handleInputChange('idosos', (atual + 1).toString());
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="situacoes-especiais">
                    <h4>Situações especiais</h4>
                    <div className="situacoes-grid">
                      <label className={`situacao-card ${formData.gestantes ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.gestantes}
                          onChange={(e) => handleCheckboxChange('gestantes', e.target.checked)}
                        />
                        <div className="situacao-content">
                          <div className="situacao-icon"><img src="https://cdn-icons-png.flaticon.com/512/2784/2784403.png" alt="gestante" width="24" height="24" /></div>
                          <span>Há gestantes</span>
                        </div>
                      </label>

                      <label className={`situacao-card ${formData.pessoasDeficiencia ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.pessoasDeficiencia}
                          onChange={(e) => handleCheckboxChange('pessoasDeficiencia', e.target.checked)}
                        />
                        <div className="situacao-content">
                          <div className="situacao-icon"><img src="https://cdn-icons-png.flaticon.com/512/2784/2784403.png" alt="deficiência" width="24" height="24" /></div>
                          <span>Há pessoa(s) com deficiência</span>
                        </div>
                      </label>

                      <label className={`situacao-card ${formData.familiaChefiadaMulher ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.familiaChefiadaMulher}
                          onChange={(e) => handleCheckboxChange('familiaChefiadaMulher', e.target.checked)}
                        />
                        <div className="situacao-content">
                          <div className="situacao-icon"><img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="mulher" width="24" height="24" /></div>
                          <span>Família chefiada por mulher</span>
                        </div>
                      </label>

                      <label className={`situacao-card ${formData.situacaoRua ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.situacaoRua}
                          onChange={(e) => handleCheckboxChange('situacaoRua', e.target.checked)}
                        />
                        <div className="situacao-content">
                          <div className="situacao-icon"><img src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png" alt="casa" width="24" height="24" /></div>
                          <span>Família em situação de rua ou risco de despejo</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Situação socioeconômica */}
              {currentStep === 4 && (
                <div className="step-content">
                  <h3><img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="renda" width="32" height="32" style={{marginRight: '8px'}} /> Situação socioeconômica</h3>
                  
                  <div className="form-group">
                    <label>Renda familiar mensal estimada *</label>
                    <div className="renda-cards">
                      <label className={`renda-card ${formData.rendaFamiliar === 'sem-renda' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="rendaFamiliar"
                          value="sem-renda"
                          checked={formData.rendaFamiliar === 'sem-renda'}
                          onChange={(e) => handleInputChange('rendaFamiliar', e.target.value)}
                        />
                        <div className="renda-content">
                          <div className="renda-icon"><img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" alt="sem renda" width="28" height="28" /></div>
                          <div className="renda-text">
                            <h4>Sem renda</h4>
                            <p>Nenhuma renda familiar</p>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`renda-card ${formData.rendaFamiliar === 'ate-1-salario' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="rendaFamiliar"
                          value="ate-1-salario"
                          checked={formData.rendaFamiliar === 'ate-1-salario'}
                          onChange={(e) => handleInputChange('rendaFamiliar', e.target.value)}
                        />
                        <div className="renda-content">
                          <div className="renda-icon"><img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="1 salário" width="28" height="28" /></div>
                          <div className="renda-text">
                            <h4>Até 1 salário mínimo</h4>
                            <p>Até R$ 1.412,00</p>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`renda-card ${formData.rendaFamiliar === '1-2-salarios' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="rendaFamiliar"
                          value="1-2-salarios"
                          checked={formData.rendaFamiliar === '1-2-salarios'}
                          onChange={(e) => handleInputChange('rendaFamiliar', e.target.value)}
                        />
                        <div className="renda-content">
                          <div className="renda-icon"><img src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png" alt="2 salários" width="28" height="28" /></div>
                          <div className="renda-text">
                            <h4>Entre 1 e 2 salários</h4>
                            <p>R$ 1.412 - R$ 2.824</p>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`renda-card ${formData.rendaFamiliar === 'acima-2-salarios' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="rendaFamiliar"
                          value="acima-2-salarios"
                          checked={formData.rendaFamiliar === 'acima-2-salarios'}
                          onChange={(e) => handleInputChange('rendaFamiliar', e.target.value)}
                        />
                        <div className="renda-content">
                          <div className="renda-icon"><img src="https://cdn-icons-png.flaticon.com/512/3135/3135673.png" alt="acima 2 salários" width="28" height="28" /></div>
                          <div className="renda-text">
                            <h4>Acima de 2 salários</h4>
                            <p>Mais de R$ 2.824,00</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="beneficios-section">
                    <h4>Situação de emprego e benefícios</h4>
                    <div className="beneficios-grid">
                      <label className={`beneficio-card ${formData.semEmpregoFormal ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.semEmpregoFormal}
                          onChange={(e) => handleCheckboxChange('semEmpregoFormal', e.target.checked)}
                        />
                        <div className="beneficio-content">
                          <div className="beneficio-icon"><img src="https://cdn-icons-png.flaticon.com/512/1077/1077976.png" alt="emprego" width="24" height="24" /></div>
                          <span>Sem emprego formal</span>
                        </div>
                      </label>

                      <label className={`beneficio-card ${formData.recebeBeneficio ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.recebeBeneficio}
                          onChange={(e) => handleCheckboxChange('recebeBeneficio', e.target.checked)}
                        />
                        <div className="beneficio-content">
                          <div className="beneficio-icon"><img src="https://cdn-icons-png.flaticon.com/512/3039/3039386.png" alt="benefício" width="24" height="24" /></div>
                          <span>Recebe algum benefício (Bolsa Família, BPC, etc.)</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Descreva rapidamente a situação da família</label>
                    <textarea
                      value={formData.situacaoFamilia}
                      onChange={(e) => handleInputChange('situacaoFamilia', e.target.value)}
                      rows="3"
                      placeholder="Descreva a situação atual da família..."
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Necessidades */}
              {currentStep === 5 && (
                <div className="step-content">
                  <h3><img src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="necessidades" width="32" height="32" style={{marginRight: '8px'}} /> Necessidades principais</h3>
                  <p style={{marginBottom: '24px'}}>Selecione o que essa família mais precisa agora:</p>
                  
                  <div className="necessidades-grid">
                    {necessidadesOptions.map(necessidade => {
                      const icons = {
                        'Alimentos': <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="alimentos" width="24" height="24" />,
                        'Roupas': <img src="https://cdn-icons-png.flaticon.com/512/892/892458.png" alt="roupas" width="24" height="24" />,
                        'Material de higiene': <img src="https://cdn-icons-png.flaticon.com/512/2553/2553642.png" alt="higiene" width="24" height="24" />,
                        'Remédios': <img src="https://cdn-icons-png.flaticon.com/512/883/883356.png" alt="remédios" width="24" height="24" />,
                        'Emprego / renda': <img src="https://cdn-icons-png.flaticon.com/512/1077/1077976.png" alt="emprego" width="24" height="24" />,
                        'Apoio psicológico': <img src="https://cdn-icons-png.flaticon.com/512/2784/2784403.png" alt="psicológico" width="24" height="24" />,
                        'Reforma / reparos na casa': <img src="https://cdn-icons-png.flaticon.com/512/3039/3039386.png" alt="reparos" width="24" height="24" />
                      };
                      
                      return (
                        <label key={necessidade} className={`necessidade-card ${formData.necessidades.includes(necessidade) ? 'checked' : ''}`}>
                          <input
                            type="checkbox"
                            checked={formData.necessidades.includes(necessidade)}
                            onChange={(e) => handleNecessidadeChange(necessidade, e.target.checked)}
                          />
                          <div className="necessidade-content">
                            <div className="necessidade-icon">{icons[necessidade]}</div>
                            <span>{necessidade}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="form-group">
                    <label>Outros</label>
                    <input
                      type="text"
                      placeholder="Especifique outras necessidades..."
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="wizard-navigation">
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className="btn btn-secondary">
                    Voltar
                  </button>
                )}
                
                {currentStep < totalSteps ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="btn btn-primary"
                  >
                    Próximo
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="btn btn-primary btn-large"
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar cadastro'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CadastroFamilia;