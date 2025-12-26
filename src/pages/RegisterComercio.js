import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/RegisterForm.css';

const RegisterComercio = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastro comércio:', formData);
    alert('Cadastro de comércio enviado com sucesso!');
    navigate('/home');
  };

  const tiposComercio = [
    'Mercado/Supermercado',
    'Padaria',
    'Farmácia',
    'Restaurante/Lanchonete',
    'Loja de Roupas',
    'Material de Construção',
    'Açougue',
    'Hortifruti',
    'Papelaria',
    'Outros'
  ];

  const bairros = ['São Lucas', 'Centro', 'Vila Nova', 'Jardim América', 'Santa Rita'];

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
            <h1>Cadastro de Comércio Local</h1>
            <p>Junte-se à rede solidária do seu bairro</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form-fields">
            <div className="form-section">
              <h3>Dados do Estabelecimento</h3>
              <div className="form-group">
                <label>Nome do estabelecimento *</label>
                <input
                  type="text"
                  name="nomeEstabelecimento"
                  value={formData.nomeEstabelecimento}
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
                  <label>Tipo de comércio *</label>
                  <select
                    name="tipoComercio"
                    value={formData.tipoComercio}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione</option>
                    {tiposComercio.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
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
                <label>Descrição da atividade *</label>
                <textarea
                  name="descricaoAtividade"
                  value={formData.descricaoAtividade}
                  onChange={handleChange}
                  placeholder="Descreva os principais produtos/serviços oferecidos"
                  required
                />
              </div>
              <div className="form-group">
                <label>Horário de funcionamento</label>
                <input
                  type="text"
                  name="horarioFuncionamento"
                  value={formData.horarioFuncionamento}
                  onChange={handleChange}
                  placeholder="Ex: Segunda a Sexta: 8h às 18h, Sábado: 8h às 12h"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Responsável</h3>
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
                  <label>Telefone comercial *</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>E-mail comercial</label>
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
              <h3>Localização</h3>
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
              <h3>Participação Solidária</h3>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="aceitaMoedaSolidaria"
                  checked={formData.aceitaMoedaSolidaria}
                  onChange={handleChange}
                />
                <label>Aceita moeda solidária como forma de pagamento</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="ofereceProdutosSolidarios"
                  checked={formData.ofereceProdutosSolidarios}
                  onChange={handleChange}
                />
                <label>Oferece produtos/serviços com preços solidários</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="participaAcoesSociais"
                  checked={formData.participaAcoesSociais}
                  onChange={handleChange}
                />
                <label>Tem interesse em participar de ações sociais do bairro</label>
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
              <h3>Termos e Condições</h3>
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
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Cadastrar comércio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterComercio;