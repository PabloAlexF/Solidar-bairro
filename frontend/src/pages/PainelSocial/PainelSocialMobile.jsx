import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../../services/apiService';
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  User,
  LogOut,
  ChevronDown,
  Settings,
  Search,
  X,
  MapPin,
  Users,
  Plus,
  Download,
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
  BarChart3,
  Filter,
  RefreshCw,
  Package,
} from "lucide-react";
import "./PainelSocialMobile.css";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import Toast from '../../components/ui/Toast';
import { SkeletonListItem } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import MapSkeleton from '../../components/ui/MapSkeleton';

const MapaInterativo = lazy(() => import("./MapaInterativo"));

export default function PainelSocialMobile() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [families, setFamilies] = useState([]);
  const [pedidosData, setPedidosData] = useState([]);
  const [comerciosData, setComerciosData] = useState([]);
  const [ongsData, setOngsData] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [view, setView] = useState("lista"); // 'lista', 'mapa', 'stats'
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
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    
    const menuRef = useRef(null);
    const userDropdownRef = useRef(null);
    const notificationsRef = useRef(null);
    const filterRef = useRef(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [pullStartY, setPullStartY] = useState(0);
    const [pullMoveY, setPullMoveY] = useState(0);
    const [isPulling, setIsPulling] = useState(false);
    
    useEffect(() => {
      loadFamilias();
      loadPainelData();
    }, []);
    
    const loadPainelData = async () => {


    try {
      const [pedidosRes, comerciosRes, ongsRes] = await Promise.all([
        ApiService.getPedidos(),
        ApiService.getComercios(),
        ApiService.getOngs()
      ]);

      if (pedidosRes?.success) {
        setPedidosData(pedidosRes.data.map((p) => ({
          ...p,
          lat: p.endereco?.latitude || p.lat || -19.768 + (Math.random() - 0.5) * 0.01,
          lng: p.endereco?.longitude || p.lng || -43.85 + (Math.random() - 0.5) * 0.01,
          tipo: 'pedido',
          createdAt: p.criadoEm || p.createdAt || new Date().toISOString(),
          titulo: p.titulo || p.title || p.nome || 'Pedido de Ajuda',
          categoria: p.categoria || p.category || p.tipo || 'Geral',
          descricao: p.descricao || p.description || p.detalhes || '',
          status: p.status || 'ativo'
        })));
      }
      
      if (comerciosRes?.success) {
        setComerciosData(comerciosRes.data.map((c) => ({
          ...c,
          lat: c.endereco?.latitude || c.lat || -19.768 + (Math.random() - 0.5) * 0.01,
          lng: c.endereco?.longitude || c.lng || -43.85 + (Math.random() - 0.5) * 0.01,
          nome: c.nomeEstabelecimento || c.nome_fantasia || c.nome
        })));
      }
      
      if (ongsRes?.success) {
        setOngsData(ongsRes.data.map((o) => ({
          ...o,
          lat: o.endereco?.latitude || o.lat || -19.768 + (Math.random() - 0.5) * 0.01,
          lng: o.endereco?.longitude || o.lng || -43.85 + (Math.random() - 0.5) * 0.01,
          nome: o.razaoSocial || o.nome_fantasia || o.nome,
          servicos: o.causas || []
        })));
      }
    } catch (error) {
      console.error('Error loading panel data:', error);
    }
  };

  const loadFamilias = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getFamilias();
      if (response?.success) {
        const formatted = response.data.map((f) => ({
          id: f.id,
          name: f.nomeCompleto || f.name || 'Sem nome',
          vulnerability: f.vulnerability || 'Média',
          members: f.composicao?.totalMembros || f.members || 1,
          children: f.composicao?.criancas || f.children || 0,
          elderly: f.composicao?.idosos || f.elderly || 0,
          income: f.rendaFamiliar || f.income || 'Sem renda',
          lat: f.endereco?.latitude || f.lat || -19.768 + (Math.random() - 0.5) * 0.01,
          lng: f.endereco?.longitude || f.lng || -43.85 + (Math.random() - 0.5) * 0.01,
          phone: f.telefone || f.phone || '',
          address: f.endereco?.logradouro || f.address || 'Endereço não informado',
          status: f.status === 'pending' ? 'pendente' : f.status || 'ativo',
          registeredAt: new Date().toLocaleDateString('pt-BR'),
          lastUpdate: new Date().toISOString().split('T')[0],
          createdAt: f.criadoEm || f.createdAt || new Date().toISOString()
        }));
        setFamilies(formatted);
      }
    } catch (error) {
      setToast({ show: true, message: 'Erro ao carregar famílias', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
      const handleClick = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          setOpenMenu(null);
        }
        if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
          setShowUserDropdown(false);
        }
        if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
          setShowNotifications(false);
        }
        if (filterRef.current && !filterRef.current.contains(e.target)) {
          setShowFilters(false);
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, []);


  const filteredFamilies = useMemo(() => {
    let result = families;
    if (searchQuery) {
      result = result.filter((f) => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeFilter === "alta") result = result.filter((f) => f.vulnerability.toLowerCase() === "alta");
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
      altaVuln: families.filter((f) => f.vulnerability.toLowerCase() === "alta").length,
      pendentes: families.filter((f) => f.status === "pendente").length,
      atendidos: families.filter((f) => f.status === "atendido").length,
    };
  }, [families]);

  const saveFamily = async () => {
    if (!formData.name) return setToast({ show: true, message: 'Nome é obrigatório', type: 'error' });
    try {
      const familyData = {
        nomeCompleto: formData.name,
        vulnerability: formData.vulnerability,
        composicao: { totalMembros: formData.members, criancas: formData.children, idosos: formData.elderly },
        rendaFamiliar: formData.income,
        telefone: formData.phone,
        endereco: {
          logradouro: formData.address,
          latitude: editingFamily?.lat || -19.768 + (Math.random() - 0.5) * 0.015,
          longitude: editingFamily?.lng || -43.85 + (Math.random() - 0.5) * 0.015
        },
        status: editingFamily?.status || 'ativo'
      };
      const res = editingFamily ? await ApiService.updateFamiliaPanel(editingFamily.id, familyData) : await ApiService.createFamiliaPanel(familyData);
      if (res.success) {
        setToast({ show: true, message: editingFamily ? 'Atualizado!' : 'Cadastrado!', type: 'success' });
        await loadFamilias();
        resetForm();
      }
    } catch (error) {
      setToast({ show: true, message: 'Erro ao salvar', type: 'error' });
    }
  };

  const deleteFamily = async (id) => {
    if (!window.confirm('Excluir esta família?')) return;
    try {
      const res = await ApiService.deleteFamiliaPanel(id);
      if (res.success) {
        setToast({ show: true, message: 'Excluído', type: 'success' });
        await loadFamilias();
        setSelectedFamily(null);
      }
    } catch (error) {
      setToast({ show: true, message: 'Erro ao excluir', type: 'error' });
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

  const updateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'ativo' ? 'pendente' : currentStatus === 'pendente' ? 'atendido' : 'ativo';
    try {
      const res = await ApiService.updateFamiliaPanel(id, { status: nextStatus });
      if (res.success) {
        await loadFamilias();
        setToast({ show: true, message: `Status: ${nextStatus}`, type: 'success' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Erro ao atualizar', type: 'error' });
    }
  };

  // Pull to Refresh Handlers
  const handleTouchStart = (e) => {
    if (window.scrollY === 0 && view === 'lista') {
      setPullStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - pullStartY;
    
    if (diff > 0 && window.scrollY === 0) {
      setPullMoveY(Math.min(diff * 0.4, 100));
    } else {
      setPullMoveY(0);
      setIsPulling(false);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    setIsPulling(false);
    
    if (pullMoveY > 50) {
      setPullMoveY(0);
      await Promise.all([loadFamilias(), loadPainelData()]);
    } else {
      setPullMoveY(0);
    }
  };

  const distributionData = [
    { name: 'Famílias', value: stats.total, color: '#f97316' },
    { name: 'Pedidos', value: pedidosData.length, color: '#ef4444' },
    { name: 'Comércios', value: comerciosData.length, color: '#3b82f6' },
    { name: 'ONGs', value: ongsData.length, color: '#8b5cf6' },
  ];

  return (
    <div className="panel panel-mobile" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <header className="panel-header">
        <div className="header-left">
          <button className="logo-mobile" onClick={() => navigate("/")}>
            <Shield size={24} strokeWidth={2.5} />
            <span>SolidarBairro</span>
          </button>
        </div>
        
        <div className="header-right">
          {/* NOTIFICAÇÕES */}
          <div className="dropdown-container" ref={notificationsRef}>
            <button 
              className="icon-button" 
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              <span className="notification-badge" />
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="dropdown-menu"
                  style={{ width: '280px' }}
                >
                    <div className="dropdown-item" style={{ padding: '24px', textAlign: 'center' }}>
                      <div className="empty-notifications">
                        <Bell size={32} style={{ margin: '0 auto 12px', opacity: 0.2, color: 'var(--text-muted)' }} />
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Tudo limpo por aqui!</p>
                        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Nenhuma notificação nova no momento.</p>
                      </div>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* USER DROPDOWN */}
          <div className="dropdown-container" ref={userDropdownRef}>
            <button 
              className="user-profile-trigger" 
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <div className="user-avatar">AD</div>
              <ChevronDown size={16} className="text-muted" />
            </button>

            <AnimatePresence>
              {showUserDropdown && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="dropdown-menu"
                >
                  <button className="dropdown-item" onClick={() => { setShowUserDropdown(false); setToast({ show: true, message: "Abrindo perfil...", type: 'info' }); }}>
                    <User size={18} /> Perfil
                  </button>
                  <button className="dropdown-item" onClick={() => { setShowUserDropdown(false); navigate("/meus-pedidos"); }}>
                    <Package size={18} /> Meus Pedidos
                  </button>
                  <button className="dropdown-item" onClick={() => { setShowUserDropdown(false); setView("lista"); }}>
                    <HomeIcon size={18} /> Home
                  </button>
                  <button className="dropdown-item" onClick={() => { setShowUserDropdown(false); setToast({ show: true, message: "Abrindo configurações...", type: 'info' }); }}>
                    <Settings size={18} /> Configurações
                  </button>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={() => { setShowUserDropdown(false); navigate("/"); }}>
                    <LogOut size={18} /> Sair
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div 
        className="adm-pull-indicator"
        style={{ 
          height: `${pullMoveY}px`,
          opacity: pullMoveY > 0 ? Math.min(pullMoveY / 40, 1) : 0
        }}
      >
        <RefreshCw className={`adm-pull-icon ${pullMoveY > 50 ? 'active' : ''}`} size={24} />
      </div>

      <div className="panel-body">
        <aside className="sidebar">
          <div className="sidebar-stats">
            <div className="stat-hero">
              <span className="stat-hero-value">{stats.total}</span>
              <span className="stat-hero-label">Famílias Cadastradas</span>
            </div>
            <div className="stat-grid">
              <div className="stat-box"><span className="stat-box-value">{stats.pessoas}</span><span className="stat-box-label">Pessoas</span></div>
              <div className="stat-box"><span className="stat-box-value">{stats.criancas}</span><span className="stat-box-label">Crianças</span></div>
              <div className="stat-box"><span className="stat-box-value">{stats.idosos}</span><span className="stat-box-label">Idosos</span></div>
              <div className="stat-box alert"><span className="stat-box-value">{stats.altaVuln}</span><span className="stat-box-label">Crítico</span></div>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="section-header">Resumo de Status</div>
            <div className="status-summary">
              <div className="status-row"><span className="status-indicator green" /><span className="status-label">Em dia</span><span className="status-value">{stats.total - stats.pendentes - stats.atendidos}</span></div>
              <div className="status-row"><span className="status-indicator amber" /><span className="status-label">Pendentes</span><span className="status-value">{stats.pendentes}</span></div>
              <div className="status-row"><span className="status-indicator blue" /><span className="status-label">Atendidos</span><span className="status-value">{stats.atendidos}</span></div>
            </div>
          </div>
          <div className="sidebar-actions">
            <button className="action-primary" onClick={() => setShowForm(true)}><Plus size={18} /> Nova Família</button>
            <button className="action-secondary" onClick={() => {}}><Download size={18} /> Exportar Relatório</button>
          </div>
        </aside>

        <main className="main-content">
          <AnimatePresence mode="wait">
            {view === "stats" ? (
              <motion.div 
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mobile-stats-view"
              >
                <div className="stat-hero">
                  <span className="stat-hero-value">{stats.total}</span>
                  <span className="stat-hero-label">Famílias Cadastradas</span>
                </div>
                <div className="stat-grid">
                  <div className="stat-box"><span className="stat-box-value">{stats.pessoas}</span><span className="stat-box-label">Pessoas</span></div>
                  <div className="stat-box"><span className="stat-box-value">{stats.criancas}</span><span className="stat-box-label">Crianças</span></div>
                  <div className="stat-box"><span className="stat-box-value">{stats.idosos}</span><span className="stat-box-label">Idosos</span></div>
                  <div className="stat-box alert"><span className="stat-box-value">{stats.altaVuln}</span><span className="stat-box-label">Crítico</span></div>
                </div>

                <div style={{ 
                  background: 'white', 
                  borderRadius: 'var(--adm-radius-lg)', 
                  padding: '1.5rem', 
                  marginTop: '1.5rem', 
                  boxShadow: 'var(--adm-shadow-md)',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}>
                  <div className="section-header" style={{ marginBottom: '1rem' }}>Distribuição da Rede</div>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="sidebar-section" style={{ marginTop: '32px' }}>
                  <div className="section-header">Atendimento</div>
                  <div className="status-summary">
                    <div className="status-row"><span className="status-indicator green" /><span className="status-label">Ativos</span><span className="status-value">{stats.total - stats.pendentes - stats.atendidos}</span></div>
                    <div className="status-row"><span className="status-indicator amber" /><span className="status-label">Pendentes</span><span className="status-value">{stats.pendentes}</span></div>
                    <div className="status-row"><span className="status-indicator blue" /><span className="status-label">Atendidos</span><span className="status-value">{stats.atendidos}</span></div>
                  </div>
                </div>
              </motion.div>
            ) : (
                <motion.div
                  key={view}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="search-bar-top">
                    <div className="search-field-large">
                      <Search size={22} className="text-muted" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nome, endereço ou vulnerabilidade..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="clear-search">
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="content-actions">
                    <div className="filter-dropdown-wrapper" ref={filterRef}>
                      <button 
                        className={`filter-trigger-btn ${activeFilter !== 'todos' ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <Filter size={18} />
                        <span>{activeFilter === 'todos' ? 'Todas as Categorias' : `Filtro: ${activeFilter}`}</span>
                        <ChevronDown size={16} className={`chevron ${showFilters ? 'open' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {showFilters && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="filter-menu-dropdown"
                          >
                            <div className="filter-menu-header">Filtrar por Categoria</div>
                            <div className="filter-options">
                              {[
                                { id: "todos", label: "Todos os Registros", icon: <Circle size={14} /> },
                                { id: "alta", label: "Vulnerabilidade Alta", icon: <AlertTriangle size={14} /> },
                                { id: "criancas", label: "Com Crianças", icon: <Baby size={14} /> },
                                { id: "idosos", label: "Com Idosos", icon: <UserCheck size={14} /> },
                                { id: "pendente", label: "Status Pendente", icon: <Clock size={14} /> }
                              ].map((f) => (
                                <button 
                                  key={f.id} 
                                  className={`filter-option-item ${activeFilter === f.id ? "active" : ""}`} 
                                  onClick={() => {
                                    setActiveFilter(f.id);
                                    setShowFilters(false);
                                  }}
                                >
                                  <span className="option-icon">{f.icon}</span>
                                  <span className="option-label">{f.label}</span>
                                  {activeFilter === f.id && <CheckCircle size={14} className="check-icon" />}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>


                  </div>


                {view === "lista" ? (
                  <div className="data-table">
                    <div className="table-head">
                      <div className="th-cell">Família</div>
                      <div className="th-cell">Vulnerabilidade</div>
                      <div className="th-cell">Composição</div>
                      <div className="th-cell">Cadastro</div>
                      <div className="th-cell">Status</div>
                      <div className="th-cell"></div>
                    </div>
                    <div className="table-body">
                      {isLoading ? (
                        <div className="adm-items-list">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <SkeletonListItem key={i} />
                          ))}
                        </div>
                      ) : filteredFamilies.length > 0 ? filteredFamilies.map((f) => (
                        <motion.div 
                          layout
                          key={f.id} 
                          className="table-row" 
                          onClick={() => setSelectedFamily(f)}
                        >
                          <div className="td-family">
                            <Avatar 
                              alt={f.name} 
                              className="family-avatar" 
                              fallback={<User size={20} />}
                            />
                            <div className="family-info">
                              <span className="family-name">{f.name}</span>
                              <span className="family-meta">{f.address}</span>
                            </div>
                          </div>
                          <div className="td-vuln">
                            <div className={`vuln-indicator ${f.vulnerability.toLowerCase()}`}>
                              <span className="vuln-bar" />
                              <span className="vuln-text">{f.vulnerability}</span>
                            </div>
                          </div>
                          <div className="td-comp">
                            <div className="comp-info">
                              <div className="comp-row"><Users size={14} className="text-muted" /> <span>{f.members}</span></div>
                              <div className="comp-details">
                                {f.children > 0 && <span className="comp-tag child">{f.children}C</span>}
                                {f.elderly > 0 && <span className="comp-tag elderly">{f.elderly}I</span>}
                              </div>
                            </div>
                          </div>
                          <div className="td-date">
                            <span className="family-meta">{f.registeredAt}</span>
                          </div>
                          <div className="td-status">
                            <div onClick={(e) => { e.stopPropagation(); updateStatus(f.id, f.status); }}>
                              <Badge variant={f.status}>{f.status === 'ativo' ? 'Ativo' : f.status === 'pendente' ? 'Pendente' : 'Atendido'}</Badge>
                            </div>
                          </div>
                          <div className="td-actions" ref={openMenu === f.id ? menuRef : null}>
                            <button className="menu-trigger" onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === f.id ? null : f.id); }}><MoreVertical size={18} /></button>
                            {openMenu === f.id && (
                              <div className="action-menu">
                                <button onClick={(e) => { e.stopPropagation(); openEdit(f); }}><Edit3 size={14} /> Editar</button>
                                <button className="danger" onClick={(e) => { e.stopPropagation(); deleteFamily(f.id); }}><Trash2 size={14} /> Excluir</button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )) : (
                        <EmptyState 
                          title="Nenhuma família encontrada" 
                          description="Tente ajustar sua busca ou filtros para encontrar o que procura." 
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="map-layout">
                    <div className="map-container">
                      <Suspense fallback={<MapSkeleton />}>
                        <MapaInterativo 
                          familias={filteredFamilies} 
                          pedidos={pedidosData}
                          comercios={comerciosData}
                          ongs={ongsData}
                          onFamiliaClick={setSelectedFamily} 
                          layers={mapLayers} 
                        />
                      </Suspense>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <nav className="mobile-bottom-nav">
        <button className={`nav-item ${view === 'lista' ? 'active' : ''}`} onClick={() => setView('lista')}>
          <List /> <span>Lista</span>
        </button>
        <button className={`nav-item ${view === 'mapa' ? 'active' : ''}`} onClick={() => setView('mapa')}>
          <Map /> <span>Mapa</span>
        </button>
        <button className={`nav-item ${view === 'stats' ? 'active' : ''}`} onClick={() => setView('stats')}>
          <BarChart3 /> <span>Painel</span>
        </button>
      </nav>

      <div className="mobile-actions-bar">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="fab" 
          onClick={() => setShowForm(true)}
        >
          <Plus size={32} strokeWidth={2.5} />
        </motion.button>
      </div>

      <AnimatePresence>
        {selectedFamily && !showForm && (
          <div className="modal-overlay" onClick={() => setSelectedFamily(null)}>
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="modal" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-head">
                <Avatar 
                  alt={selectedFamily.name} 
                  size="lg"
                  fallback={<User size={24} />}
                />
                <div className="modal-title">
                  <h2>{selectedFamily.name}</h2>
                  <span className={`vuln-tag ${selectedFamily.vulnerability.toLowerCase()}`}>{selectedFamily.vulnerability} Vulnerabilidade</span>
                </div>
                <button className="modal-close" onClick={() => setSelectedFamily(null)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="detail-grid">
                  <div className="detail-card"><Users /> <div><label>Membros</label><strong>{selectedFamily.members}</strong></div></div>
                  <div className="detail-card"><Baby /> <div><label>Crianças</label><strong>{selectedFamily.children}</strong></div></div>
                  <div className="detail-card"><UserCheck /> <div><label>Idosos</label><strong>{selectedFamily.elderly}</strong></div></div>
                  <div className="detail-card"><span className="detail-icon" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>R$</span><div><label>Renda</label><strong>{selectedFamily.income}</strong></div></div>
                </div>
                <div className="detail-list">
                  <div className="detail-row"><Phone size={18} className="text-muted" /> <span>{selectedFamily.phone || 'Telefone não informado'}</span></div>
                  <div className="detail-row"><HomeIcon size={18} className="text-muted" /> <span>{selectedFamily.address}</span></div>
                  <div className="detail-row"><Clock size={18} className="text-muted" /> <span>Cadastrado em {selectedFamily.registeredAt}</span></div>
                </div>
              </div>
              <div className="modal-foot">
                <button className="btn-secondary" onClick={() => openEdit(selectedFamily)}>Editar Registro</button>
                <button className="btn-primary" onClick={() => setSelectedFamily(null)}>Fechar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <div className="modal-overlay" onClick={resetForm}>
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="modal modal-form" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-head">
                <h2>{editingFamily ? "Editar Família" : "Cadastrar Família"}</h2>
                <button className="modal-close" onClick={resetForm}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="field">
                  <label>Nome da Família / Responsável</label>
                  <input type="text" placeholder="Ex: Maria Silva" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="field-row triple">
                  <div className="field"><label>Membros</label><input type="number" min={1} value={formData.members} onChange={(e) => setFormData({ ...formData, members: +e.target.value })} /></div>
                  <div className="field"><label>Crianças</label><input type="number" min={0} value={formData.children} onChange={(e) => setFormData({ ...formData, children: +e.target.value })} /></div>
                  <div className="field"><label>Idosos</label><input type="number" min={0} value={formData.elderly} onChange={(e) => setFormData({ ...formData, elderly: +e.target.value })} /></div>
                </div>
                <div className="field-row double">
                  <div className="field">
                    <label>Renda Mensal</label>
                    <select value={formData.income} onChange={(e) => setFormData({ ...formData, income: e.target.value })}>
                      <option>Sem renda</option>
                      <option>Auxílio / Bolsa</option>
                      <option>1 salário mínimo</option>
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
                  <label>Telefone de Contato</label>
                  <input type="tel" placeholder="(00) 00000-0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="field">
                  <label>Endereço Completo</label>
                  <input type="text" placeholder="Rua, número, bairro" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
              <div className="modal-foot">
                <button className="btn-secondary" onClick={resetForm}>Cancelar</button>
                <button className="btn-primary" onClick={saveFamily}>Salvar Registro</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}
