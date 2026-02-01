import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, 
  ShieldCheck, LogOut, Search,
  Eye, CheckCircle, XCircle,
  Bell, Clock, ArrowRight,
  Heart, Store, UserCircle,
  Zap, Target, Sparkles,
  Home, Users2, Menu, X, RefreshCw, Filter, Calendar
} from 'lucide-react';
import './DashboardMobile.css';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import Toast from '../../components/ui/Toast';
import { SkeletonListItem } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import MobileModal from '../../components/ui/modals/MobileModal';
import BottomSheet from '../../components/ui/BottomSheet';
import PullToRefresh from '../../components/ui/PullToRefresh';

// Real API Service
const API_BASE_URL = 'http://localhost:3001/api';

const apiService = {
  async request(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const config = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) })
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const result = await response.json();
      // Ensure data format compatibility
      return result.data ? result : { data: Array.isArray(result) ? result : [] };
    } catch (error) {
      console.error(`Error requesting ${endpoint}:`, error);
      throw error;
    }
  }
};

const formatAddress = (address) => {
  if (!address) return "Não informado";
  if (typeof address === 'string') return address;
  if (typeof address === 'object') {
    const parts = [];
    if (address.logradouro) parts.push(address.logradouro);
    if (address.numero) parts.push(address.numero);
    if (address.bairro) parts.push(address.bairro);
    if (address.cidade) parts.push(address.cidade);
    if (address.uf) parts.push(address.uf);
    return parts.join(', ') || "Endereço registrado";
  }
  return "N/A";
};

const getStatusLabel = (status) => {
  const statusMap = {
    'pending': 'Aguardando',
    'analyzed': 'Analisado',
    'active': 'Ativo',
    'ativo': 'Ativo',
    'approved': 'Aprovado',
    'rejected': 'Rejeitado',
    'inactive': 'Inativo'
  };
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const statusClasses = {
    'pending': 'status-warning',
    'analyzed': 'status-success',
    'active': 'status-success',
    'ativo': 'status-success',
    'approved': 'status-success',
    'rejected': 'status-error',
    'inactive': 'status-error',
    'inativo': 'status-error'
  };
  const result = statusClasses[status] || 'status-default';
  console.log(`Status: ${status} → Class: ${result}`);
  return result;
};

export default function DashboardMobile() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ongs, setOngs] = useState([]);
  const [commerces, setCommerces] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOng, setSelectedOng] = useState(null);
  const [selectedCommerce, setSelectedCommerce] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    pendingOngs: 0,
    pendingCommerces: 0,
    pendingFamilies: 0,
    pendingCitizens: 0,
    totalOngs: 0,
    totalCommerces: 0,
    totalFamilies: 0,
    totalCitizens: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [evaluationChecklist, setEvaluationChecklist] = useState({
    check1: false,
    check2: false,
    check3: false,
    check4: false,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [successAction, setSuccessAction] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all',
    bairro: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Generate notifications dynamically based on real data
  useEffect(() => {
    const generate = () => {
      const list = [];
      const add = (item, type, title, msg) => {
        list.push({
          id: `${type}-${item.id}`,
          title,
          message: msg,
          time: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : 'Recente',
          type,
          isRead: false
        });
      };

      ongs.filter(i => i.status === 'pending').forEach(i => add(i, 'ong', 'Nova ONG', `${i.nome_fantasia} aguarda análise.`));
      commerces.filter(i => i.status === 'pending').forEach(i => add(i, 'commerce', 'Parceria', `${i.nome_fantasia} solicitou adesão.`));
      profiles.filter(i => i.status === 'pending').forEach(i => add(i, 'family', 'Família', `${i.nomeCompleto || i.full_name} enviou dados.`));
      citizens.filter(i => i.status === 'pending').forEach(i => add(i, 'citizen', 'Cidadão', `${i.nomeCompleto || i.full_name} quer colaborar.`));
      
      // Only update if we have items to avoid clearing user interactions unnecessarily in a real app, 
      // but for this dashboard sync, we want to reflect current state.
      setNotifications(list);
    };
    generate();
  }, [ongs, commerces, profiles, citizens]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        await Promise.all([fetchOngs(), fetchCommerces(), fetchProfiles(), fetchCitizens()]);
      } else if (activeTab === 'ongs') {
        await fetchOngs();
      } else if (activeTab === 'commerces') {
        await fetchCommerces();
      } else if (activeTab === 'families') {
        await fetchProfiles();
      } else {
        await fetchCitizens();
      }
    } catch (error) {
      // Errors are handled individually in fetch functions to allow partial loading, but we catch here just in case
    }
    setLoading(false);
  };

  const fetchOngs = async () => {
    try {
      const response = await apiService.request('/ongs');
      const data = response.data || [];
      setOngs(data);
      const pending = data.filter((o) => o.status === 'pending').length;
      setStats((prev) => ({ ...prev, pendingOngs: pending, totalOngs: data.length }));
    } catch (error) {
      console.error('Error fetching ONGs:', error);
      setOngs([]);
      setToast({ show: true, message: 'Não foi possível carregar as ONGs. Verifique a conexão.', type: 'error' });
    }
  };

  const fetchCommerces = async () => {
    try {
      const response = await apiService.request('/comercios');
      const data = response.data || [];
      setCommerces(data);
      const pending = data.filter((c) => c.status === 'pending').length;
      setStats((prev) => ({ ...prev, pendingCommerces: pending, totalCommerces: data.length }));
    } catch (error) {
      console.error('Error fetching commerces:', error);
      setCommerces([]);
      setToast({ show: true, message: 'Não foi possível carregar os comércios.', type: 'error' });
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await apiService.request('/familias');
      const data = response.data || [];
      setProfiles(data);
      const pendingFamilies = data.filter((p) => p.status === 'pending').length;
      setStats((prev) => ({
        ...prev,
        totalFamilies: data.length,
        pendingFamilies,
      }));
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setProfiles([]);
      setToast({ show: true, message: 'Erro ao carregar famílias.', type: 'error' });
    }
  };

  const fetchCitizens = async () => {
    try {
      const response = await apiService.request('/cidadaos');
      const data = response.data || [];
      setCitizens(data);
      const pendingCitizens = data.filter((c) => c.status === 'pending').length;
      setStats((prev) => ({
        ...prev,
        totalCitizens: data.length,
        pendingCitizens,
      }));
    } catch (error) {
      console.error('Error fetching citizens:', error);
      setCitizens([]);
      setToast({ show: true, message: 'Erro ao carregar cidadãos.', type: 'error' });
    }
  };

  const handleUpdateStatus = async (id, status, type, name) => {
    try {
      // Determine endpoint based on type
      let endpoint = '';
      if (type === 'ongs') endpoint = '/ongs';
      else if (type === 'commerces') endpoint = '/comercios';
      else if (type === 'citizens') endpoint = '/cidadaos';
      else endpoint = '/familias';

      await apiService.request(`${endpoint}/${id}`, 'PUT', { status });
      
      if (type === 'ongs') fetchOngs();
      else if (type === 'commerces') fetchCommerces();
      else if (type === 'citizens') fetchCitizens();
      else fetchProfiles();

      setSelectedOng(null);
      setSelectedCommerce(null);
      setSelectedProfile(null);
      setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false });

      if (status === 'analyzed') {
        setSuccessAction({
          title: 'Análise Concluída!',
          message: `${name || 'O registro'} foi marcado como analisado com sucesso.`
        });
      }

    } catch (error) {
      console.error('Error updating status:', error);
      setToast({ show: true, message: 'Erro ao atualizar status. Tente novamente.', type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const filterItems = (items) => {
    return items.filter(item => {
      // Search Term
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (item.nome_fantasia || item.nomeCompleto || item.full_name || '').toLowerCase().includes(searchLower) ||
        (item.cnpj || item.cpf || '').includes(searchTerm) ||
        (item.email || '').toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Status Filter
      if (filters.status !== 'all') {
        if (filters.status === 'pending' && item.status !== 'pending') return false;
        if (filters.status === 'analyzed' && item.status === 'pending') return false;
      }

      // Date Filter
      if (filters.date !== 'all') {
        const itemDate = new Date(item.created_at);
        const now = new Date();
        const diffTime = Math.abs(now - itemDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (filters.date === '7days' && diffDays > 7) return false;
        if (filters.date === '30days' && diffDays > 30) return false;
      }

      // Bairro Filter
      if (filters.bairro) {
        const addressStr = formatAddress(item.sede || item.endereco).toLowerCase();
        if (!addressStr.includes(filters.bairro.toLowerCase())) return false;
      }

      return true;
    });
  };

  const filteredOngs = filterItems(ongs);
  const filteredCommerces = filterItems(commerces);
  const filteredCitizens = filterItems(citizens);
  const filteredFamilies = filterItems(profiles);

  const pendingOngs = ongs.filter((o) => o.status === 'pending');
  const pendingCommerces = commerces.filter((c) => c.status === 'pending');

  const totalPending = stats.pendingOngs + stats.pendingCommerces + stats.pendingFamilies + stats.pendingCitizens;
  const totalItems = stats.totalOngs + stats.totalCommerces + stats.totalFamilies + stats.totalCitizens;
  const approvedItems = totalItems - totalPending;
  const progressPercentage = totalItems > 0 ? (approvedItems / totalItems) * 100 : 0;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false });
    setMobileMenuOpen(false);
  };

  const closeModals = () => {
    setSelectedOng(null);
    setSelectedCommerce(null);
    setSelectedProfile(null);
    setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ status: 'all', date: 'all', bairro: '' });
    setShowFilters(false);
  };

  const distributionData = [
    { name: 'ONGs', value: stats.totalOngs, color: '#8b5cf6' },
    { name: 'Comércios', value: stats.totalCommerces, color: '#3b82f6' },
    { name: 'Famílias', value: stats.totalFamilies, color: '#f97316' },
    { name: 'Cidadãos', value: stats.totalCitizens, color: '#10b981' },
  ];

  return (
    <div className="adm-wrapper">
      <div className={`adm-mobile-overlay ${mobileMenuOpen ? "adm-active" : ""}`} onClick={() => setMobileMenuOpen(false)} />
      
      {showNotifications && (
        <div className="adm-notifications-overlay" onClick={() => setShowNotifications(false)}>
          <div className="adm-notifications-panel" onClick={e => e.stopPropagation()}>
            <div className="adm-notifications-header">
              <h3>Notificações</h3>
              <div className="adm-header-actions-group">
                <button onClick={markAllAsRead}>Limpar todas</button>
                <button className="adm-close-notifications" onClick={() => setShowNotifications(false)}>
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="adm-notifications-list">
              {notifications.length === 0 ? (
                <div className="adm-empty-notifications">
                  <Bell size={40} />
                  <p>Nenhuma notificação por aqui</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div key={notification.id} className={`adm-notification-item ${!notification.isRead ? "adm-unread" : ""}`}>
                    <div className={`adm-notification-type-icon adm-${notification.type}`}>
                      {notification.type === "ong" && <Heart size={14} />}
                      {notification.type === "commerce" && <Store size={14} />}
                      {notification.type === "family" && <Users size={14} />}
                      {notification.type === "citizen" && <UserCircle size={14} />}
                    </div>
                    <div className="adm-notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span>{notification.time}</span>
                    </div>
                    <button className="adm-delete-notification" onClick={(e) => deleteNotification(notification.id, e)}>
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <aside className={`adm-sidebar ${mobileMenuOpen ? "adm-open" : ""}`}>
        <div className="adm-sidebar-header">
          <div className="adm-logo-box">
            <ShieldCheck size={24} />
          </div>
          <div className="adm-logo-text">
            <span className="adm-logo-name">Solidar</span>
            <span className="adm-logo-sub">Controle Central</span>
          </div>
        </div>

        <nav className="adm-sidebar-nav">
          <button onClick={() => navigate('/')} className="adm-nav-btn">
            <Eye size={20} />
            <span>Ver Site</span>
          </button>
          <button className={`adm-nav-btn ${activeTab === "dashboard" ? "adm-active" : ""}`} onClick={() => handleTabChange("dashboard")}>
            <Home size={20} />
            <span>Início</span>
          </button>
          <button className={`adm-nav-btn ${activeTab === "ongs" ? "adm-active" : ""}`} onClick={() => handleTabChange("ongs")}>
            <Heart size={20} />
            <span>ONGs</span>
            {stats.pendingOngs > 0 && <span className="adm-nav-badge">{stats.pendingOngs}</span>}
          </button>
          <button className={`adm-nav-btn ${activeTab === "commerces" ? "adm-active" : ""}`} onClick={() => handleTabChange("commerces")}>
            <Store size={20} />
            <span>Parceiros</span>
            {stats.pendingCommerces > 0 && <span className="adm-nav-badge">{stats.pendingCommerces}</span>}
          </button>
          <button className={`adm-nav-btn ${activeTab === "families" ? "adm-active" : ""}`} onClick={() => handleTabChange("families")}>
            <Users size={20} />
            <span>Família</span>
            {stats.pendingFamilies > 0 && <span className="adm-nav-badge">{stats.pendingFamilies}</span>}
          </button>
          <button className={`adm-nav-btn ${activeTab === "citizens" ? "adm-active" : ""}`} onClick={() => handleTabChange("citizens")}>
            <UserCircle size={20} />
            <span>Cidadão</span>
            {stats.pendingCitizens > 0 && <span className="adm-nav-badge">{stats.pendingCitizens}</span>}
          </button>
        </nav>

        <button className="adm-logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Encerrar Sessão</span>
        </button>
      </aside>

      <main className="adm-admin-main">
        <header className="adm-mobile-header">
          <button className="adm-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="adm-header-title">
            <h1>{activeTab === "dashboard" ? "Resumo Geral" : activeTab === "ongs" ? "Gestão de ONGs" : activeTab === "commerces" ? "Parceiros" : activeTab === "families" ? "Família" : "Cidadão"}</h1>
          </div>
          <div className="adm-header-actions">
            <button className="adm-notification-btn" onClick={fetchData} title="Atualizar dados">
              <RefreshCw size={20} />
            </button>
            <button className={`adm-notification-btn ${totalPending > 0 ? "has-badge" : ""}`} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={22} />
              {totalPending > 0 && <span className="adm-badge">{totalPending}</span>}
            </button>
          </div>
        </header>

        <PullToRefresh onRefresh={fetchData}>
          <div className="adm-content-area">
            <div className="adm-search-bar">
              <Search size={18} />
              <input type="text" placeholder="Pesquisar registros..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className={`adm-filter-trigger ${filters.status !== 'all' || filters.date !== 'all' || filters.bairro ? 'active' : ''}`} onClick={() => setShowFilters(true)}>
                <Filter size={20} />
              </button>
            </div>

          {activeTab === "dashboard" && (
            <div className="adm-dashboard-content">
              <div className="adm-summary-card">
                <div className="adm-section-header">
                  <h2>Meta de Aprovação</h2>
                  <span className="adm-percentage-badge">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="adm-progress-bar-container">
                  <div className="adm-progress-fill" style={{ width: `${progressPercentage}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                </div>
                <p className="adm-summary-footer">
                  {approvedItems} de {totalItems} registros analisados
                </p>
              </div>

              <div className="adm-stats-grid">
                <div className="adm-stat-card" style={{ color: 'var(--adm-ong-color)' }}>
                  <div className="adm-stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                    <Heart size={24} />
                  </div>
                  <div className="adm-stat-info">
                    <span className="adm-stat-label">ONGs</span>
                    <span className="adm-stat-value">{stats.totalOngs}</span>
                    <span className="adm-stat-analyzed">{stats.totalOngs - stats.pendingOngs} analisadas</span>
                  </div>
                </div>
                <div className="adm-stat-card" style={{ color: 'var(--adm-commerce-color)' }}>
                  <div className="adm-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                    <Store size={24} />
                  </div>
                  <div className="adm-stat-info">
                    <span className="adm-stat-label">Comércios</span>
                    <span className="adm-stat-value">{stats.totalCommerces}</span>
                    <span className="adm-stat-analyzed">{stats.totalCommerces - stats.pendingCommerces} analisados</span>
                  </div>
                </div>
                <div className="adm-stat-card" style={{ color: 'var(--adm-family-color)' }}>
                  <div className="adm-stat-icon" style={{ background: 'rgba(249, 115, 22, 0.1)' }}>
                    <Users size={24} />
                  </div>
                  <div className="adm-stat-info">
                    <span className="adm-stat-label">Famílias</span>
                    <span className="adm-stat-value">{stats.totalFamilies}</span>
                    <span className="adm-stat-analyzed">{stats.totalFamilies - stats.pendingFamilies} analisadas</span>
                  </div>
                </div>
                <div className="adm-stat-card" style={{ color: 'var(--adm-citizen-color)' }}>
                  <div className="adm-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <UserCircle size={24} />
                  </div>
                  <div className="adm-stat-info">
                    <span className="adm-stat-label">Cidadãos</span>
                    <span className="adm-stat-value">{stats.totalCitizens}</span>
                    <span className="adm-stat-analyzed">{stats.totalCitizens - stats.pendingCitizens} analisados</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                background: 'white', 
                borderRadius: 'var(--adm-radius-lg)', 
                padding: '1.5rem', 
                marginBottom: '1.5rem', 
                boxShadow: 'var(--adm-shadow-md)',
                border: '1px solid rgba(0,0,0,0.04)'
              }}>
                <div className="adm-section-header">
                  <h2>Distribuição da Rede</h2>
                </div>
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

              <div className="adm-pending-section">
                <div className="adm-section-header">
                  <h2>Aguardando Ação</h2>
                  <span className="adm-pending-count">{totalPending}</span>
                </div>
                <div className="adm-pending-list">
                  {totalPending === 0 ? (
                    <div className="adm-empty-state">
                      <CheckCircle size={48} />
                      <p>Excelente! Sem pendências.</p>
                    </div>
                  ) : (
                    <>
                      {pendingOngs.map((ong) => (
                        <div key={ong.id} className="adm-pending-item" onClick={() => setSelectedOng(ong)}>
                          <div className="adm-pending-icon adm-ong" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart size={18} />
                          </div>
                          <div className="adm-pending-info">
                            <span className="adm-pending-name">{ong.nome_fantasia}</span>
                            <span className="adm-pending-type">ONG • Pendente</span>
                          </div>
                          <button className="adm-quick-analyze-badge" onClick={(e) => { e.stopPropagation(); setSelectedOng(ong); }}>
                            Analisar
                          </button>
                        </div>
                      ))}
                      {pendingCommerces.map((commerce) => (
                        <div key={commerce.id} className="adm-pending-item" onClick={() => setSelectedCommerce(commerce)}>
                          <div className="adm-pending-icon adm-commerce" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Store size={18} />
                          </div>
                          <div className="adm-pending-info">
                            <span className="adm-pending-name">{commerce.nome_fantasia}</span>
                            <span className="adm-pending-type">Parceiro • Pendente</span>
                          </div>
                          <button className="adm-quick-analyze-badge" onClick={(e) => { e.stopPropagation(); setSelectedCommerce(commerce); }}>
                            Analisar
                          </button>
                        </div>
                      ))}
                      {profiles.filter(p => p.status === 'pending').map((family) => (
                        <div key={family.id} className="adm-pending-item" onClick={() => setSelectedProfile(family)}>
                          <div className="adm-pending-icon adm-family" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={18} />
                          </div>
                          <div className="adm-pending-info">
                            <span className="adm-pending-name">{family.nomeCompleto || family.full_name}</span>
                            <span className="adm-pending-type">Família • Pendente</span>
                          </div>
                          <button className="adm-quick-analyze-badge" onClick={(e) => { e.stopPropagation(); setSelectedProfile(family); }}>
                            Analisar
                          </button>
                        </div>
                      ))}
                      {citizens.filter(c => c.status === 'pending').map((citizen) => (
                        <div key={citizen.uid || citizen.id} className="adm-pending-item" onClick={() => setSelectedProfile(citizen)}>
                          <div className="adm-pending-icon adm-citizen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserCircle size={18} />
                          </div>
                          <div className="adm-pending-info">
                            <span className="adm-pending-name">{citizen.nomeCompleto || citizen.full_name}</span>
                            <span className="adm-pending-type">Cidadão • Pendente</span>
                          </div>
                          <button className="adm-quick-analyze-badge" onClick={(e) => { e.stopPropagation(); setSelectedProfile(citizen); }}>
                            Analisar
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {(activeTab === "ongs" || activeTab === "commerces" || activeTab === "families" || activeTab === "citizens") && (
            <div className="adm-list-content">
              {loading ? (
                <div className="adm-items-list">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonListItem key={i} />
                  ))}
                </div>
              ) : (
                <div className="adm-items-list">
                    {activeTab === "ongs" && (
                      filteredOngs.length > 0 ? filteredOngs.map((ong) => (
                      <div key={ong.id} className="adm-list-item" onClick={() => setSelectedOng(ong)}>
                        <Avatar 
                          alt={ong.nome_fantasia} 
                          className="adm-item-icon adm-ong" 
                          variant="rounded"
                          fallback={<Heart size={20} />}
                        />
                        <div className="adm-item-content">
                          <span className="adm-item-name">{ong.nome_fantasia}</span>
                          <span className="adm-item-email">{ong.email}</span>
                        </div>
                        <div 
                          className={`adm-item-actions ${getStatusClass(ong.status)}`}
                          style={{
                            backgroundColor: ong.status === 'active' || ong.status === 'ativo' || ong.status === 'analyzed' ? 'rgba(34, 197, 94, 0.1)' :
                                           ong.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' :
                                           'rgba(148, 163, 184, 0.1)',
                            border: `1px solid ${ong.status === 'active' || ong.status === 'ativo' || ong.status === 'analyzed' ? 'rgba(34, 197, 94, 0.2)' :
                                                ong.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' :
                                                'rgba(148, 163, 184, 0.2)'}`
                          }}
                        >
                          <Badge variant={ong.status}>{getStatusLabel(ong.status)}</Badge>
                          {ong.status === "pending" && (
                            <button className="adm-quick-analyze-badge" onClick={(e) => { e.stopPropagation(); setSelectedOng(ong); }}>
                              Analisar
                            </button>
                          )}
                        </div>
                      </div>
                      )) : (
                        <EmptyState actionLabel="Limpar Filtros" onAction={clearFilters} />
                      )
                    )}
                    {activeTab === "commerces" && (
                      filteredCommerces.length > 0 ? filteredCommerces.map((commerce) => (
                      <div key={commerce.id} className="adm-list-item" onClick={() => setSelectedCommerce(commerce)}>
                        <Avatar 
                          alt={commerce.nome_fantasia} 
                          className="adm-item-icon adm-commerce" 
                          variant="rounded"
                          fallback={<Store size={20} />}
                        />
                        <div className="adm-item-content">
                          <span className="adm-item-name">{commerce.nome_fantasia}</span>
                          <span className="adm-item-email">{commerce.email}</span>
                        </div>
                        <div 
                          className={`adm-item-actions ${getStatusClass(commerce.status)}`}
                          style={{
                            backgroundColor: commerce.status === 'active' || commerce.status === 'ativo' || commerce.status === 'analyzed' ? 'rgba(34, 197, 94, 0.1)' :
                                           commerce.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' :
                                           'rgba(148, 163, 184, 0.1)',
                            border: `1px solid ${commerce.status === 'active' || commerce.status === 'ativo' || commerce.status === 'analyzed' ? 'rgba(34, 197, 94, 0.2)' :
                                                commerce.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' :
                                                'rgba(148, 163, 184, 0.2)'}`
                          }}
                        >
                          <Badge variant={commerce.status}>{getStatusLabel(commerce.status)}</Badge>
                          {commerce.status === "pending" && (
                            <button className="adm-quick-analyze-badge" onClick={(e) => { e.stopPropagation(); setSelectedCommerce(commerce); }}>
                              Analisar
                            </button>
                          )}
                        </div>
                      </div>
                      )) : (
                        <EmptyState actionLabel="Limpar Filtros" onAction={clearFilters} />
                      )
                    )}
                    {activeTab === "families" && (
                      filteredFamilies.length > 0 ? filteredFamilies.map((profile) => (
                      <div key={profile.id} className="adm-list-item" onClick={() => setSelectedProfile(profile)}>
                        <Avatar 
                          alt={profile.nomeCompleto || profile.full_name} 
                          className="adm-item-icon adm-family" 
                          variant="rounded"
                          fallback={<Users size={20} />}
                        />
                        <div className="adm-item-content">
                          <span className="adm-item-name">{profile.nomeCompleto || profile.full_name}</span>
                          <span className="adm-item-email">{profile.email}</span>
                        </div>
                        <div 
                          className={`adm-item-actions ${getStatusClass(profile.status)}`}
                          style={{
                            backgroundColor: profile.status === 'active' || profile.status === 'ativo' || profile.status === 'analyzed' ? 'rgba(34, 197, 94, 0.1)' :
                                           profile.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' :
                                           'rgba(148, 163, 184, 0.1)',
                            border: `1px solid ${profile.status === 'active' || profile.status === 'ativo' || profile.status === 'analyzed' ? 'rgba(34, 197, 94, 0.2)' :
                                                profile.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' :
                                                'rgba(148, 163, 184, 0.2)'}`
                          }}
                        >
                          <Badge variant={profile.status}>{getStatusLabel(profile.status)}</Badge>
                          {profile.status === "pending" && (
                            <button className="adm-quick-analyze-badge" onClick={(e) => { e.stopPropagation(); setSelectedProfile(profile); }}>
                              Analisar
                            </button>
                          )}
                        </div>
                      </div>
                      )) : (
                        <EmptyState actionLabel="Limpar Filtros" onAction={clearFilters} />
                      )
                    )}
                    {activeTab === "citizens" && (
                      filteredCitizens.length > 0 ? filteredCitizens.map((citizen) => (
                      <div key={citizen.uid} className="adm-list-item" onClick={() => setSelectedProfile(citizen)}>
                        <Avatar
                          alt={citizen.nomeCompleto || citizen.full_name}
                          className="adm-item-icon adm-citizen"
                          variant="rounded"
                          fallback={<UserCircle size={20} />}
                        />
                        <div className="adm-item-content">
                          <span className="adm-item-name">{citizen.nomeCompleto || citizen.full_name}</span>
                          <span className="adm-item-email">{citizen.email}</span>
                        </div>
                        <div 
                          className={`adm-item-actions ${getStatusClass(citizen.status)}`}
                          style={{
                            backgroundColor: citizen.status === 'active' || citizen.status === 'ativo' || citizen.status === 'analyzed' ? 'rgba(34, 197, 94, 0.1)' :
                                           citizen.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' :
                                           'rgba(148, 163, 184, 0.1)',
                            border: `1px solid ${citizen.status === 'active' || citizen.status === 'ativo' || citizen.status === 'analyzed' ? 'rgba(34, 197, 94, 0.2)' :
                                                citizen.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' :
                                                'rgba(148, 163, 184, 0.2)'}`
                          }}
                        >
                          <Badge variant={citizen.status}>{getStatusLabel(citizen.status)}</Badge>
                          {citizen.status === "pending" && (
                            <button className="adm-quick-analyze-badge" onClick={(e) => { e.stopPropagation(); setSelectedProfile(citizen); }}>
                              Analisar
                            </button>
                          )}
                        </div>
                      </div>
                      )) : (
                        <EmptyState actionLabel="Limpar Filtros" onAction={clearFilters} />
                      )
                    )}

                </div>
              )}
            </div>
          )}
          </div>
        </PullToRefresh>
      </main>

      {/* Mobile Modals */}
      <MobileModal
        isOpen={!!selectedOng}
        onClose={closeModals}
        item={selectedOng}
        type="ong"
        onConfirm={(item, type) => handleUpdateStatus(item.id, "analyzed", "ongs", item.nome_fantasia)}
        evaluationChecklist={evaluationChecklist}
        setEvaluationChecklist={setEvaluationChecklist}
        loading={loading}
      />

      <MobileModal
        isOpen={!!selectedCommerce}
        onClose={closeModals}
        item={selectedCommerce}
        type="commerce"
        onConfirm={(item, type) => handleUpdateStatus(item.id, "analyzed", "commerces", item.nome_fantasia)}
        evaluationChecklist={evaluationChecklist}
        setEvaluationChecklist={setEvaluationChecklist}
        loading={loading}
      />

      <MobileModal
        isOpen={!!selectedProfile}
        onClose={closeModals}
        item={selectedProfile}
        type={selectedProfile?.role === 'family' ? 'family' : 'citizen'}
        onConfirm={(item, type) => {
          const entityType = type === 'family' ? 'families' : 'citizens';
          const itemId = item.uid || item.id;
          const itemName = item.nomeCompleto || item.full_name;
          handleUpdateStatus(itemId, "analyzed", entityType, itemName);
        }}
        evaluationChecklist={evaluationChecklist}
        setEvaluationChecklist={setEvaluationChecklist}
        loading={loading}
      />
      
      {/* Success Modal */}
      {successAction && (
        <div className="adm-modal-overlay" style={{ alignItems: 'center', padding: '1.5rem' }} onClick={() => setSuccessAction(null)}>
          <div className="adm-modal-content" style={{ borderRadius: 'var(--adm-radius-lg)', maxWidth: '400px', margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-body" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--adm-success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 1.5rem' }}>
                <CheckCircle size={40} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{successAction.title}</h2>
              <p style={{ color: 'var(--adm-secondary)', fontWeight: 500 }}>{successAction.message}</p>
              <button className="adm-btn-primary" style={{ background: 'var(--adm-primary)', marginTop: '2rem', width: '100%' }} onClick={() => setSuccessAction(null)}>Entendido</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtrar Resultados"
        onApply={() => setShowFilters(false)}
        onClear={clearFilters}
      >
        <div className="filter-group">
          <label>Status</label>
          <div className="filter-options">
            <button 
              className={`filter-chip ${filters.status === 'all' ? 'active' : ''}`} 
              onClick={() => setFilters({...filters, status: 'all'})}
            >
              Todos
            </button>
            <button 
              className={`filter-chip ${filters.status === 'pending' ? 'active' : ''}`} 
              onClick={() => setFilters({...filters, status: 'pending'})}
            >
              Pendentes
            </button>
            <button 
              className={`filter-chip ${filters.status === 'analyzed' ? 'active' : ''}`} 
              onClick={() => setFilters({...filters, status: 'analyzed'})}
            >
              Analisados
            </button>
          </div>
        </div>
        
        <div className="filter-group">
          <label>Data de Cadastro</label>
          <select 
            value={filters.date} 
            onChange={(e) => setFilters({...filters, date: e.target.value})}
            className="filter-select"
          >
            <option value="all">Todo o período</option>
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Bairro</label>
          <input 
            type="text" 
            placeholder="Ex: Centro" 
            value={filters.bairro}
            onChange={(e) => setFilters({...filters, bairro: e.target.value})}
            className="filter-input"
          />
        </div>
      </BottomSheet>

      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}