import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import ApiService from '../../services/apiService';
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

export default function PainelSocial() {
  const navigate = useNavigate();
  const [bairro, setBairro] = useState("São Benedito");
  const [bairroOpen, setBairroOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [families, setFamilies] = useState([]);
  const [pedidosData, setPedidosData] = useState([]);
  const [comerciosData, setComerciosData] = useState([]);
  const [ongsData, setOngsData] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [view, setView] = useState("lista");
  const [isLoading, setIsLoading] = useState(true);
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
    loadFamilias();
    loadPainelData();
    // eslint-disable-next-line
  }, []);

  const loadPainelData = async () => {
    try {
      const [pedidosRes, comerciosRes, ongsRes] = await Promise.all([
        ApiService.getPainelPedidos(bairro),
        ApiService.getPainelComercios(bairro),
        ApiService.getPainelOngs(bairro)
      ]);

      if (pedidosRes.success) setPedidosData(pedidosRes.data);
      if (comerciosRes.success) setComerciosData(comerciosRes.data);
      if (ongsRes.success) setOngsData(ongsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados do painel:', error);
    }
  };

  const loadFamilias = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Carregando famílias...');
      const response = await ApiService.getFamilias();
      console.log('📦 Resposta da API:', response);
      
      if (response.success) {
        const formatted = response.data.map(f => {
          const endereco = f.endereco || {};
          const address = endereco.endereco 
            ? `${endereco.endereco}, ${endereco.bairro || ''}` 
            : (endereco.logradouro 
                ? `${endereco.logradouro}${endereco.numero ? ', ' + endereco.numero : ''}` 
                : f.address || 'Endereço não informado');
          
          return {
            id: f.id,
            name: f.nomeCompleto || f.name || 'Sem nome',
            vulnerability: f.vulnerability || 'Média',
            urgency: f.urgency || f.vulnerability || 'Média',
            members: f.composicao?.totalMembros || f.members || 1,
            children: f.composicao?.criancas || f.children || 0,
            elderly: f.composicao?.idosos || f.elderly || 0,
            income: f.rendaFamiliar || f.income || 'Sem renda',
            bairro: endereco.bairro || f.bairro || bairro,
            lat: endereco.latitude || f.lat || -19.768 + (Math.random() - 0.5) * 0.01,
            lng: endereco.longitude || f.lng || -43.85 + (Math.random() - 0.5) * 0.01,
            color: (f.vulnerability === 'Alta' || f.urgency === 'Alta') ? '#dc2626' : 
                   (f.vulnerability === 'Média' || f.urgency === 'Média') ? '#d97706' : '#059669',
            phone: f.telefone || f.phone || '',
            address,
            status: f.status === 'pending' ? 'pendente' : f.status || 'ativo',
            lastUpdate: f.atualizadoEm 
              ? (f.atualizadoEm.seconds 
                  ? new Date(f.atualizadoEm.seconds * 1000).toISOString().split('T')[0]
                  : (typeof f.atualizadoEm === 'string' ? f.atualizadoEm.split('T')[0] : new Date().toISOString().split('T')[0]))
              : new Date().toISOString().split('T')[0]
          };
        });
        setFamilies(formatted);
        console.log(`✅ ${formatted.length} famílias carregadas do banco`);
        console.log('📍 Famílias:', formatted.map(f => ({ id: f.id, name: f.name, bairro: f.bairro })));
      }
    } catch (error) {
      console.error('❌ Erro ao carregar famílias:', error);
      toast.error('Erro ao carregar famílias do banco');
    } finally {
      setIsLoading(false);
    }
  };

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
    let result = families;
    if (searchQuery) {
      result = result.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.address?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (activeFilter === "alta") result = result.filter((f) => f.vulnerability === "Alta");
    if (activeFilter === "criancas") result = result.filter((f) => f.children > 0);
    if (activeFilter === "idosos") result = result.filter((f) => f.elderly > 0);
    if (activeFilter === "pendente") result = result.filter((f) => f.status === "pendente");
    return result;
  }, [families, searchQuery, activeFilter]);

  const stats = useMemo(() => {
    return {
      total: families.length,
      pessoas: families.reduce((a, f) => a + f.members, 0),
      criancas: families.reduce((a, f) => a + f.children, 0),
      idosos: families.reduce((a, f) => a + f.elderly, 0),
      altaVuln: families.filter((f) => f.vulnerability === "Alta").length,
      pendentes: families.filter((f) => f.status === "pendente").length,
      atendidos: families.filter((f) => f.status === "atendido").length,
    };
  }, [families]);

  const saveFamily = async () => {
    if (!formData.name) {
      toast.error('Nome da família é obrigatório');
      return;
    }

    try {
      const familyData = {
        nomeCompleto: formData.name,
        vulnerability: formData.vulnerability,
        composicao: {
          totalMembros: formData.members,
          criancas: formData.children,
          idosos: formData.elderly
        },
        rendaFamiliar: formData.income,
        telefone: formData.phone,
        endereco: {
          logradouro: formData.address,
          bairro: bairro,
          latitude: editingFamily?.lat || -19.768 + (Math.random() - 0.5) * 0.015,
          longitude: editingFamily?.lng || -43.85 + (Math.random() - 0.5) * 0.015
        },
        status: editingFamily?.status || 'ativo'
      };

      if (editingFamily) {
        const response = await ApiService.updateFamiliaPanel(editingFamily.id, familyData);
        if (response.success) {
          toast.success('Família atualizada com sucesso!');
          await loadFamilias();
        }
      } else {
        const response = await ApiService.createFamiliaPanel(familyData);
        if (response.success) {
          toast.success('Família cadastrada com sucesso!');
          await loadFamilias();
        }
      }
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar família:', error);
      toast.error(error.message || 'Erro ao salvar família');
    }
  };

  const deleteFamily = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta família?')) return;
    
    try {
      const response = await ApiService.deleteFamiliaPanel(id);
      if (response.success) {
        toast.success('Família excluída com sucesso!');
        await loadFamilias();
        setSelectedFamily(null);
        setOpenMenu(null);
      }
    } catch (error) {
      console.error('Erro ao excluir família:', error);
      toast.error('Erro ao excluir família');
    }
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

  const updateStatus = async (id, status) => {
    try {
      const response = await ApiService.updateFamiliaPanel(id, { status });
      if (response.success) {
        await loadFamilias();
        toast.success('Status atualizado!');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
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

  // Loading Component
  const LoadingScreen = () => (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <h3>Carregando Painel Social</h3>
        <p>Buscando famílias cadastradas...</p>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

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
                  <MapaInterativo 
                    familias={filteredFamilies} 
                    pedidos={pedidosData} 
                    comercios={comerciosData} 
                    ongs={ongsData} 
                    pontosColeta={[]} 
                    zonasRisco={[]} 
                    layers={mapLayers}
                    onFamiliaClick={setSelectedFamily}
                    zoom={15} 
                  />
                </Suspense>
                <div className="map-stats-overlay">
                  <div className="map-stat"><strong>{filteredFamilies.length}</strong><span>Famílias</span></div>
                  <div className="map-stat"><strong>{pedidosData.length}</strong><span>Pedidos</span></div>
                  <div className="map-stat"><strong>{comerciosData.length}</strong><span>Comércios</span></div>
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