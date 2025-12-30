import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import MapaInterativo from '../components/MapaInterativo';
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
      <Header showLoginButton={false} />
      
      <main className="painel-main">
        <div className="container">
          <div className="painel-header">
            <div className="header-hero">
              <div className="hero-badge">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135673.png" alt="dashboard" width="16" height="16" className="badge-icon" />
                <span>Dashboard Social</span>
              </div>
              
              <div className="hero-title">
                <h1>
                  <img src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png" alt="painel" width="42" height="42" className="title-icon" />
                  Painel Social
                  <span className="title-location">- {bairroSelecionado === 'todos' ? 'Todos os Bairros' : bairroSelecionado}</span>
                </h1>
                <p className="hero-subtitle">Monitoramento social em tempo real da comunidade SolidarBairro</p>
              </div>
              
              <div className="hero-stats">
                <div className="stat-quick">
                  <span className="stat-number">{indicadores.total}</span>
                  <span className="stat-label">Famílias</span>
                </div>
                <div className="stat-quick">
                  <span className="stat-number">{indicadores.criancas + indicadores.idosos}</span>
                  <span className="stat-label">Pessoas</span>
                </div>
                <div className="stat-quick">
                  <span className="stat-number">{bairros.length}</span>
                  <span className="stat-label">Bairros</span>
                </div>
              </div>
            </div>
            
            <div className="header-controls">
              <div className="controls-group">
                <div className="control-item">
                  <label className="control-label">
                    <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="localização" width="16" height="16" className="label-icon" />
                    Filtrar por bairro
                  </label>
                  <div className="select-wrapper">
                    <select
                      value={bairroSelecionado}
                      onChange={(e) => setBairroSelecionado(e.target.value)}
                      className="control-select"
                    >
                      <option value="todos">Todos os bairros</option>
                      {bairros.map(bairro => (
                        <option key={bairro} value={bairro}>{bairro}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="control-actions">
                  <button
                    className="btn-action btn-secondary"
                    onClick={() => window.print()}
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/3039/3039386.png" alt="relatório" width="18" height="18" className="btn-icon" />
                    Relatório
                  </button>
                  
                  <button
                    className="btn-action btn-primary"
                    onClick={() => navigate('/cadastro-familia')}
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="adicionar" width="18" height="18" className="btn-icon" />
                    Nova Família
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores principais */}
          <section className="indicadores">
            <div className="indicadores-header">
              <h2 className="section-title">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135673.png" alt="indicadores" width="32" height="32" className="title-icon" />
                Indicadores Demográficos
              </h2>
              <p className="section-subtitle">Panorama populacional da comunidade</p>
            </div>
            
            <div className="indicadores-grid">
              <div className="indicador-card-clean">
                <div className="card-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/2784/2784403.png" alt="crianças" width="24" height="24" />
                </div>
                <div className="card-info">
                  <div className="card-meta">
                    <span className="card-title">Crianças</span>
                    <span className="card-subtitle">0-12 anos</span>
                  </div>
                  <div className="card-stats">
                    <span className="card-number">{indicadores.criancas}</span>
                    <span className="card-label">Cadastradas</span>
                  </div>
                </div>
              </div>
              
              <div className="indicador-card-clean">
                <div className="card-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="idosos" width="24" height="24" />
                </div>
                <div className="card-info">
                  <div className="card-meta">
                    <span className="card-title">Idosos</span>
                    <span className="card-subtitle">60+ anos</span>
                  </div>
                  <div className="card-stats">
                    <span className="card-number">{indicadores.idosos}</span>
                    <span className="card-label">Cadastrados</span>
                  </div>
                </div>
              </div>
              
              <div className="indicador-card-clean">
                <div className="card-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/3468/3468377.png" alt="gestantes" width="24" height="24" />
                </div>
                <div className="card-info">
                  <div className="card-meta">
                    <span className="card-title">Gestantes</span>
                    <span className="card-subtitle">Gestação</span>
                  </div>
                  <div className="card-stats">
                    <span className="card-number">{indicadores.gestantes}</span>
                    <span className="card-label">Cadastradas</span>
                  </div>
                </div>
              </div>
              
              <div className="indicador-card-clean">
                <div className="card-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/2913/2913465.png" alt="pessoas com deficiência" width="24" height="24" />
                </div>
                <div className="card-info">
                  <div className="card-meta">
                    <span className="card-title">PcD</span>
                    <span className="card-subtitle">Deficiência</span>
                  </div>
                  <div className="card-stats">
                    <span className="card-number">{indicadores.deficiencia}</span>
                    <span className="card-label">Pessoas</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="indicadores-secundarios">
              <div className="indicador-card-clean">
                <div className="card-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="baixa renda" width="24" height="24" />
                </div>
                <div className="card-info">
                  <div className="card-meta">
                    <span className="card-title">Baixa Renda</span>
                    <span className="card-subtitle">Famílias</span>
                  </div>
                  <div className="card-stats">
                    <span className="card-number">{indicadores.baixaRenda}</span>
                    <span className="card-label">Abaixo da linha</span>
                  </div>
                </div>
              </div>
              
              <div className="indicador-card-clean">
                <div className="card-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png" alt="vulnerabilidade" width="24" height="24" />
                </div>
                <div className="card-info">
                  <div className="card-meta">
                    <span className="card-title">Risco Alto</span>
                    <span className="card-subtitle">Vulnerabilidade</span>
                  </div>
                  <div className="card-stats">
                    <span className="card-number">{indicadores.altaVulnerabilidade}</span>
                    <span className="card-label">Famílias</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mapa interativo */}
          <section className="mapa-section">
            <h2>
              <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="mapa" width="24" height="24" style={{marginRight: '8px', verticalAlign: 'middle'}} />
              Mapa do bairro
            </h2>
            <MapaInterativo 
              familias={familiasFiltradas} 
              pedidos={JSON.parse(localStorage.getItem('solidar-pedidos') || '[]')} 
            />
            <div className="mapa-legenda">
              <div className="legenda-item">
                <div style={{width: '20px', height: '20px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}></div>
                <span>Famílias - Alta vulnerabilidade</span>
              </div>
              <div className="legenda-item">
                <div style={{width: '20px', height: '20px', backgroundColor: '#f59e0b', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}></div>
                <span>Famílias - Média vulnerabilidade</span>
              </div>
              <div className="legenda-item">
                <div style={{width: '20px', height: '20px', backgroundColor: '#22c55e', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}></div>
                <span>Famílias - Baixa vulnerabilidade</span>
              </div>
              <div className="legenda-item">
                <div style={{width: '24px', height: '24px', background: 'linear-gradient(135deg, #FF7A33, #e66a2b)', borderRadius: '6px', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white'}}>!</div>
                <span>Pedidos de ajuda</span>
              </div>
            </div>
          </section>

          {/* Lista de famílias */}
          <section className="familias-section">
            <div className="familias-header">
              <h2 className="section-title-minimal">
                Famílias cadastradas
                <span className="count-badge">{familiasFiltradas.length}</span>
              </h2>
              
              <div className="filter-minimal">
                <select
                  value={filtroVulnerabilidade}
                  onChange={(e) => setFiltroVulnerabilidade(e.target.value)}
                  className="select-minimal"
                >
                  <option value="todas">Todas</option>
                  <option value="alta">Alta vulnerabilidade</option>
                  <option value="media">Média vulnerabilidade</option>
                  <option value="baixa">Baixa vulnerabilidade</option>
                </select>
              </div>
            </div>

            <div className="familias-grid">
              {familiasFiltradas.length === 0 ? (
                <div className="empty-state-minimal">
                  <div className="empty-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png" alt="família" width="40" height="40" style={{opacity: '0.5'}} />
                  </div>
                  <p>Nenhuma família encontrada</p>
                  <button
                    className="btn-minimal primary"
                    onClick={() => navigate('/cadastro-familia')}
                  >
                    Cadastrar primeira família
                  </button>
                </div>
              ) : (
                familiasFiltradas.map(familia => (
                  <div key={familia.id} className="familia-card-minimal">
                    <div className="card-header-minimal">
                      <div className="family-info">
                        <h3 className="family-name">{familia.nomeCompleto}</h3>
                        <span 
                          className="status-dot"
                          style={{ backgroundColor: getVulnerabilidadeColor(familia.vulnerabilidade) }}
                        ></span>
                      </div>
                      <div className="family-meta">
                        <span className="location">{familia.bairro}</span>
                        <span className="separator">•</span>
                        <span className="people-count">{familia.numeroPessoas} pessoas</span>
                      </div>
                    </div>
                    
                    <div className="card-content-minimal">
                      <div className="info-grid-minimal">
                        {familia.criancas > 0 && (
                          <div className="info-item-minimal">
                            <span className="info-value">{familia.criancas}</span>
                            <span className="info-label">Crianças</span>
                          </div>
                        )}
                        
                        {familia.idosos > 0 && (
                          <div className="info-item-minimal">
                            <span className="info-value">{familia.idosos}</span>
                            <span className="info-label">Idosos</span>
                          </div>
                        )}
                        
                        <div className="info-item-minimal">
                          <span className="info-value">{familia.rendaFamiliar?.replace('-', ' ') || 'N/A'}</span>
                          <span className="info-label">Renda</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-actions-minimal">
                      <button
                        className="btn-minimal secondary"
                        onClick={() => navigate(`/perfil-familia/${familia.id}`)}
                      >
                        Ver detalhes
                      </button>
                      <button
                        className="btn-minimal primary"
                        onClick={() => navigate(`/atualizar-status/${familia.id}`)}
                      >
                        Atualizar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Gráfico simples */}
          <section className="grafico-section">
            <h2>
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135673.png" alt="gráfico" width="24" height="24" style={{marginRight: '8px', verticalAlign: 'middle'}} />
              Distribuição por vulnerabilidade
            </h2>
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