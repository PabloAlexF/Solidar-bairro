import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/RegisterForm.css';

const RegisterONG = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastro ONG:', formData);
    // Aqui seria enviado para verificação KYC
    alert('Cadastro enviado para verificação. Você receberá um e-mail em até 48h.');
    navigate('/');
  };

  const areasTrabalho = [
    'Alimentação',
    'Educação',
    'Saúde',
    'Roupas e Calçados',
    'Moradia',
    'Assistência Social',
    'Meio Ambiente',
    'Cultura e Esporte',
    'Direitos Humanos',
    'Outros'
  ];

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
            <h1>Cadastro de ONG</h1>
            <p>Cadastro com verificação obrigatória de documentos</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form-fields">
            <div className="form-section">
              <h3>Dados da Entidade</h3>
              <div className="form-group">
                <label>Nome completo da entidade *</label>
                <input
                  type="text"
                  name="nomeEntidade"
                  value={formData.nomeEntidade}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>CNPJ *</label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Área de trabalho *</label>
                  <select
                    name="areaTrabalho"
                    value={formData.areaTrabalho}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione</option>
                    {areasTrabalho.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Razão social *</label>
                  <input
                    type="text"
                    name="razaoSocial"
                    value={formData.razaoSocial}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nome fantasia</label>
                  <input
                    type="text"
                    name="nomeFantasia"
                    value={formData.nomeFantasia}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Descrição da atuação *</label>
                <textarea
                  name="descricaoAtuacao"
                  value={formData.descricaoAtuacao}
                  onChange={handleChange}
                  placeholder="Descreva as principais atividades da ONG"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Responsável Legal</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Nome do responsável *</label>
                  <input
                    type="text"
                    name="responsavelNome"
                    value={formData.responsavelNome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CPF do responsável *</label>
                  <input
                    type="text"
                    name="responsavelCpf"
                    value={formData.responsavelCpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Telefone institucional *</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>E-mail institucional *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Endereço da Sede</h3>
              <div className="form-group">
                <label>Endereço completo *</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
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
                  <label>CEP *</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Documentos Obrigatórios</h3>
              <div className="form-group">
                <label>Estatuto social *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    name="estatutoSocial"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <div className="file-upload-text">
                    Clique para enviar o estatuto social (PDF, DOC)
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Ata de nomeação da diretoria *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    name="ataDiretoria"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <div className="file-upload-text">
                    Clique para enviar a ata da diretoria (PDF, DOC)
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Certidões negativas *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    name="certidoesNegativas"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <div className="file-upload-text">
                    Clique para enviar as certidões negativas (PDF, DOC)
                  </div>
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

            <div className="form-section">
              <h3>Termos e Declarações</h3>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="aceitaTermos"
                  checked={formData.aceitaTermos}
                  onChange={handleChange}
                  required
                />
                <label>Aceito os Termos de Uso *</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="aceitaPrivacidade"
                  checked={formData.aceitaPrivacidade}
                  onChange={handleChange}
                  required
                />
                <label>Aceito a Política de Privacidade *</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="aceitaPoliticaOng"
                  checked={formData.aceitaPoliticaOng}
                  onChange={handleChange}
                  required
                />
                <label>Aceito a Política de ONGs e Responsabilidade *</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="declaracaoVeracidade"
                  checked={formData.declaracaoVeracidade}
                  onChange={handleChange}
                  required
                />
                <label>Declaro que todas as informações são verdadeiras *</label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Enviar para verificação
              </button>
              <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Seu cadastro será analisado em até 48 horas
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterONG;