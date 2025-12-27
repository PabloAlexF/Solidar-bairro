import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/pages/PainelSocial.css';

const PainelSocial = () => {
  const navigate = useNavigate();
  const [familias, setFamilias] = useState([]);
  const [bairroSelecionado, setBairroSelecionado] = useState('todos');
  const [filtroVulnerabilidade, setFiltroVulnerabilidade] = useState('todas');

  const bairros = ['São Lucas', 'Centro', 'Vila Nova', 'Jardim América', 'Santa Rita'];

  useEffect(() => {
    const familiasData = JSON.parse(localStorage.getItem('familias') || '[]');
    setFamilias(familiasData);
  }, []);

  const familiasFiltradas = familias.filter(familia => {
    const bairroMatch = bairroSelecionado === 'todos' || familia.bairro === bairroSelecionado;
    const vulnerabilidadeMatch = filtroVulnerabilidade === 'todas' || familia.vulnerabilidade === filtroVulnerabilidade;
    return bairroMatch && vulnerabilidadeMatch;
  });

  const calcularIndicadores = () => {
    const total = familiasFiltradas.length;
    const criancas = familiasFiltradas.reduce((acc, f) => acc + parseInt(f.criancas || 0), 0);
    const idosos = familiasFiltradas.reduce((acc, f) => acc + parseInt(f.idosos || 0), 0);
    const gestantes = familiasFiltradas.filter(f => f.gestantes).length;
    const deficiencia = familiasFiltradas.filter(f => f.pessoasDeficiencia).length;
    const baixaRenda = familiasFiltradas.filter(f => f.rendaFamiliar === 'sem-renda' || f.rendaFamiliar === 'ate-1-salario').length;
    const altaVulnerabilidade = familiasFiltradas.filter(f => f.vulnerabilidade === 'alta').length;

    return { total, criancas, idosos, gestantes, deficiencia, baixaRenda, altaVulnerabilidade };
  };

  const indicadores = calcularIndicadores();

  const getVulnerabilidadeColor = (vulnerabilidade) => {
    switch (vulnerabilidade) {
      case 'alta': return '#ef4444';
      case 'media': return '#f59e0b';
      case 'baixa': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getVulnerabilidadeLabel = (vulnerabilidade) => {
    switch (vulnerabilidade) {
      case 'alta': return 'Alta vulnerabilidade';
      case 'media': return 'Média vulnerabilidade';
      case 'baixa': return 'Baixa vulnerabilidade';
      default: return 'Não definida';
    }
  };

  return (
    <div className="painel-social">
      <Header />
      
      <main className="painel-main">
        <div className="container">
          <div className="painel-header">
            <h1>Painel Social - {bairroSelecionado === 'todos' ? 'Todos os Bairros' : bairroSelecionado}</h1>
            <p>Mapa social em tempo real do SolidarBairro</p>
            
            <div className="filtros">
              <select
                value={bairroSelecionado}
                onChange={(e) => setBairroSelecionado(e.target.value)}
                className="filtro-bairro"
              >
                <option value="todos">Todos os bairros</option>
                {bairros.map(bairro => (
                  <option key={bairro} value={bairro}>{bairro}</option>
                ))}
              </select>
              
              <button
                className="btn btn-primary"
                onClick={() => navigate('/cadastro-familia')}
              >
                + Nova Família
              </button>
            </div>
          </div>

          {/* Indicadores principais */}
          <section className="indicadores">
            <div className="indicadores-grid">
              <div className="indicador-card">
                <div className="indicador-icon">🧒</div>
                <div className="indicador-content">
                  <h3>{indicadores.criancas}</h3>
                  <p>Crianças cadastradas</p>
                </div>
              </div>
              
              <div className="indicador-card">
                <div className="indicador-icon">👵</div>
                <div className="indicador-content">
                  <h3>{indicadores.idosos}</h3>
                  <p>Idosos cadastrados</p>
                </div>
              </div>
              
              <div className="indicador-card">
                <div className="indicador-icon">🤰</div>
                <div className="indicador-content">
                  <h3>{indicadores.gestantes}</h3>
                  <p>Gestantes</p>
                </div>
              </div>
              
              <div className="indicador-card">
                <div className="indicador-icon">♿</div>
                <div className="indicador-content">
                  <h3>{indicadores.deficiencia}</h3>
                  <p>Pessoas com deficiência</p>
                </div>
              </div>
            </div>
            
            <div className="indicadores-secundarios">
              <div className="indicador-card wide">
                <div className="indicador-icon">💸</div>
                <div className="indicador-content">
                  <h3>{indicadores.baixaRenda}</h3>
                  <p>Famílias abaixo da linha de renda</p>
                </div>
              </div>
              
              <div className="indicador-card wide">
                <div className="indicador-icon">🏠</div>
                <div className="indicador-content">
                  <h3>{indicadores.altaVulnerabilidade}</h3>
                  <p>Famílias em risco social alto</p>
                </div>
              </div>
            </div>
          </section>

          {/* Mapa placeholder */}
          <section className="mapa-section">
            <h2>🗺️ Mapa do bairro</h2>
            <div className="mapa-placeholder">
              <div className="mapa-content">
                <p>Mapa interativo em desenvolvimento</p>
                <div className="mapa-legenda">
                  <div className="legenda-item">
                    <span className="cor-alta"></span>
                    <span>Alta vulnerabilidade</span>
                  </div>
                  <div className="legenda-item">
                    <span className="cor-media"></span>
                    <span>Média vulnerabilidade</span>
                  </div>
                  <div className="legenda-item">
                    <span className="cor-baixa"></span>
                    <span>Baixa vulnerabilidade</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Lista de famílias */}
          <section className="familias-section">
            <div className="familias-header">
              <h2>📋 Famílias cadastradas ({familiasFiltradas.length})</h2>
              
              <div className="filtros-familia">
                <select
                  value={filtroVulnerabilidade}
                  onChange={(e) => setFiltroVulnerabilidade(e.target.value)}
                >
                  <option value="todas">Todas</option>
                  <option value="alta">Alta vulnerabilidade</option>
                  <option value="media">Média vulnerabilidade</option>
                  <option value="baixa">Baixa vulnerabilidade</option>
                </select>
              </div>
            </div>

            <div className="familias-lista">
              {familiasFiltradas.length === 0 ? (
                <div className="empty-state">
                  <p>Nenhuma família encontrada com os filtros selecionados.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/cadastro-familia')}
                  >
                    Cadastrar primeira família
                  </button>
                </div>
              ) : (
                familiasFiltradas.map(familia => (
                  <div key={familia.id} className="familia-card">
                    <div className="familia-header">
                      <h3>{familia.nomeCompleto}</h3>
                      <span 
                        className="vulnerabilidade-tag"
                        style={{ backgroundColor: getVulnerabilidadeColor(familia.vulnerabilidade) }}
                      >
                        {getVulnerabilidadeLabel(familia.vulnerabilidade)}
                      </span>
                    </div>
                    
                    <div className="familia-info">
                      <div className="info-item">
                        <span className="icon">👨👩👧👦</span>
                        <span>{familia.numeroPessoas} pessoas</span>
                      </div>
                      
                      {familia.criancas > 0 && (
                        <div className="info-item">
                          <span className="icon">👶</span>
                          <span>{familia.criancas} crianças</span>
                        </div>
                      )}
                      
                      {familia.idosos > 0 && (
                        <div className="info-item">
                          <span className="icon">👵</span>
                          <span>{familia.idosos} idosos</span>
                        </div>
                      )}
                      
                      <div className="info-item">
                        <span className="icon">💸</span>
                        <span>{familia.rendaFamiliar?.replace('-', ' ')}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="icon">📍</span>
                        <span>{familia.bairro}</span>
                      </div>
                    </div>
                    
                    <div className="familia-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/perfil-familia/${familia.id}`)}
                      >
                        Ver detalhes
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/atualizar-status/${familia.id}`)}
                      >
                        Atualizar status
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Gráfico simples */}
          <section className="grafico-section">
            <h2>📈 Distribuição por vulnerabilidade</h2>
            <div className="grafico-barras">
              {['alta', 'media', 'baixa'].map(nivel => {
                const count = familiasFiltradas.filter(f => f.vulnerabilidade === nivel).length;
                const percentage = familiasFiltradas.length > 0 ? (count / familiasFiltradas.length) * 100 : 0;
                
                return (
                  <div key={nivel} className="barra-container">
                    <div className="barra-label">
                      {getVulnerabilidadeLabel(nivel)}
                    </div>
                    <div className="barra-wrapper">
                      <div
                        className="barra"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getVulnerabilidadeColor(nivel)
                        }}
                      ></div>
                      <span className="barra-valor">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PainelSocial;