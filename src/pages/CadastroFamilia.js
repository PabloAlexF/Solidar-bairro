import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/CadastroFamilia.css';

const CadastroFamilia = () => {
  const navigate = useNavigate();
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
    cidade: 'Lagoa Santa',
    uf: 'MG',
    pontoReferencia: '',
    localizacaoMapa: null,
    
    // Composição familiar
    numeroPessoas: '',
    criancas: '',
    adolescentes: '',
    adultos: '',
    idosos: '',
    gestantes: false,
    pessoasDeficiencia: false,
    familiaChefiadaMulher: false,
    situacaoRua: false,
    
    // Situação socioeconômica
    rendaFamiliar: '',
    semEmpregoFormal: false,
    recebeBeneficio: false,
    descricaoSituacao: '',
    
    // Necessidades
    necessidades: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNecessidadeChange = (necessidade) => {
    const novasNecessidades = formData.necessidades.includes(necessidade)
      ? formData.necessidades.filter(n => n !== necessidade)
      : [...formData.necessidades, necessidade];
    
    setFormData({
      ...formData,
      necessidades: novasNecessidades
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastro família:', formData);
    alert('Família cadastrada com sucesso!');
    navigate('/painel-social');
  };

  const bairros = ['São Lucas', 'Centro', 'Vila Nova', 'Jardim América', 'Santa Rita'];
  const necessidadesOpcoes = [
    'Alimentos', 'Roupas', 'Material de higiene', 'Remédios', 
    'Emprego / renda', 'Apoio psicológico', 'Reforma / reparos na casa'
  ];

  return (
    <div className="cadastro-familia">
      <div className="container">
        <div className="cadastro-header">
          <button className="back-btn" onClick={() => navigate('/home')}>
            ← Voltar
          </button>
          <h1>Cadastro de Família</h1>
          <p>Preencha as informações básicas para mapear esta família no SolidarBairro</p>
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form">
          {/* Seção 1 - Dados do responsável */}
          <div className="form-section">
            <h3>Dados do responsável</h3>
            <div className="form-group">
              <label>Nome completo do responsável *</label>
              <input
                type="text"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>CPF (opcional)</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="form-group">
                <label>Telefone / WhatsApp *</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>E-mail (opcional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Tipo de cadastro *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="tipoCadastro"
                    value="familia"
                    checked={formData.tipoCadastro === 'familia'}
                    onChange={handleChange}
                  />
                  <span>Família</span>
                  <div className="radio-checker">✓</div>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="tipoCadastro"
                    value="pessoa_sozinha"
                    checked={formData.tipoCadastro === 'pessoa_sozinha'}
                    onChange={handleChange}
                  />
                  <span>Pessoa sozinha</span>
                  <div className="radio-checker">✓</div>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="tipoCadastro"
                    value="instituicao"
                    checked={formData.tipoCadastro === 'instituicao'}
                    onChange={handleChange}
                  />
                  <span>Instituição / abrigo familiar</span>
                  <div className="radio-checker">✓</div>
                </label>
              </div>
            </div>
          </div>

          {/* Seção 2 - Endereço */}
          <div className="form-section">
            <h3>Endereço / Localização</h3>
            <div className="form-group">
              <label>Endereço (rua, número, complemento) *</label>
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
                <select
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
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
                <input
                  type="text"
                  value={`${formData.cidade} / ${formData.uf}`}
                  disabled
                />
              </div>
            </div>
            <div className="form-group">
              <label>Ponto de referência</label>
              <input
                type="text"
                name="pontoReferencia"
                value={formData.pontoReferencia}
                onChange={handleChange}
                placeholder="Ex: Próximo ao mercado São João"
              />
            </div>
            <div className="form-group">
              <button type="button" className="btn btn-secondary map-btn">
                Marcar no mapa
              </button>
            </div>
          </div>

          {/* Seção 3 - Composição familiar */}
          <div className="form-section">
            <h3>Composição familiar</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Número de pessoas na casa *</label>
                <input
                  type="number"
                  name="numeroPessoas"
                  value={formData.numeroPessoas}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Crianças (0–12 anos)</label>
                <input
                  type="number"
                  name="criancas"
                  value={formData.criancas}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Adolescentes (13–17)</label>
                <input
                  type="number"
                  name="adolescentes"
                  value={formData.adolescentes}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Adultos (18–59)</label>
                <input
                  type="number"
                  name="adultos"
                  value={formData.adultos}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Idosos (60+)</label>
                <input
                  type="number"
                  name="idosos"
                  value={formData.idosos}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
            <div className="checkbox-section">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="gestantes"
                  checked={formData.gestantes}
                  onChange={handleChange}
                />
                <label>Há gestantes</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="pessoasDeficiencia"
                  checked={formData.pessoasDeficiencia}
                  onChange={handleChange}
                />
                <label>Há pessoa(s) com deficiência</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="familiaChefiadaMulher"
                  checked={formData.familiaChefiadaMulher}
                  onChange={handleChange}
                />
                <label>Família chefiada por mulher</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="situacaoRua"
                  checked={formData.situacaoRua}
                  onChange={handleChange}
                />
                <label>Família em situação de rua ou risco de despejo</label>
              </div>
            </div>
          </div>

          {/* Seção 4 - Situação socioeconômica */}
          <div className="form-section">
            <h3>Situação socioeconômica (vulnerabilidade)</h3>
            <div className="form-group">
              <label>Renda familiar mensal estimada *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="rendaFamiliar"
                    value="sem_renda"
                    checked={formData.rendaFamiliar === 'sem_renda'}
                    onChange={handleChange}
                  />
                  Sem renda
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="rendaFamiliar"
                    value="ate_1_salario"
                    checked={formData.rendaFamiliar === 'ate_1_salario'}
                    onChange={handleChange}
                  />
                  Até 1 salário mínimo
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="rendaFamiliar"
                    value="1_a_2_salarios"
                    checked={formData.rendaFamiliar === '1_a_2_salarios'}
                    onChange={handleChange}
                  />
                  Entre 1 e 2 salários
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="rendaFamiliar"
                    value="acima_2_salarios"
                    checked={formData.rendaFamiliar === 'acima_2_salarios'}
                    onChange={handleChange}
                  />
                  Acima de 2 salários
                </label>
              </div>
            </div>
            <div className="checkbox-section">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="semEmpregoFormal"
                  checked={formData.semEmpregoFormal}
                  onChange={handleChange}
                />
                <label>Sem emprego formal</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="recebeBeneficio"
                  checked={formData.recebeBeneficio}
                  onChange={handleChange}
                />
                <label>Recebe algum benefício (Bolsa Família, BPC, etc.)</label>
              </div>
            </div>
            <div className="form-group">
              <label>Descreva rapidamente a situação da família</label>
              <textarea
                name="descricaoSituacao"
                value={formData.descricaoSituacao}
                onChange={handleChange}
                placeholder="Descreva a situação atual da família..."
              />
            </div>
          </div>

          {/* Seção 5 - Necessidades */}
          <div className="form-section">
            <h3>Necessidades principais</h3>
            <p>Selecione o que essa família mais precisa agora:</p>
            <div className="necessidades-grid">
              {necessidadesOpcoes.map(necessidade => (
                <div key={necessidade} className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={formData.necessidades.includes(necessidade)}
                    onChange={() => handleNecessidadeChange(necessidade)}
                  />
                  <label>{necessidade}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Rodapé */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Salvar cadastro
            </button>
            <button type="button" className="btn-link" onClick={() => navigate('/home')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroFamilia;