import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
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
            <div className="header-content">
              <div className="header-text">
                <h1>
                  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135673.png" alt="painel" width="32" height="32" style={{marginRight: '12px'}} />
                  Painel Social - {bairroSelecionado === 'todos' ? 'Todos os Bairros' : bairroSelecionado}
                </h1>
                <p>Monitoramento social em tempo real da comunidade SolidarBairro</p>
              </div>
            </div>
            
            <div className="filtros">
              <div className="filtro-group">
                <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="localização" width="20" height="20" />
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
              </div>
              
              <button
                className="btn btn-primary btn-nova-familia"
                onClick={() => navigate('/cadastro-familia')}
              >
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="adicionar" width="18" height="18" />
                Nova Família
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

          {/* Mapa interativo */}
          <section className="mapa-section">
            <h2>🗺️ Mapa do bairro</h2>
            <MapaInterativo 
              familias={familiasFiltradas} 
              pedidos={JSON.parse(localStorage.getItem('solidar-pedidos') || '[]')} 
            />
            <div className="mapa-legenda">
              <div className="legenda-item">
                <div style={{width: '20px', height: '20px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}>👥</div>
                <span>Famílias - Alta vulnerabilidade</span>
              </div>
              <div className="legenda-item">
                <div style={{width: '20px', height: '20px', backgroundColor: '#f59e0b', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}>👥</div>
                <span>Famílias - Média vulnerabilidade</span>
              </div>
              <div className="legenda-item">
                <div style={{width: '20px', height: '20px', backgroundColor: '#22c55e', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}>👥</div>
                <span>Famílias - Baixa vulnerabilidade</span>
              </div>
              <div className="legenda-item">
                <div style={{width: '24px', height: '24px', background: 'linear-gradient(135deg, #FF7A33, #e66a2b)', borderRadius: '6px', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white'}}>🆘</div>
                <span>Pedidos de ajuda</span>
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
                      <h3>
                        <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="pessoa" width="20" height="20" />
                        {familia.nomeCompleto}
                      </h3>
                      <span 
                        className="vulnerabilidade-tag"
                        style={{ backgroundColor: getVulnerabilidadeColor(familia.vulnerabilidade) }}
                      >
                        {getVulnerabilidadeLabel(familia.vulnerabilidade)}
                      </span>
                    </div>
                    
                    <div className="familia-info">
                      <div className="info-item">
                        <div className="icon">
                          <img src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png" alt="família" width="16" height="16" />
                        </div>
                        <div className="info-text">
                          <span className="info-label">Total de pessoas</span>
                          <span className="info-value">{familia.numeroPessoas}</span>
                        </div>
                      </div>
                      
                      {familia.criancas > 0 && (
                        <div className="info-item">
                          <div className="icon">
                            <img src="https://cdn-icons-png.flaticon.com/512/2784/2784403.png" alt="crianças" width="16" height="16" />
                          </div>
                          <div className="info-text">
                            <span className="info-label">Crianças (0-12 anos)</span>
                            <span className="info-value">{familia.criancas}</span>
                          </div>
                        </div>
                      )}
                      
                      {familia.idosos > 0 && (
                        <div className="info-item">
                          <div className="icon">
                            <img src="https://cdn-icons-png.flaticon.com/512/2784/2784403.png" alt="idosos" width="16" height="16" />
                          </div>
                          <div className="info-text">
                            <span className="info-label">Idosos (60+ anos)</span>
                            <span className="info-value">{familia.idosos}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="info-item">
                        <div className="icon">
                          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="dinheiro" width="16" height="16" />
                        </div>
                        <div className="info-text">
                          <span className="info-label">Renda familiar</span>
                          <span className="info-value">{familia.rendaFamiliar?.replace('-', ' ')}</span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="icon">
                          <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="localização" width="16" height="16" />
                        </div>
                        <div className="info-text">
                          <span className="info-label">Localização</span>
                          <span className="info-value">{familia.bairro}</span>
                        </div>
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