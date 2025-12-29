import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/pages/PerfilFamilia.css';

const PerfilFamilia = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Dados mockados da família
  const [familia] = useState({
    id: 1,
    nome: 'Família Silva',
    bairro: 'São Lucas',
    vulnerabilidade: 'Alta',
    pessoas: 5,
    criancas: 2,
    idosos: 1,
    gestante: true,
    pessoaDeficiencia: false,
    renda: 'Sem renda',
    situacaoMoradia: 'Casa simples de alvenaria, risco de infiltração.',
    situacaoRenda: 'Sem emprego formal, sobrevivendo de bicos eventuais.',
    beneficiosSociais: 'Recebe Bolsa Família.',
    ultimaAtualizacao: '12/11/2024'
  });

  const [necessidades, setNecessidades] = useState([
    {
      id: 1,
      necessidade: 'Cesta básica',
      prioridade: 'Alta',
      status: 'Em aberto',
      atualizadoEm: '12/11/2024',
      observacao: ''
    },
    {
      id: 2,
      necessidade: 'Roupas de inverno para crianças',
      prioridade: 'Média',
      status: 'Em aberto',
      atualizadoEm: '10/11/2024',
      observacao: 'Tamanhos 4 e 6 anos'
    },
    {
      id: 3,
      necessidade: 'Oportunidade de emprego para o pai',
      prioridade: 'Alta',
      status: 'Em aberto',
      atualizadoEm: '08/11/2024',
      observacao: 'Experiência em construção civil'
    }
  ]);

  const [showAddNecessidade, setShowAddNecessidade] = useState(false);
  const [novaNecessidade, setNovaNecessidade] = useState({
    necessidade: '',
    prioridade: 'Média',
    observacao: ''
  });

  const handleAddNecessidade = () => {
    if (novaNecessidade.necessidade) {
      const nova = {
        id: Date.now(),
        ...novaNecessidade,
        status: 'Em aberto',
        atualizadoEm: new Date().toLocaleDateString('pt-BR')
      };
      setNecessidades([...necessidades, nova]);
      setNovaNecessidade({ necessidade: '', prioridade: 'Média', observacao: '' });
      setShowAddNecessidade(false);
    }
  };

  const handleMarcarAtendida = (id) => {
    setNecessidades(necessidades.map(n => 
      n.id === id ? { ...n, status: 'Atendida' } : n
    ));
  };

  const handleRemoverNecessidade = (id) => {
    setNecessidades(necessidades.filter(n => n.id !== id));
  };

  return (
    <>
      <Header />
      <div className="perfil-familia">
        <div className="container">
          <div className="perfil-header">
            <button className="back-btn" onClick={() => navigate('/painel-social')}>
              ← Voltar ao painel
            </button>
            <div className="familia-info">
              <h1>{familia.nome} – Bairro {familia.bairro}</h1>
              <span className={`vulnerabilidade-tag ${familia.vulnerabilidade.toLowerCase()}`}>
                {familia.vulnerabilidade} vulnerabilidade
              </span>
            </div>
          </div>

          {/* Bloco 1 - Resumo rápido */}
          <div className="resumo-card">
            <h3>🧩 Resumo rápido</h3>
            <div className="resumo-grid">
              <div className="resumo-item">
                <span className="resumo-icon">👨👩👧👦</span>
                <span>{familia.pessoas} pessoas</span>
              </div>
              <div className="resumo-item">
                <span className="resumo-icon">👶</span>
                <span>{familia.criancas} crianças</span>
              </div>
              <div className="resumo-item">
                <span className="resumo-icon">👵</span>
                <span>{familia.idosos} idoso</span>
              </div>
              <div className="resumo-item">
                <span className="resumo-icon">🤰</span>
                <span>Gestante: {familia.gestante ? 'Sim' : 'Não'}</span>
              </div>
              <div className="resumo-item">
                <span className="resumo-icon">♿</span>
                <span>Pessoa com deficiência: {familia.pessoaDeficiencia ? 'Sim' : 'Não'}</span>
              </div>
              <div className="resumo-item">
                <span className="resumo-icon">💸</span>
                <span>Renda: {familia.renda}</span>
              </div>
              <div className="resumo-item">
                <span className="resumo-icon">📍</span>
                <span>Bairro: {familia.bairro} – Ponto aproximado no mapa</span>
              </div>
            </div>
          </div>

          {/* Bloco 2 - Vulnerabilidade detalhada */}
          <div className="vulnerabilidade-card">
            <div className="card-header">
              <h3>📋 Vulnerabilidade detalhada</h3>
              <button className="btn btn-secondary">
                ✏️ Editar vulnerabilidade
              </button>
            </div>
            <div className="vulnerabilidade-content">
              <div className="vulnerabilidade-item">
                <strong>Situação de moradia:</strong>
                <p>{familia.situacaoMoradia}</p>
              </div>
              <div className="vulnerabilidade-item">
                <strong>Situação de renda:</strong>
                <p>{familia.situacaoRenda}</p>
              </div>
              <div className="vulnerabilidade-item">
                <strong>Benefícios sociais:</strong>
                <p>{familia.beneficiosSociais}</p>
              </div>
            </div>
          </div>

          {/* Bloco 3 - Lista de necessidades */}
          <div className="necessidades-card">
            <div className="card-header">
              <h3>🎯 Lista de necessidades da família</h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddNecessidade(true)}
              >
                ➕ Adicionar nova necessidade
              </button>
            </div>

            {showAddNecessidade && (
              <div className="add-necessidade-form">
                <div className="form-group">
                  <label>Necessidade</label>
                  <input
                    type="text"
                    value={novaNecessidade.necessidade}
                    onChange={(e) => setNovaNecessidade({
                      ...novaNecessidade,
                      necessidade: e.target.value
                    })}
                    placeholder="Descreva a necessidade"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prioridade</label>
                    <select
                      value={novaNecessidade.prioridade}
                      onChange={(e) => setNovaNecessidade({
                        ...novaNecessidade,
                        prioridade: e.target.value
                      })}
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Observação</label>
                    <input
                      type="text"
                      value={novaNecessidade.observacao}
                      onChange={(e) => setNovaNecessidade({
                        ...novaNecessidade,
                        observacao: e.target.value
                      })}
                      placeholder="Observações adicionais"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleAddNecessidade}>
                    Salvar
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowAddNecessidade(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="carrossel-container">
              <button className="carrossel-nav carrossel-nav-prev" onClick={() => {
                const carousel = document.querySelector('.necessidades-carousel');
                carousel.scrollBy({ left: -400, behavior: 'smooth' });
              }}>
                ← Anterior
              </button>

              <div className="necessidades-carousel">
                {necessidades.map(necessidade => (
                  <div key={necessidade.id} className="necessidade-item">
                    <div className="necessidade-info">
                      <div className="necessidade-title-section">
                        <h4>{necessidade.necessidade}</h4>
                      </div>
                      
                      <div className="necessidade-details">
                        <div className="detail-group">
                          <span className="detail-label">Prioridade:</span>
                          <span className={`prioridade-tag ${necessidade.prioridade.toLowerCase()}`}>
                            {necessidade.prioridade}
                          </span>
                        </div>
                        
                        <div className="detail-group">
                          <span className="detail-label">Data:</span>
                          <span className="detail-value">{necessidade.atualizadoEm}</span>
                        </div>
                        
                        <div className="detail-group">
                          <span className="detail-label">Status:</span>
                          <span className={`status-tag ${necessidade.status.toLowerCase().replace(' ', '-')}`}>
                            {necessidade.status}
                          </span>
                        </div>
                      </div>

                      {necessidade.observacao && (
                        <p className="necessidade-observacao">
                          <strong>Observação:</strong> {necessidade.observacao}
                        </p>
                      )}
                    </div>

                    <div className="necessidade-actions">
                      {necessidade.status === 'Em aberto' && (
                        <button 
                          className="btn btn-success"
                          onClick={() => handleMarcarAtendida(necessidade.id)}
                        >
                          ✓ Atender
                        </button>
                      )}
                      <button className="btn btn-secondary">✏️ Editar</button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleRemoverNecessidade(necessidade.id)}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="carrossel-nav carrossel-nav-next" onClick={() => {
                const carousel = document.querySelector('.necessidades-carousel');
                carousel.scrollBy({ left: 400, behavior: 'smooth' });
              }}>
                Próximo →
              </button>
            </div>
          </div>

          <div className="perfil-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/atualizar-status/${familia.id}`)}
            >
              Atualizar status da família
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfilFamilia;