import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import MapaInterativo from '../components/MapaInterativo';
import '../styles/pages/PainelSocial.css';

const BAIRROS_SANTA_LUZIA = [
  "Adeodato", "Alto das Maravilhas", "Alto do Tanque", "Amazonas", "Ana Lúcia", "Asteca", 
  "Baronesa", "Belo Vale", "Bicas", "Boa Esperança", "Bom Destino", "Bonanza", "Camelos", 
  "Capitão Eduardo", "Carreira Comprida", "Casa Branca", "Castanheira", "Chácara de Lazer San Remo", 
  "Chácaras Del Rey", "Chácaras Gervásio Lara", "Chácaras Santa Inês", "Colorado", 
  "Condomínio Estância do Lago", "Conjunto Habitacional Maria Antonieta Mello Azevedo", 
  "Córrego das Calçadas", "Córrego Frio", "Cristina", "Cuité", "Dona Rosarinha", "Duquesa", 
  "Esplanada", "Frimisa", "Gameleira", "Gávea", "Idulipê", "Imperial", "Industrial Americano", 
  "Itamaraty", "Jardim Alvorada", "Jardim das Acácias", "Jardim Europa", "Kennedy", 
  "Liberdade", "Londrina", "Luxemburgo", "Maria Antonieta", "Monte Carlo", "Morada do Rio", 
  "Morada do Vale", "Morena Rosa", "Nossa Senhora da Paz", "Nossa Senhora das Graças", 
  "Nossa Senhora do Carmo", "Nova Conquista", "Nova Esperança", "Novo Centro", "Novo Esplanada", 
  "Padre Miguel", "Palmital", "Palmital A", "Palmital B", "Pantanal", "Parque Mutirão", 
  "Pedra Branca", "Petrópolis", "Pinhões", "Ponte Grande", "Portal das Águas", "Portal Santa Luzia", 
  "Pousada de Santo Antônio", "Quarenta e Dois", "Quinta das Flores", "Recanto do Sabiá", 
  "Retiro do Recreio", "Rio das Velhas", "Rio Manso", "Rosarinho", "Santa Catarina", 
  "Santa Matilde", "Santa Rita", "São Benedito", "São Cosme", "São Geraldo", "São João Batista", 
  "São Judas Tadeu", "São Luíz", "São Sebastião", "Vale das Acácias", "Vale do Amanhecer", 
  "Vila Ferraz", "Vila Iris", "Vila Olga", "Vila Pinho", "Vila Real", "Vila Santa Rita"
];

const PainelSocial = () => {
  const navigate = useNavigate();
  const [selectedBairro, setSelectedBairro] = useState("São Benedito");
  const [isBairroDropdownOpen, setIsBairroDropdownOpen] = useState(false);
  const [bairroSearch, setBairroSearch] = useState("");
  const [filter, setFilter] = useState("Todas");
  const [familias, setFamilias] = useState([]);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsBairroDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const familiasData = JSON.parse(localStorage.getItem('familias') || '[]');
    setFamilias(familiasData);
  }, []);

  const filteredBairros = useMemo(() => {
    return BAIRROS_SANTA_LUZIA.filter(b => 
      b.toLowerCase().includes(bairroSearch.toLowerCase())
    );
  }, [bairroSearch]);

  const indicators = [
    { label: "Crianças", value: 128, icon: "👶", color: "#0ea5e9" },
    { label: "Idosos", value: 47, icon: "👴", color: "#8b5cf6" },
    { label: "Gestantes", value: 12, icon: "🤱", color: "#ec4899" },
    { label: "PCDs", value: 19, icon: "♿", color: "#f59e0b" },
  ];

  const mockFamilies = [
    { 
      id: 1, 
      name: "Família Silva", 
      vulnerability: "Alta", 
      urgency: "Alta",
      members: 5, 
      children: 2, 
      elderly: 1, 
      income: "Sem renda", 
      bairro: selectedBairro,
      lat: -19.7680,
      lng: -43.8500,
      color: "#ef4444"
    },
    { 
      id: 2, 
      name: "Família Santos", 
      vulnerability: "Média", 
      urgency: "Média",
      members: 3, 
      children: 1, 
      elderly: 0, 
      income: "1 salário", 
      bairro: selectedBairro,
      lat: -19.7700,
      lng: -43.8520,
      color: "#f97316"
    },
    { 
      id: 3, 
      name: "Família Oliveira", 
      vulnerability: "Baixa", 
      urgency: "Baixa",
      members: 4, 
      children: 2, 
      elderly: 0, 
      income: "2 salários", 
      bairro: selectedBairro,
      lat: -19.7720,
      lng: -43.8480,
      color: "#22c55e"
    },
    { 
      id: 4, 
      name: "Família Pereira", 
      vulnerability: "Alta", 
      urgency: "Crítica",
      members: 6, 
      children: 3, 
      elderly: 1, 
      income: "Auxílio", 
      bairro: selectedBairro,
      lat: -19.7660,
      lng: -43.8540,
      color: "#ef4444"
    },
  ];

  const filteredFamilies = mockFamilies.filter(f => {
    if (filter === "Todas") return true;
    if (filter === "Com crianças") return f.children > 0;
    if (filter === "Com idosos") return f.elderly > 0;
    if (filter === "Alta vulnerabilidade") return f.vulnerability === "Alta";
    return true;
  });

  // Chart Data
  const vulnerabilityData = [
    { name: "Alta", value: 34, color: "#ef4444" },
    { name: "Média", value: 45, color: "#f97316" },
    { name: "Baixa", value: 62, color: "#22c55e" },
  ];

  const zonaData = [
    { name: "Norte", crianças: 45, idosos: 12 },
    { name: "Sul", crianças: 82, idosos: 28 },
    { name: "Leste", crianças: 56, idosos: 15 },
    { name: "Oeste", crianças: 38, idosos: 22 },
  ];

  return (
    <div className="painel-wrapper">
      <div className="container">
        {/* Topo */}
        <header className="painel-header">
          <div>
            <div 
              className="logo"
              style={{ marginBottom: '24px', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <i className="fi fi-rr-heart logo-icon"></i>
              <span>SolidarBairro</span>
            </div>
            <h1>Painel Social</h1>
            <p>Gestão estratégica e mapa social: {selectedBairro}</p>
          </div>
          
          <div className="header-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button className="btn-back" onClick={() => navigate('/')}>
              <i className="fi fi-rr-arrow-left"></i>
              <span>Voltar</span>
            </button>
            
            <div className="bairro-selector-container" ref={dropdownRef}>
              <div 
                className={`bairro-filter ${isBairroDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsBairroDropdownOpen(!isBairroDropdownOpen)}
              >
                <i className="fi fi-rr-marker" style={{ color: 'var(--sb-teal)' }}></i>
                <span>{selectedBairro}</span>
                <i className={`fi fi-rr-angle-down chevron ${isBairroDropdownOpen ? 'rotate' : ''}`}></i>
              </div>

              {isBairroDropdownOpen && (
                <div className="bairro-dropdown">
                  <div className="dropdown-search">
                    <i className="fi fi-rr-search"></i>
                    <input 
                      type="text" 
                      placeholder="Buscar bairro..." 
                      value={bairroSearch}
                      onChange={(e) => setBairroSearch(e.target.value)}
                      autoFocus
                    />
                    {bairroSearch && (
                      <i 
                        className="fi fi-rr-cross clear-search" 
                        onClick={() => setBairroSearch("")} 
                      ></i>
                    )}
                  </div>
                  <div className="dropdown-list">
                    {filteredBairros.length > 0 ? (
                      filteredBairros.map(b => (
                        <div 
                          key={b} 
                          className={`dropdown-item ${selectedBairro === b ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedBairro(b);
                            setIsBairroDropdownOpen(false);
                            setBairroSearch("");
                          }}
                        >
                          {b}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-empty">Nenhum bairro encontrado</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Bloco 1 – Indicadores principais */}
        <div className="indicators-grid">
          {indicators.map((ind, i) => (
            <div key={i} className="indicator-card">
              <div className="icon-box" style={{ background: `${ind.color}15`, color: ind.color }}>
                <span style={{ fontSize: '28px' }}>{ind.icon}</span>
              </div>
              <h3>{ind.label}</h3>
              <div className="value">{ind.value}</div>
            </div>
          ))}
        </div>

        <div className="sub-indicators">
          <div className="sub-card warning">
            <div className="label">
              <i className="fi fi-rr-trending-down" style={{ marginRight: 12, verticalAlign: 'middle', color: 'var(--sb-orange)' }}></i>
              Famílias abaixo da linha de renda
            </div>
            <div className="value">86</div>
          </div>
          
          <div className="sub-card warning">
            <div className="label">
              <i className="fi fi-rr-triangle-warning" style={{ marginRight: 12, verticalAlign: 'middle', color: 'var(--sb-orange)' }}></i>
              Famílias em risco social alto
            </div>
            <div className="value">34</div>
          </div>
        </div>

        {/* Bloco 2 – Mapa do bairro */}
        <section className="map-section">
          <div className="section-title">
            <h2>🗺️ Mapa do bairro</h2>
            <div className="map-legend">
               <div className="layer-item"><div className="dot-red"></div> Alta</div>
               <div className="layer-item"><div className="dot-orange"></div> Média</div>
               <div className="layer-item"><div className="dot-green"></div> Baixa</div>
            </div>
          </div>
          
          <div className="map-container-wrapper">
            <MapaInterativo 
              familias={filteredFamilies} 
              pedidos={JSON.parse(localStorage.getItem('solidar-pedidos') || '[]')} 
            />

            <div className="map-layers-float">
              <div className="layer-item"><i className="fi fi-rr-check-circle" style={{ color: 'var(--sb-teal)' }}></i> Famílias vulneráveis</div>
              <div className="layer-item"><i className="fi fi-rr-shop"></i> Comércios parceiros</div>
              <div className="layer-item"><i className="fi fi-rr-building"></i> ONGs</div>
              <div className="layer-item"><i className="fi fi-rr-trash"></i> Pontos de coleta</div>
            </div>
          </div>
        </section>

        {/* Bloco 3 – Lista de famílias filtradas */}
        <section className="list-section">
          <div className="section-title">
            <h2>📋 Lista de famílias</h2>
            <div className="list-filters">
              {["Todas", "Com crianças", "Com idosos", "Alta vulnerabilidade"].map(f => (
                <button 
                  key={f} 
                  className={`filter-chip ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="family-list">
            {filteredFamilies.map((f, i) => (
              <div key={f.id} className="family-card">
                <div className="family-info">
                  <h4>
                    {f.name} 
                    <span className={`vulnerability-badge vul-${f.vulnerability === 'Alta' ? 'high' : f.vulnerability === 'Média' ? 'med' : 'low'}`}>
                      {f.vulnerability} vulnerabilidade
                    </span>
                  </h4>
                  <div className="family-details">
                    <span><i className="fi fi-rr-users"></i> {f.members} pessoas</span>
                    <span><i className="fi fi-rr-baby"></i> {f.children} crianças</span>
                    <span>{f.elderly > 0 ? `👵 ${f.elderly} idoso` : ''}</span>
                    <span>💸 {f.income}</span>
                    <span>📍 {f.bairro}</span>
                  </div>
                </div>
                
                <div className="family-actions">
                  <button className="btn-sm btn-secondary-sm">Atualizar status</button>
                  <button className="btn-sm btn-primary-sm">Ver detalhes</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bloco 4 – Gráficos Profissionais */}
        <section className="charts-section">
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Vulnerabilidade por Nível</h3>
              <div className="chart-container-recharts">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={vulnerabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {vulnerabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {vulnerabilityData.map(d => (
                    <div key={d.name} className="legend-item">
                      <span className="legend-dot" style={{ backgroundColor: d.color }}></span>
                      <span>{d.name}: {d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Impacto por Zona</h3>
              <div className="chart-container-recharts">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={zonaData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="crianças" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="idosos" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PainelSocial;