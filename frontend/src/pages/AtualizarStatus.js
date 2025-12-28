import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/pages/AtualizarStatus.css';

const AtualizarStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    situacaoAtual: '',
    ajudaRecebida: [],
    detalhesAjuda: '',
    previsaoNovaNecessidade: '',
    observacoes: ''
  });

  // Dados mockados da família
  const familia = {
    nome: 'Família Silva',
    bairro: 'São Lucas',
    ultimaAtualizacao: '05/11/2024'
  };

  const historicoAtualizacoes = [
    {
      data: '05/11',
      descricao: 'Ajuda recebida (cesta básica)',
      atualizadoPor: 'João (ONG X)'
    },
    {
      data: '18/10',
      descricao: 'Família cadastrada',
      atualizadoPor: 'Assistência Social'
    }
  ];

  const opcoesAjuda = [
    'Cesta básica',
    'Roupas',
    'Remédios',
    'Ajuda financeira',
    'Oportunidade de emprego',
    'Material de higiene',
    'Material escolar'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAjudaChange = (ajuda) => {
    const novasAjudas = formData.ajudaRecebida.includes(ajuda)
      ? formData.ajudaRecebida.filter(a => a !== ajuda)
      : [...formData.ajudaRecebida, ajuda];
    
    setFormData({
      ...formData,
      ajudaRecebida: novasAjudas
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Atualização de status:', formData);
    alert('Status atualizado com sucesso!');
    navigate(`/perfil-familia/${id}`);
  };

  return (
    <div className="atualizar-status">
      <div className="container">
        <div className="status-header">
          <button className="back-btn" onClick={() => navigate(`/perfil-familia/${id}`)}>
            ← Voltar
          </button>
          <div className="familia-info">
            <h1>Família: {familia.nome} – Bairro {familia.bairro}</h1>
            <p>Última atualização: {familia.ultimaAtualizacao}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="status-form">
          {/* Bloco 1 - Status geral */}
          <div className="form-section">
            <h3>🧭 Status geral</h3>
            <div className="form-group">
              <label>Situação atual da família:</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="situacaoAtual"
                    value="precisa_ajuda_urgente"
                    checked={formData.situacaoAtual === 'precisa_ajuda_urgente'}
                    onChange={handleChange}
                  />
                  Segue precisando de ajuda urgente
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="situacaoAtual"
                    value="ajuda_parcial"
                    checked={formData.situacaoAtual === 'ajuda_parcial'}
                    onChange={handleChange}
                  />
                  Recebeu ajuda parcial
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="situacaoAtual"
                    value="ajuda_completa"
                    checked={formData.situacaoAtual === 'ajuda_completa'}
                    onChange={handleChange}
                  />
                  Recebeu ajuda completa
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="situacaoAtual"
                    value="situacao_estabilizada"
                    checked={formData.situacaoAtual === 'situacao_estabilizada'}
                    onChange={handleChange}
                  />
                  Situação estabilizada por enquanto
                </label>
              </div>
            </div>
          </div>

          {/* Bloco 2 - O que foi entregue */}
          <div className="form-section">
            <h3>📦 O que foi entregue?</h3>
            <div className="ajuda-grid">
              {opcoesAjuda.map(ajuda => (
                <div key={ajuda} className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={formData.ajudaRecebida.includes(ajuda)}
                    onChange={() => handleAjudaChange(ajuda)}
                  />
                  <label>{ajuda}</label>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Detalhes sobre a ajuda recebida:</label>
              <textarea
                name="detalhesAjuda"
                value={formData.detalhesAjuda}
                onChange={handleChange}
                placeholder="Ex: Receberam cesta básica e roupas para as duas crianças."
                rows="3"
              />
            </div>
          </div>

          {/* Bloco 3 - Precisa novamente */}
          <div className="form-section">
            <h3>🔁 Precisa novamente?</h3>
            <div className="form-group">
              <label>Previsão de nova necessidade:</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="previsaoNovaNecessidade"
                    value="imediata"
                    checked={formData.previsaoNovaNecessidade === 'imediata'}
                    onChange={handleChange}
                  />
                  Imediata (até 15 dias)
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="previsaoNovaNecessidade"
                    value="curto_prazo"
                    checked={formData.previsaoNovaNecessidade === 'curto_prazo'}
                    onChange={handleChange}
                  />
                  Curto prazo (1 mês)
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="previsaoNovaNecessidade"
                    value="medio_prazo"
                    checked={formData.previsaoNovaNecessidade === 'medio_prazo'}
                    onChange={handleChange}
                  />
                  Médio prazo (3 meses)
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="previsaoNovaNecessidade"
                    value="nao_previsto"
                    checked={formData.previsaoNovaNecessidade === 'nao_previsto'}
                    onChange={handleChange}
                  />
                  Não previsto
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Observações adicionais:</label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Observações sobre a situação atual da família..."
                rows="3"
              />
            </div>
          </div>

          {/* Bloco 4 - Histórico */}
          <div className="form-section">
            <h3>📜 Histórico de atualizações</h3>
            <div className="historico-timeline">
              {historicoAtualizacoes.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-date">{item.data}</div>
                  <div className="timeline-content">
                    <p>{item.descricao}</p>
                    <span className="timeline-author">Atualizado por: {item.atualizadoPor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rodapé */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Salvar atualização
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/painel-social')}
            >
              Voltar ao painel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AtualizarStatus;