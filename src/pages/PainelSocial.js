import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/PainelSocial.css';

const PainelSocial = () => {
  const navigate = useNavigate();
  const [bairroSelecionado, setBairroSelecionado] = useState('São Lucas');
  const [filtroFamilias, setFiltroFamilias] = useState('Todas');
  const [camadasMapa, setCamadasMapa] = useState({
    vulneraveis: true,
    comercios: false,
    ongs: false,
    pontosColeta: false
  });

  // Dados mockados
  const indicadores = {
    criancas: 128,
    idosos: 47,
    gestantes: 12,
    pessoasDeficiencia: 19,
    familiasAbaixoRenda: 86,
    familiasAltoRisco: 34
  };

  const familias = [
    {
      id: 1,
      nome: 'Família Silva',
      vulnerabilidade: 'Alta',
      pessoas: 5,
      criancas: 2,
      idosos: 1,
      renda: 'Sem renda',
      bairro: 'São Lucas',
      temCriancas: true,
      temIdosos: true,
      temGestantes: true,
      temDeficiencia: false,
      abaixoRenda: true
    },
    {
      id: 2,
      nome: 'Família Santos',
      vulnerabilidade: 'Média',
      pessoas: 3,
      criancas: 1,
      idosos: 0,
      renda: 'Até 1 SM',
      bairro: 'São Lucas',
      temCriancas: true,
      temIdosos: false,
      temGestantes: false,
      temDeficiencia: true,
      abaixoRenda: true
    },
    {
      id: 3,
      nome: 'Família Oliveira',
      vulnerabilidade: 'Baixa',
      pessoas: 4,
      criancas: 0,
      idosos: 2,
      renda: 'Entre 1 e 2 SM',
      bairro: 'São Lucas',
      temCriancas: false,
      temIdosos: true,
      temGestantes: false,
      temDeficiencia: false,
      abaixoRenda: false
    }
  ];

  const bairros = ['São Lucas', 'Centro', 'Vila Nova', 'Jardim América', 'Santa Rita'];
  const filtros = ['Todas', 'Com crianças', 'Com idosos', 'Com gestantes', 'Com deficiência', 'Abaixo da linha de renda'];

  const familiasFiltradas = familias.filter(familia => {
    switch (filtroFamilias) {
      case 'Com crianças': return familia.temCriancas;
      case 'Com idosos': return familia.temIdosos;
      case 'Com gestantes': return familia.temGestantes;
      case 'Com deficiência': return familia.temDeficiencia;
      case 'Abaixo da linha de renda': return familia.abaixoRenda;
      default: return true;
    }
  });

  const dadosGrafico = {
    vulnerabilidade: {
      alta: familias.filter(f => f.vulnerabilidade === 'Alta').length,
      media: familias.filter(f => f.vulnerabilidade === 'Média').length,
      baixa: familias.filter(f => f.vulnerabilidade === 'Baixa').length
    }
  };

  const handleCamadaChange = (camada) => {
    setCamadasMapa({
      ...camadasMapa,
      [camada]: !camadasMapa[camada]
    });
  };

  return (
    <div className="painel-social">
      <div className="container">
        <div className="painel-header">
          <button className="back-btn" onClick={() => navigate('/home')}>
            ← Voltar
          </button>
          <div className="header-content">
            <h1>Painel – Bairro {bairroSelecionado}</h1>
            <p>Mapa social em tempo real do SolidarBairro</p>
            <div className="bairro-selector">
              <select 
                value={bairroSelecionado}
                onChange={(e) => setBairroSelecionado(e.target.value)}
              >
                {bairros.map(bairro => (
                  <option key={bairro} value={bairro}>{bairro}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bloco 1 - Indicadores principais */}
        <div className="indicadores-section">
          <div className="indicadores-grid">
            <div className="indicador-card">
              <div className="indicador-icon">🧒</div>
              <div className="indicador-content">
                <span className="indicador-numero">{indicadores.criancas}</span>
                <span className="indicador-label">Crianças cadastradas</span>
              </div>
            </div>
            <div className="indicador-card">
              <div className="indicador-icon">👵</div>
              <div className="indicador-content">
                <span className="indicador-numero">{indicadores.idosos}</span>
                <span className="indicador-label">Idosos cadastrados</span>
              </div>
            </div>
            <div className="indicador-card">
              <div className="indicador-icon">🤰</div>
              <div className="indicador-content">
                <span className="indicador-numero">{indicadores.gestantes}</span>
                <span className="indicador-label">Gestantes</span>
              </div>
            </div>
            <div className="indicador-card">
              <div className="indicador-icon">♿</div>
              <div className="indicador-content">
                <span className="indicador-numero">{indicadores.pessoasDeficiencia}</span>
                <span className="indicador-label">Pessoas com deficiência</span>
              </div>
            </div>
          </div>
          <div className="indicadores-secundarios">
            <div className="indicador-card destaque">
              <div className="indicador-icon">💸</div>
              <div className="indicador-content">
                <span className="indicador-numero">{indicadores.familiasAbaixoRenda}</span>
                <span className="indicador-label">Famílias abaixo da linha de renda</span>
              </div>
            </div>
            <div className="indicador-card destaque">
              <div className="indicador-icon">🏠</div>
              <div className="indicador-content">
                <span className="indicador-numero">{indicadores.familiasAltoRisco}</span>
                <span className="indicador-label">Famílias em risco social alto</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 2 - Mapa do bairro */}
        <div className="mapa-section">
          <div className="mapa-header">
            <h3>🗺️ Mapa do bairro</h3>
            <div className="camadas-controle">
              <span>Camadas:</span>
              <label className="camada-checkbox">
                <input
                  type="checkbox"
                  checked={camadasMapa.vulneraveis}
                  onChange={() => handleCamadaChange('vulneraveis')}
                />
                Famílias vulneráveis
              </label>
              <label className="camada-checkbox">
                <input
                  type="checkbox"
                  checked={camadasMapa.comercios}
                  onChange={() => handleCamadaChange('comercios')}
                />
                Comércios parceiros
              </label>
              <label className="camada-checkbox">
                <input
                  type="checkbox"
                  checked={camadasMapa.ongs}
                  onChange={() => handleCamadaChange('ongs')}
                />
                ONGs
              </label>
              <label className="camada-checkbox">
                <input
                  type="checkbox"
                  checked={camadasMapa.pontosColeta}
                  onChange={() => handleCamadaChange('pontosColeta')}
                />
                Pontos de coleta
              </label>
            </div>
          </div>
          <div className="mapa-container">
            <div className="mapa-placeholder">
              <p>Mapa interativo do bairro {bairroSelecionado}</p>
              <div className="pontos-mapa">
                <div className="ponto alta">🔴 Alta vulnerabilidade</div>
                <div className="ponto media">🟠 Média vulnerabilidade</div>
                <div className="ponto baixa">🟢 Baixa vulnerabilidade</div>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/cadastro-familia')}
              >
                + Cadastrar nova família
              </button>
            </div>
          </div>
        </div>

        {/* Bloco 3 - Lista de famílias */}
        <div className="familias-section">
          <div className="familias-header">
            <h3>📋 Lista de famílias filtradas</h3>
            <div className="filtros-familias">
              <span>Mostrar apenas:</span>
              {filtros.map(filtro => (
                <label key={filtro} className="filtro-radio">
                  <input
                    type="radio"
                    name="filtroFamilias"
                    value={filtro}
                    checked={filtroFamilias === filtro}
                    onChange={(e) => setFiltroFamilias(e.target.value)}
                  />
                  {filtro}
                </label>
              ))}
            </div>
          </div>
          <div className="familias-lista">
            {familiasFiltradas.map(familia => (
              <div key={familia.id} className="familia-card">
                <div className="familia-info">
                  <div className="familia-header">
                    <h4>{familia.nome}</h4>
                    <span className={`vulnerabilidade-badge ${familia.vulnerabilidade.toLowerCase()}`}>
                      {familia.vulnerabilidade} vulnerabilidade
                    </span>
                  </div>
                  <div className="familia-detalhes">
                    <span>👨👩👧👦 {familia.pessoas} pessoas</span>
                    {familia.criancas > 0 && <span>👶 {familia.criancas} crianças</span>}
                    {familia.idosos > 0 && <span>👵 {familia.idosos} idoso(s)</span>}
                  </div>
                  <div className="familia-meta">
                    <span>💸 {familia.renda}</span>
                    <span>📍 Bairro {familia.bairro}</span>
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
            ))}
          </div>
        </div>

        {/* Bloco 4 - Gráfico simples */}
        <div className="grafico-section">
          <h3>📈 Famílias por nível de vulnerabilidade</h3>
          <div className="grafico-barras">
            <div className="barra-container">
              <div className="barra alta" style={{height: `${(dadosGrafico.vulnerabilidade.alta / familias.length) * 100}%`}}>
                <span className="barra-valor">{dadosGrafico.vulnerabilidade.alta}</span>
              </div>
              <span className="barra-label">Alta</span>
            </div>
            <div className="barra-container">
              <div className="barra media" style={{height: `${(dadosGrafico.vulnerabilidade.media / familias.length) * 100}%`}}>
                <span className="barra-valor">{dadosGrafico.vulnerabilidade.media}</span>
              </div>
              <span className="barra-label">Média</span>
            </div>
            <div className="barra-container">
              <div className="barra baixa" style={{height: `${(dadosGrafico.vulnerabilidade.baixa / familias.length) * 100}%`}}>
                <span className="barra-valor">{dadosGrafico.vulnerabilidade.baixa}</span>
              </div>
              <span className="barra-label">Baixa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainelSocial;