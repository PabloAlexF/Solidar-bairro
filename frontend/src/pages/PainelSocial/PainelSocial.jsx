import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Search,
  X,
  MapPin,
  Users,
  Plus,
  Download,
  Layers,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Phone,
  Home as HomeIcon,
  Clock,
  Map,
  List,
  AlertTriangle,
  CheckCircle,
  Circle,
  MoreVertical,
  Shield,
  UserCheck,
  Baby,
} from "lucide-react";
import "./painel-social.css";

const MapaInterativo = lazy(() => import("./MapaInterativo"));

const BAIRROS = ["São Benedito", "Palmital", "Palmital A", "Palmital B", "Boa Esperança", "Bom Destino"];

const MOCK_DATA = {
  pedidos: [
    { id: "p1", lat: -19.767, lng: -43.849, titulo: "Cesta básica urgente", tipo: "pedido", categoria: "Alimentação", status: "Urgente" },
    { id: "p2", lat: -19.771, lng: -43.853, titulo: "Roupas infantis", tipo: "oferta", categoria: "Vestuário", status: "Disponível" },
    { id: "p3", lat: -19.769, lng: -43.847, titulo: "Remédios", tipo: "pedido", categoria: "Saúde", status: "Pendente" },
  ],
  comercios: [
    { id: "c1", lat: -19.7685, lng: -43.8515, nome: "Mercado Bom Preço", tipo: "Supermercado", parceiro: true, moedaSolidaria: true },
    { id: "c2", lat: -19.7705, lng: -43.8495, nome: "Farmácia Popular", tipo: "Farmácia", parceiro: true, moedaSolidaria: false },
  ],
  ongs: [
    { id: "o1", lat: -19.7695, lng: -43.8505, nome: "Casa da Criança", servicos: ["Reforço escolar", "Alimentação"], contato: "(31) 3333-1111" },
  ],
  pontosColeta: [
    { id: "pc1", lat: -19.7675, lng: -43.8535, nome: "Central de Coleta", itens: ["Alimentos", "Roupas"], horario: "Seg-Sex 8h-17h" },
  ],
  zonasRisco: [
    { id: "z1", coords: [[-19.765, -43.856], [-19.765, -43.852], [-19.768, -43.852], [-19.768, -43.856]], tipo: "enchente", nivel: "alto" },
  ],
};

export default function PainelSocial() {
  const navigate = useNavigate();
  const [bairro, setBairro] = useState("São Benedito");
  const [bairroOpen, setBairroOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [view, setView] = useState("lista");
  const [mapLayers, setMapLayers] = useState({
    familias: true,
    pedidos: true,
    comercios: true,
    ongs: true,
    pontosColeta: true,
    zonasRisco: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    members: 1,
    children: 0,
    elderly: 0,
    income: "Sem renda",
    vulnerability: "Média",
    phone: "",
    address: "",
  });
  const [openMenu, setOpenMenu] = useState(null);

  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("solidar-familias");
    if (stored) {
      setFamilies(JSON.parse(stored));
    } else {
      const initial = [
        { id: 1, name: "Família Silva", vulnerability: "Alta", urgency: "Crítica", members: 5, children: 2, elderly: 1, income: "Sem renda", bairro: "São Benedito", lat: -19.768, lng: -43.85, color: "#dc2626", phone: "(31) 99999-1111", address: "Rua das Flores, 123", status: "ativo", lastUpdate: "2024-01-15" },
        { id: 2, name: "Família Santos", vulnerability: "Média", urgency: "Média", members: 3, children: 1, elderly: 0, income: "1 salário", bairro: "São Benedito", lat: -19.77, lng: -43.852, color: "#d97706", phone: "(31) 99999-2222", address: "Av. Principal, 456", status: "atendido", lastUpdate: "2024-01-14" },
        { id: 3, name: "Família Oliveira", vulnerability: "Baixa", urgency: "Baixa", members: 4, children: 2, elderly: 0, income: "2 salários", bairro: "São Benedito", lat: -19.772, lng: -43.848, color: "#059669", phone: "(31) 99999-3333", address: "Rua do Comércio, 789", status: "ativo", lastUpdate: "2024-01-13" },
        { id: 4, name: "Família Pereira", vulnerability: "Alta", urgency: "Alta", members: 6, children: 3, elderly: 1, income: "Auxílio", bairro: "São Benedito", lat: -19.766, lng: -43.854, color: "#dc2626", phone: "(31) 99999-4444", address: "Beco da Esperança, 10", status: "pendente", lastUpdate: "2024-01-12" },
        { id: 5, name: "Família Costa", vulnerability: "Média", urgency: "Média", members: 4, children: 2, elderly: 1, income: "1/2 salário", bairro: "Palmital", lat: -19.775, lng: -43.845, color: "#d97706", phone: "(31) 99999-5555", address: "Rua Nova, 321", status: "ativo", lastUpdate: "2024-01-11" },
      ];
      setFamilies(initial);
      localStorage.setItem("solidar-familias", JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setBairroOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredFamilies = useMemo(() => {
    let result = families.filter((f) => f.bairro === bairro);
    if (searchQuery) {
      result = result.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.address?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (activeFilter === "alta") result = result.filter((f) => f.vulnerability === "Alta");
    if (activeFilter === "criancas") result = result.filter((f) => f.children > 0);
    if (activeFilter === "idosos") result = result.filter((f) => f.elderly > 0);
    if (activeFilter === "pendente") result = result.filter((f) => f.status === "pendente");
    return result;
  }, [families, bairro, searchQuery, activeFilter]);

  const stats = useMemo(() => {
    const bairroFamilies = families.filter((f) => f.bairro === bairro);
    return {
      total: bairroFamilies.length,
      pessoas: bairroFamilies.reduce((a, f) => a + f.members, 0),
      criancas: bairroFamilies.reduce((a, f) => a + f.children, 0),
      idosos: bairroFamilies.reduce((a, f) => a + f.elderly, 0),
      altaVuln: bairroFamilies.filter((f) => f.vulnerability === "Alta").length,
      pendentes: bairroFamilies.filter((f) => f.status === "pendente").length,
      atendidos: bairroFamilies.filter((f) => f.status === "atendido").length,
    };
  }, [families, bairro]);

  const saveFamily = () => {
    if (!formData.name) return;
    const newFamily = {
      id: editingFamily?.id || Date.now(),
      ...formData,
      urgency: formData.vulnerability === "Alta" ? "Alta" : formData.vulnerability === "Média" ? "Média" : "Baixa",
      bairro,
      lat: editingFamily?.lat || -19.768 + (Math.random() - 0.5) * 0.015,
      lng: editingFamily?.lng || -43.85 + (Math.random() - 0.5) * 0.015,
      color: formData.vulnerability === "Alta" ? "#dc2626" : formData.vulnerability === "Média" ? "#d97706" : "#059669",
      status: editingFamily?.status || "ativo",
      lastUpdate: new Date().toISOString().split("T")[0],
    };
    const updated = editingFamily ? families.map((f) => (f.id === editingFamily.id ? newFamily : f)) : [...families, newFamily];
    setFamilies(updated);
    localStorage.setItem("solidar-familias", JSON.stringify(updated));
    resetForm();
  };

  const deleteFamily = (id) => {
    const updated = families.filter((f) => f.id !== id);
    setFamilies(updated);
    localStorage.setItem("solidar-familias", JSON.stringify(updated));
    setSelectedFamily(null);
    setOpenMenu(null);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingFamily(null);
    setFormData({ name: "", members: 1, children: 0, elderly: 0, income: "Sem renda", vulnerability: "Média", phone: "", address: "" });
  };

  const openEdit = (f) => {
    setEditingFamily(f);
    setFormData({ name: f.name, members: f.members, children: f.children, elderly: f.elderly, income: f.income, vulnerability: f.vulnerability, phone: f.phone || "", address: f.address || "" });
    setShowForm(true);
    setOpenMenu(null);
  };

  const exportCSV = () => {
    const headers = ["Nome", "Vulnerabilidade", "Membros", "Crianças", "Idosos", "Renda", "Telefone", "Endereço", "Status"];
    const rows = filteredFamilies.map((f) => [f.name, f.vulnerability, f.members, f.children, f.elderly, f.income, f.phone || "", f.address || "", f.status]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `familias-${bairro}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const updateStatus = (id, status) => {
    const updated = families.map((f) => (f.id === id ? { ...f, status, lastUpdate: new Date().toISOString().split("T")[0] } : f));
    setFamilies(updated);
    localStorage.setItem("solidar-familias", JSON.stringify(updated));
  };

  const toggleLayer = (key) => setMapLayers((p) => ({ ...p, [key]: !p[key] }));

  const getStatusIcon = (status) => {
    switch (status) {
      case "ativo": return <Circle size={8} fill="#059669" stroke="#059669" />;
      case "pendente": return <Clock size={12} className="status-icon-pending" />;
      case "atendido": return <CheckCircle size={12} className="status-icon-done" />;
      default: return null;
    }
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <div className="header-left">
          <button className="logo" onClick={() => navigate("/")}>
            <Shield size={20} />
            <span>SolidarBairro</span>
          </button>
          <div className="header-sep" />
          <span className="header-context">Painel de Gestão Social</span>
        </div>

        <div className="header-center">
          <div className="view-tabs">
            <button className={view === "lista" ? "active" : ""} onClick={() => setView("lista")}>
              <List size={16} />
              Lista
            </button>
            <button className={view === "mapa" ? "active" : ""} onClick={() => setView("mapa")}>
              <Map size={16} />
              Mapa
            </button>
          </div>
        </div>

        <div className="header-right">
          <div className="bairro-selector" ref={dropdownRef}>
            <button className="bairro-trigger" onClick={() => setBairroOpen(!bairroOpen)}>
              <MapPin size={14} />
              {bairro}
              <ChevronDown size={14} className={bairroOpen ? "flip" : ""} />
            </button>
            {bairroOpen && (
              <div className="bairro-menu">
                {BAIRROS.map((b) => (
                  <button key={b} className={b === bairro ? "selected" : ""} onClick={() => { setBairro(b); setBairroOpen(false); }}>
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="panel-body">
        <aside className="sidebar">
          <div className="sidebar-stats">
            <div className="stat-hero">
              <span className="stat-hero-value">{stats.total}</span>
              <span className="stat-hero-label">Famílias cadastradas</span>
            </div>
            <div className="stat-grid">
              <div className="stat-box">
                <span className="stat-box-value">{stats.pessoas}</span>
                <span className="stat-box-label">Pessoas</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-value">{stats.criancas}</span>
                <span className="stat-box-label">Crianças</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-value">{stats.idosos}</span>
                <span className="stat-box-label">Idosos</span>
              </div>
              <div className="stat-box alert">
                <span className="stat-box-value">{stats.altaVuln}</span>
                <span className="stat-box-label">Alta vuln.</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="section-header">Situação</div>
            <div className="status-summary">
              <div className="status-row">
                <span className="status-indicator green" />
                <span className="status-label">Ativos</span>
                <span className="status-value">{stats.total - stats.pendentes - stats.atendidos}</span>
              </div>
              <div className="status-row">
                <span className="status-indicator amber" />
                <span className="status-label">Pendentes</span>
                <span className="status-value">{stats.pendentes}</span>
              </div>
              <div className="status-row">
                <span className="status-indicator blue" />
                <span className="status-label">Atendidos</span>
                <span className="status-value">{stats.atendidos}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-actions">
            <button className="action-primary" onClick={() => setShowForm(true)}>
              <Plus size={16} />
              Nova Família
            </button>
            <button className="action-secondary" onClick={exportCSV}>
              <Download size={16} />
              Exportar
            </button>
          </div>
        </aside>

        <main className="main-content">
          <div className="toolbar">
            <div className="search-field">
              <Search size={16} />
              <input type="text" placeholder="Buscar por nome ou endereço..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              {searchQuery && <button onClick={() => setSearchQuery("")}><X size={14} /></button>}
            </div>
            <div className="filters">
              {[
                { key: "todos", label: "Todos" },
                { key: "alta", label: "Alta Vulnerabilidade" },
                { key: "criancas", label: "Com crianças" },
                { key: "idosos", label: "Com idosos" },
                { key: "pendente", label: "Pendentes" },
              ].map((f) => (
                <button key={f.key} className={`filter-btn ${activeFilter === f.key ? "active" : ""}`} onClick={() => setActiveFilter(f.key)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {view === "lista" ? (
            <div className="data-table">
              <div className="table-head">
                <div className="th-cell th-family">Família</div>
                <div className="th-cell th-vuln">Vulnerabilidade</div>
                <div className="th-cell th-comp">Composição</div>
                <div className="th-cell th-status">Status</div>
                <div className="th-cell th-actions"></div>
              </div>
              <div className="table-body">
                {filteredFamilies.length > 0 ? filteredFamilies.map((f) => (
                  <div key={f.id} className="table-row" onClick={() => setSelectedFamily(f)}>
                    <div className="td-cell td-family">
                      <div className="family-avatar" data-vuln={f.vulnerability.toLowerCase()}>{f.name.charAt(0)}</div>
                      <div className="family-info">
                        <span className="family-name">{f.name}</span>
                        <span className="family-meta">{f.address || "Endereço não informado"}</span>
                      </div>
                    </div>
                    <div className="td-cell td-vuln">
                      <div className={`vuln-indicator ${f.vulnerability.toLowerCase()}`}>
                        <span className="vuln-bar" />
                        <span className="vuln-text">{f.vulnerability}</span>
                      </div>
                    </div>
                    <div className="td-cell td-comp">
                      <div className="comp-info">
                        <div className="comp-row">
                          <Users size={14} />
                          <span>{f.members} membros</span>
                        </div>
                        <div className="comp-details">
                          {f.children > 0 && <span className="comp-tag child">{f.children} criança{f.children > 1 ? "s" : ""}</span>}
                          {f.elderly > 0 && <span className="comp-tag elderly">{f.elderly} idoso{f.elderly > 1 ? "s" : ""}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="td-cell td-status">
                      <button
                        className={`status-badge ${f.status}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const next = f.status === "ativo" ? "pendente" : f.status === "pendente" ? "atendido" : "ativo";
                          updateStatus(f.id, next);
                        }}
                      >
                        {getStatusIcon(f.status)}
                        <span>{f.status === "ativo" ? "Ativo" : f.status === "pendente" ? "Pendente" : "Atendido"}</span>
                      </button>
                    </div>
                    <div className="td-cell td-actions" ref={openMenu === f.id ? menuRef : null}>
                      <button className="menu-trigger" onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === f.id ? null : f.id); }}>
                        <MoreVertical size={16} />
                      </button>
                      {openMenu === f.id && (
                        <div className="action-menu">
                          <button onClick={(e) => { e.stopPropagation(); openEdit(f); }}>
                            <Edit3 size={14} /> Editar
                          </button>
                          <button className="danger" onClick={(e) => { e.stopPropagation(); deleteFamily(f.id); }}>
                            <Trash2 size={14} /> Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="empty">
                    <Users size={40} strokeWidth={1.5} />
                    <p>Nenhuma família encontrada</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="map-layout">
              <div className="map-container">
                <Suspense fallback={<div className="map-skeleton"><div className="map-loader" /><span>Carregando mapa...</span></div>}>
                  <MapaInterativo familias={filteredFamilies} pedidos={MOCK_DATA.pedidos} comercios={MOCK_DATA.comercios} ongs={MOCK_DATA.ongs} pontosColeta={MOCK_DATA.pontosColeta} zonasRisco={MOCK_DATA.zonasRisco} layers={mapLayers} zoom={15} />
                </Suspense>
                <div className="map-stats-overlay">
                  <div className="map-stat"><strong>{filteredFamilies.length}</strong><span>Famílias</span></div>
                  <div className="map-stat"><strong>{MOCK_DATA.pedidos.length}</strong><span>Pedidos</span></div>
                  <div className="map-stat"><strong>{MOCK_DATA.comercios.length}</strong><span>Comércios</span></div>
                </div>
              </div>
              <div className="map-controls">
                <div className="control-section">
                  <div className="control-header"><Layers size={14} /> Camadas</div>
                  <div className="layer-list">
                    {[
                      { key: "familias", label: "Famílias" },
                      { key: "pedidos", label: "Pedidos" },
                      { key: "comercios", label: "Comércios" },
                      { key: "ongs", label: "ONGs" },
                      { key: "pontosColeta", label: "Coleta" },
                      { key: "zonasRisco", label: "Riscos" },
                    ].map((l) => (
                      <button key={l.key} className={`layer-btn ${mapLayers[l.key] ? "on" : ""}`} onClick={() => toggleLayer(l.key)}>
                        {mapLayers[l.key] ? <Eye size={14} /> : <EyeOff size={14} />}
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="control-section">
                  <div className="control-header">Legenda</div>
                  <div className="legend">
                    <div className="legend-item"><span className="legend-dot red" />Alta vulnerabilidade</div>
                    <div className="legend-item"><span className="legend-dot amber" />Média vulnerabilidade</div>
                    <div className="legend-item"><span className="legend-dot green" />Baixa vulnerabilidade</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedFamily && !showForm && (
        <div className="modal-overlay" onClick={() => setSelectedFamily(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-avatar" data-vuln={selectedFamily.vulnerability.toLowerCase()}>{selectedFamily.name.charAt(0)}</div>
              <div className="modal-title">
                <h2>{selectedFamily.name}</h2>
                <span className={`vuln-tag ${selectedFamily.vulnerability.toLowerCase()}`}>{selectedFamily.vulnerability} vulnerabilidade</span>
              </div>
              <button className="modal-close" onClick={() => setSelectedFamily(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-card"><Users size={18} /><div><label>Membros</label><strong>{selectedFamily.members}</strong></div></div>
                <div className="detail-card"><Baby size={18} /><div><label>Crianças</label><strong>{selectedFamily.children}</strong></div></div>
                <div className="detail-card"><UserCheck size={18} /><div><label>Idosos</label><strong>{selectedFamily.elderly}</strong></div></div>
                <div className="detail-card"><span className="detail-icon">R$</span><div><label>Renda</label><strong>{selectedFamily.income}</strong></div></div>
              </div>
              <div className="detail-list">
                {selectedFamily.phone && <div className="detail-row"><Phone size={14} /><span>{selectedFamily.phone}</span></div>}
                {selectedFamily.address && <div className="detail-row"><HomeIcon size={14} /><span>{selectedFamily.address}</span></div>}
                <div className="detail-row"><Clock size={14} /><span>Atualizado em {selectedFamily.lastUpdate}</span></div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-danger" onClick={() => deleteFamily(selectedFamily.id)}>Excluir</button>
              <button className="btn-secondary" onClick={() => { openEdit(selectedFamily); setSelectedFamily(null); }}>Editar</button>
              <button className="btn-primary" onClick={() => setSelectedFamily(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editingFamily ? "Editar Família" : "Nova Família"}</h2>
              <button className="modal-close" onClick={resetForm}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Nome da família *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Família Silva" />
              </div>
              <div className="field-row triple">
                <div className="field">
                  <label>Membros</label>
                  <input type="number" min={1} value={formData.members} onChange={(e) => setFormData({ ...formData, members: +e.target.value || 1 })} />
                </div>
                <div className="field">
                  <label>Crianças</label>
                  <input type="number" min={0} value={formData.children} onChange={(e) => setFormData({ ...formData, children: +e.target.value || 0 })} />
                </div>
                <div className="field">
                  <label>Idosos</label>
                  <input type="number" min={0} value={formData.elderly} onChange={(e) => setFormData({ ...formData, elderly: +e.target.value || 0 })} />
                </div>
              </div>
              <div className="field-row double">
                <div className="field">
                  <label>Renda</label>
                  <select value={formData.income} onChange={(e) => setFormData({ ...formData, income: e.target.value })}>
                    <option>Sem renda</option>
                    <option>Auxílio</option>
                    <option>1/2 salário</option>
                    <option>1 salário</option>
                    <option>2+ salários</option>
                  </select>
                </div>
                <div className="field">
                  <label>Vulnerabilidade</label>
                  <select value={formData.vulnerability} onChange={(e) => setFormData({ ...formData, vulnerability: e.target.value })}>
                    <option>Baixa</option>
                    <option>Média</option>
                    <option>Alta</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Telefone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="(31) 99999-9999" />
              </div>
              <div className="field">
                <label>Endereço</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Rua, número" />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-secondary" onClick={resetForm}>Cancelar</button>
              <button className="btn-primary" onClick={saveFamily} disabled={!formData.name}>{editingFamily ? "Salvar" : "Cadastrar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}