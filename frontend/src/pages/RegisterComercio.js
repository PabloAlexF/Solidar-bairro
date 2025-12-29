import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/apiService';
import '../styles/pages/CadastroFamilia.css';

const RegisterComercio = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nomeEstabelecimento: '',
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    responsavelNome: '',
    responsavelCpf: '',
    telefone: '',
    email: '',
    endereco: '',
    bairro: '',
    cidade: 'Lagoa Santa',
    uf: 'MG',
    cep: '',
    tipoComercio: '',
    descricaoAtividade: '',
    horarioFuncionamento: '',
    aceitaMoedaSolidaria: false,
    ofereceProdutosSolidarios: false,
    participaAcoesSociais: false,
    senha: '',
    confirmarSenha: '',
    aceitaTermos: false,
    aceitaPrivacidade: false
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!formData.aceitaTermos || !formData.aceitaPrivacidade) {
      setError('Você deve aceitar os termos e política de privacidade');
      return;
    }
    
    setLoading(true);
    
    try {
      const comercioData = {
        nomeEstabelecimento: formData.nomeEstabelecimento,
        cnpj: formData.cnpj,
        razaoSocial: formData.razaoSocial,
        tipoComercio: formData.tipoComercio,
        descricaoAtividade: formData.descricaoAtividade,
        responsavelNome: formData.responsavelNome,
        responsavelCpf: formData.responsavelCpf,
        telefone: formData.telefone,
        email: formData.email,
        endereco: formData.endereco,
        bairro: formData.bairro,
        cidade: formData.cidade,
        senha: formData.senha
      };

      const response = await ApiService.createComercio(comercioData);
      
      if (response.success) {
        alert('Cadastro de comércio realizado com sucesso! Aguarde verificação.');
        navigate('/login');
      }
    } catch (error) {
      setError(error.message || 'Erro ao cadastrar comércio');
    } finally {
      setLoading(false);
    }
  };

  const tiposComercio = [
    'Mercado/Supermercado', 'Padaria', 'Farmácia', 'Restaurante/Lanchonete', 'Loja de Roupas',
    'Material de Construção', 'Açougue', 'Hortifruti', 'Papelaria', 'Outros'
  ];

  const bairros = ['São Lucas', 'Centro', 'Vila Nova', 'Jardim América', 'Santa Rita'];

  return (
    <div className="cadastro-familia">
      <div className="container-wide">
        <div className="wizard-container">
          {currentStep === 1 && (
            <div className="page-intro">
              <h2>Cadastro de Comércio Local</h2>
              <p>Junte-se à rede solidária do seu bairro</p>
            </div>
          )}

          <div className="progress-bar">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
                <div className="step-circle">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Estabelecimento'}
                  {step === 2 && 'Responsável'}
                  {step === 3 && 'Localização'}
                  {step === 4 && 'Solidariedade'}
                  {step === 5 && 'Senha'}
                  {step === 6 && 'Termos'}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="wizard-form">
            {currentStep === 1 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/3079/3079652.png" alt="estabelecimento" width="32" height="32" style={{marginRight: '8px'}} /> Dados do Estabelecimento</h3>
                <div className="form-group">
                  <label>Nome do estabelecimento *</label>
                  <input type="text" name="nomeEstabelecimento" value={formData.nomeEstabelecimento} onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>CNPJ *</label>
                    <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" required />
                  </div>
                  <div className="form-group">
                    <label>Tipo de comércio *</label>
                    <select name="tipoComercio" value={formData.tipoComercio} onChange={handleChange} required>
                      <option value="">Selecione</option>
                      {tiposComercio.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
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
                  <label>Descrição da atividade *</label>
                  <textarea name="descricaoAtividade" value={formData.descricaoAtividade} onChange={handleChange} placeholder="Descreva os principais produtos/serviços oferecidos" required />
                </div>
                <div className="form-group">
                  <label>Horário de funcionamento</label>
                  <input type="text" name="horarioFuncionamento" value={formData.horarioFuncionamento} onChange={handleChange} placeholder="Ex: Segunda a Sexta: 8h às 18h, Sábado: 8h às 12h" />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="responsável" width="32" height="32" style={{marginRight: '8px'}} /> Responsável</h3>
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
                    <label>Telefone comercial *</label>
                    <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>E-mail comercial</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png" alt="localização" width="32" height="32" style={{marginRight: '8px'}} /> Localização</h3>
                <div className="form-group">
                  <label>Endereço completo *</label>
                  <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bairro *</label>
                    <select name="bairro" value={formData.bairro} onChange={handleChange} required>
                      <option value="">Selecione o bairro</option>
                      {bairros.map(bairro => <option key={bairro} value={bairro}>{bairro}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cidade / UF</label>
                    <input type="text" value={`${formData.cidade} / ${formData.uf}`} disabled />
                  </div>
                  <div className="form-group">
                    <label>CEP</label>
                    <input type="text" name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="solidariedade" width="32" height="32" style={{marginRight: '8px'}} /> Participação Solidária</h3>
                <div className="checkbox-group">
                  <input type="checkbox" name="aceitaMoedaSolidaria" checked={formData.aceitaMoedaSolidaria} onChange={handleChange} />
                  <label>Aceita moeda solidária como forma de pagamento</label>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" name="ofereceProdutosSolidarios" checked={formData.ofereceProdutosSolidarios} onChange={handleChange} />
                  <label>Oferece produtos/serviços com preços solidários</label>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" name="participaAcoesSociais" checked={formData.participaAcoesSociais} onChange={handleChange} />
                  <label>Tem interesse em participar de ações sociais do bairro</label>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="step-content">
                <h3><img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="senha" width="32" height="32" style={{marginRight: '8px'}} /> Senha de acesso</h3>
                {error && <div className="error-message" style={{marginBottom: '1rem', color: 'red'}}>{error}</div>}
                <div className="form-row">
                  <div className="form-group">
                    <label>Senha *</label>
                    <input type="password" name="senha" value={formData.senha} onChange={handleChange} minLength="6" required />
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
                <h3><img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="termos" width="32" height="32" style={{marginRight: '8px'}} /> Termos e Condições</h3>
                <div className="checkbox-group">
                  <input type="checkbox" name="aceitaTermos" checked={formData.aceitaTermos} onChange={handleChange} required />
                  <label>Aceito os Termos de Uso *</label>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" name="aceitaPrivacidade" checked={formData.aceitaPrivacidade} onChange={handleChange} required />
                  <label>Aceito a Política de Privacidade *</label>
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
                  {loading ? 'Cadastrando...' : 'Cadastrar comércio'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterComercio;