import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import apiService from '../../services/apiService';
import DashboardMobile from './DashboardMobile';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
  LayoutDashboard, Building2, Users, 
  ShieldCheck, LogOut, Search, Filter,
  Eye, CheckCircle, XCircle, Trash2,
  Key, Shield, Hash, Map, UserCircle,
  Bell, AlertCircle, Clock, ArrowRight,
  Heart, Briefcase, Store, GraduationCap,
  Zap, Target, Sparkles, DollarSign,
  Home, Users2, ListChecks, RefreshCw,
  Download, ChevronDown, SlidersHorizontal,
  MoreHorizontal, Calendar
} from 'lucide-react';
import './styles.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export default function AdminDashboard() {
  const isMobile = useIsMobile();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, verified, rejected
  const [sortBy, setSortBy] = useState('date_desc'); // date_desc, date_asc, name_asc
  const [selectedItems, setSelectedItems] = useState([]);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [ongs, setOngs] = useState([]);
  const [commerces, setCommerces] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOng, setSelectedOng] = useState(null);
  const [selectedCommerce, setSelectedCommerce] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [evaluationChecklist, setEvaluationChecklist] = useState({ check1: false, check2: false, check3: false, check4: false });
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  useEffect(() => {
    setFilterStatus('all');
    setSearchTerm('');
    setDateStart('');
    setDateEnd('');
    setSelectedItems([]);
    fetchData();
  }, [activeTab]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    showToast('Dados atualizados com sucesso!', 'success');
  };

  const handleExport = () => {
    showToast('Gerando relatório CSV...', 'info');
    
    const escapeCsv = (field) => {
      if (field === null || field === undefined) return '';
      const stringField = String(field);
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    };

    let data = [];
    let headers = [];
    let filename = 'relatorio';

    if (activeTab === 'dashboard') {
      filename = 'dashboard_resumo';
      headers = ['Categoria', 'Total', 'Pendentes', 'Verificados'];
      data = [
        { cat: 'ONGs', total: displayStats.totalOngs, pending: displayStats.pendingOngs, verified: displayStats.totalOngs - displayStats.pendingOngs },
        { cat: 'Comércios', total: displayStats.totalCommerces, pending: displayStats.pendingCommerces, verified: displayStats.totalCommerces - displayStats.pendingCommerces },
        { cat: 'Famílias', total: displayStats.totalFamilies, pending: displayStats.pendingFamilies, verified: displayStats.totalFamilies - displayStats.pendingFamilies },
        { cat: 'Cidadãos', total: displayStats.totalCitizens, pending: displayStats.pendingCitizens, verified: displayStats.totalCitizens - displayStats.pendingCitizens }
      ];
    } else if (activeTab === 'ongs') {
      filename = 'ongs_export';
      headers = ['Nome Fantasia', 'Razão Social', 'CNPJ', 'Email', 'Telefone', 'Status', 'Data Cadastro'];
      data = processedOngs.map(item => ({
        nome: item.nome_fantasia || item.nomeFantasia || item.razaoSocial || '',
        razao: item.razao_social || item.razaoSocial || '',
        cnpj: item.cnpj || '',
        email: item.email || '',
        tel: item.telefone || '',
        status: item.status || 'pending',
        data: new Date(item.created_at || item.createdAt || Date.now()).toLocaleDateString('pt-BR')
      }));
    } else if (activeTab === 'commerces') {
      filename = 'comercios_export';
      headers = ['Nome Estabelecimento', 'CNPJ', 'Responsável', 'Email', 'Telefone', 'Status', 'Data Cadastro'];
      data = processedCommerces.map(item => ({
        nome: item.nomeEstabelecimento || item.nome_fantasia || '',
        cnpj: item.cnpj || '',
        resp: item.responsavel?.nome || item.responsavel_legal || '',
        email: item.contato?.email || item.email || '',
        tel: item.contato?.telefone || item.telefone || '',
        status: item.status || 'pending',
        data: new Date(item.created_at || item.createdAt || Date.now()).toLocaleDateString('pt-BR')
      }));
    } else if (activeTab === 'families' || activeTab === 'citizens') {
      filename = `${activeTab}_export`;
      headers = ['Nome', 'CPF/Documento', 'Email', 'Telefone', 'Status', 'Data Cadastro'];
      data = processedProfiles.map(item => ({
        nome: item.nome || item.nomeCompleto || '',
        doc: item.cpf || item.nis || '',
        email: item.email || '',
        tel: item.telefone || '',
        status: item.status || 'pending',
        data: new Date(item.created_at || item.createdAt || Date.now()).toLocaleDateString('pt-BR')
      }));
    }

    if (!data.length) {
      showToast('Nenhum dado para exportar.', 'warning');
      return;
    }

    const csvContent = [headers.join(','), ...data.map(row => Object.values(row).map(escapeCsv).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`;
    link.click();
    showToast('Download iniciado!', 'success');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch ONGs
      const ongsResponse = await apiService.request('/admin/entities/ongs');
      setOngs(ongsResponse.data || []);

      // Fetch Commerces
      const commercesResponse = await apiService.request('/admin/entities/comercios');
      setCommerces(commercesResponse.data || []);

      // Fetch Profiles
      const familiasResponse = await apiService.request('/admin/entities/familias');
      const cidadaosResponse = await apiService.request('/admin/entities/cidadaos');
      
      const familias = (familiasResponse.data || []).map(f => ({ ...f, _type: 'family' }));
      const cidadaos = (cidadaosResponse.data || []).map(c => ({ ...c, _type: 'citizen' }));
      
      if (activeTab === 'families') {
        setProfiles(familias);
      } else if (activeTab === 'citizens') {
        setProfiles(cidadaos);
      } else {
        setProfiles([...familias, ...cidadaos]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Mock data fallback if API fails
      setOngs([]);
      setCommerces([]);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filter and Sort Logic
  const filterAndSortData = (data, type) => {
    let result = [...data];

    // 1. Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(item => {
        const name = item.nome || item.nomeCompleto || item.razaoSocial || item.razao_social || item.nome_fantasia || item.nomeFantasia || item.nomeEstabelecimento || '';
        const email = item.email || item.contato?.email || '';
        const doc = item.cpf || item.cnpj || '';
        return name.toLowerCase().includes(lowerTerm) || email.toLowerCase().includes(lowerTerm) || doc.includes(lowerTerm);
      });
    }

    // 2. Status Filter
    if (filterStatus !== 'all') {
      result = result.filter(item => (item.status || 'pending') === filterStatus);
    }

    // 3. Date Filter
    if (dateStart) {
      const start = new Date(dateStart);
      start.setHours(0, 0, 0, 0);
      result = result.filter(item => new Date(item.created_at || item.createdAt || 0) >= start);
    }
    if (dateEnd) {
      const end = new Date(dateEnd);
      end.setHours(23, 59, 59, 999);
      result = result.filter(item => new Date(item.created_at || item.createdAt || 0) <= end);
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === 'name_asc') {
        const nameA = a.nome || a.nomeCompleto || a.razaoSocial || a.nomeEstabelecimento || '';
        const nameB = b.nome || b.nomeCompleto || b.razaoSocial || b.nomeEstabelecimento || '';
        return nameA.localeCompare(nameB);
      } else if (sortBy === 'date_asc') {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateA - dateB;
      } else { // date_desc (default)
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateB - dateA;
      }
    });

    return result;
  };

  const processedOngs = useMemo(() => filterAndSortData(ongs, 'ongs'), [ongs, searchTerm, filterStatus, sortBy, dateStart, dateEnd]);
  const processedCommerces = useMemo(() => filterAndSortData(commerces, 'commerces'), [commerces, searchTerm, filterStatus, sortBy, dateStart, dateEnd]);
  const processedProfiles = useMemo(() => filterAndSortData(profiles, 'profiles'), [profiles, searchTerm, filterStatus, sortBy, dateStart, dateEnd]);

  const getCurrentList = () => {
    if (activeTab === 'ongs') return processedOngs;
    if (activeTab === 'commerces') return processedCommerces;
    if (activeTab === 'families' || activeTab === 'citizens') return processedProfiles;
    return [];
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const list = getCurrentList();
      setSelectedItems(list.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      return [...prev, id];
    });
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) return;
    
    const actionLabel = action === 'verified' ? 'aprovar' : 'rejeitar';
    if (!window.confirm(`Tem certeza que deseja ${actionLabel} ${selectedItems.length} itens selecionados?`)) {
      return;
    }

    setLoading(true);
    let entityType = '';
    if (activeTab === 'ongs') entityType = 'ongs';
    else if (activeTab === 'commerces') entityType = 'comercios';
    else if (activeTab === 'families') entityType = 'familias';
    else if (activeTab === 'citizens') entityType = 'cidadaos';

    const promises = selectedItems.map(id => 
      apiService.updateStatus(entityType, id, action, action === 'rejected' ? 'Ação em massa via Admin' : '')
    );

    await Promise.allSettled(promises);
    setLoading(false);
    setSelectedItems([]);
    showToast(`${selectedItems.length} itens processados.`, 'success');
    fetchData();
  };

  const handleConfirmAnalysis = async (item, type) => {
    try {
      setLoading(true);
      
      let endpoint = '';
      if (type === 'ong') endpoint = `/ongs/${item.id}/analyze`;
      else if (type === 'commerce') endpoint = `/comercios/${item.id}/analyze`;
      else if (type === 'family') endpoint = `/familias/${item.id}/analyze`;
      else if (type === 'citizen') endpoint = `/cidadaos/${item.id}/analyze`;

      // Chamar API específica para marcar como analisado
      await apiService.request(endpoint, {
        method: 'PATCH'
      });

      showToast('Análise confirmada com sucesso!', 'success');
      
      // Fechar modal e atualizar dados
      setSelectedOng(null);
      setSelectedCommerce(null);
      setSelectedProfile(null);
      
      await fetchData();
    } catch (error) {
      console.error('Erro ao confirmar análise:', error);
      showToast('Erro ao confirmar análise', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats dynamically based on filtered data
  const displayStats = useMemo(() => {
    const pOngs = processedOngs || [];
    const pCommerces = processedCommerces || [];
    const pProfiles = processedProfiles || [];
    
    const pFamilies = pProfiles.filter(p => p._type === 'family');
    const pCitizens = pProfiles.filter(p => p._type === 'citizen');

    return {
      totalOngs: pOngs.length,
      pendingOngs: pOngs.filter(o => !o.status || o.status === 'pending' || o.status === 'active' || o.status === 'ativo').length,
      analyzedOngs: pOngs.filter(o => o.status === 'analyzed').length,
      totalCommerces: pCommerces.length,
      pendingCommerces: pCommerces.filter(c => !c.status || c.status === 'pending' || c.status === 'active' || c.status === 'ativo').length,
      analyzedCommerces: pCommerces.filter(c => c.status === 'analyzed').length,
      totalFamilies: pFamilies.length,
      pendingFamilies: pFamilies.filter(f => !f.status || f.status === 'pending' || f.status === 'active' || f.status === 'ativo').length,
      analyzedFamilies: pFamilies.filter(f => f.status === 'analyzed').length,
      totalCitizens: pCitizens.length,
      pendingCitizens: pCitizens.filter(c => !c.status || c.status === 'pending' || c.status === 'active' || c.status === 'ativo').length,
      analyzedCitizens: pCitizens.filter(c => c.status === 'analyzed').length,
    };
  }, [processedOngs, processedCommerces, processedProfiles]);

  // Calculate monthly stats for the last 6 months
  const monthlyStats = useMemo(() => {
    const labels = [];
    const data = [0, 0, 0, 0, 0, 0];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleString('pt-BR', { month: 'short' });
      labels.push(monthName.charAt(0).toUpperCase() + monthName.slice(1));
    }

    const allEntities = [...processedOngs, ...processedCommerces, ...processedProfiles];
    allEntities.forEach(entity => {
      const date = new Date(entity.created_at || entity.createdAt || Date.now());
      const monthDiff = (today.getFullYear() - date.getFullYear()) * 12 + (today.getMonth() - date.getMonth());
      if (monthDiff >= 0 && monthDiff < 6) {
        data[5 - monthDiff]++;
      }
    });
    return { labels, data };
  }, [processedOngs, processedCommerces, processedProfiles]);

  // Helper for status badge
  const getStatusBadge = (status) => {
    const s = status || 'pending';
    const config = {
      verified: { className: 'status-badge verified', label: 'Verificado', icon: CheckCircle },
      analyzed: { className: 'status-badge analyzed', label: 'Analisado', icon: CheckCircle },
      pending: { className: 'status-badge pending', label: 'Pendente', icon: Clock },
      rejected: { className: 'status-badge rejected', label: 'Rejeitado', icon: XCircle },
    };
    const { className, label, icon: Icon } = config[s] || config.pending;
    return <span className={className}><Icon size={12} style={{ marginRight: 4 }} /> {label}</span>;
  };

  // Render mobile version if on mobile device
  if (isMobile) {
    return <DashboardMobile />;
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo-box">
            <ShieldCheck size={24} />
          </div>
          <div className="admin-logo-text">
            <span className="admin-logo-name">Solidar</span>
            <span className="admin-logo-sub">Painel Admin</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <button onClick={() => setActiveTab('dashboard')} className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Visão Geral</span>
          </button>
          <button onClick={() => setActiveTab('ongs')} className={`admin-nav-btn ${activeTab === 'ongs' ? 'active' : ''}`}>
            <Building2 size={20} />
            <span>ONGs</span>
            {displayStats.pendingOngs > 0 && <span className="admin-nav-badge">{displayStats.pendingOngs}</span>}
          </button>
          <button onClick={() => setActiveTab('commerces')} className={`admin-nav-btn ${activeTab === 'commerces' ? 'active' : ''}`}>
            <Store size={20} />
            <span>Comércios</span>
            {displayStats.pendingCommerces > 0 && <span className="admin-nav-badge">{displayStats.pendingCommerces}</span>}
          </button>
          <button onClick={() => setActiveTab('families')} className={`admin-nav-btn ${activeTab === 'families' ? 'active' : ''}`}>
            <Users size={20} />
            <span>Famílias</span>
            {displayStats.pendingFamilies > 0 && <span className="admin-nav-badge">{displayStats.pendingFamilies}</span>}
          </button>
          <button onClick={() => setActiveTab('citizens')} className={`admin-nav-btn ${activeTab === 'citizens' ? 'active' : ''}`}>
            <UserCircle size={20} />
            <span>Cidadãos</span>
            {displayStats.pendingCitizens > 0 && <span className="admin-nav-badge">{displayStats.pendingCitizens}</span>}
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={20} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="admin-page-title">
              {activeTab === 'dashboard' ? 'Painel de Controle' : 
               activeTab === 'ongs' ? 'Gestão de ONGs' : 
               activeTab === 'commerces' ? 'Gestão de Comércios' :
               activeTab === 'families' ? 'Gestão de Famílias' : 'Gestão de Cidadãos'}
            </h1>
            <p style={{ color: 'var(--admin-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {activeTab === 'dashboard' ? 'Visão geral de todos os cadastros e estatísticas' : 'Painel administrativo do Solidar Bairro'}
            </p>
          </div>
          
          <div className="admin-header-actions">
            <button onClick={handleRefresh} className={`admin-icon-btn ${refreshing ? 'spin' : ''}`} title="Atualizar dados">
              <RefreshCw size={20} />
            </button>
            <button onClick={handleExport} className="admin-icon-btn" title="Exportar relatório">
              <Download size={20} />
            </button>

            <div className="admin-user-info-card">
              <div className="admin-user-details">
                <span className="admin-user-name">Administrador</span>
                <span className="admin-user-role">Super Admin</span>
              </div>
              <div className="admin-avatar">A</div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="admin-stats-grid">
          {activeTab === 'dashboard' ? (
            <>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#f3e8ff', color: '#8b5cf6' }}><Building2 size={24} /></div>
                <div className="admin-stat-info"><h3>ONGs</h3><p>{displayStats.totalOngs}</p></div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><Store size={24} /></div>
                <div className="admin-stat-info"><h3>Comércios</h3><p>{displayStats.totalCommerces}</p></div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#fff7ed', color: '#f97316' }}><Users size={24} /></div>
                <div className="admin-stat-info"><h3>Famílias</h3><p>{displayStats.totalFamilies}</p></div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#f0fdf4', color: '#15803d' }}><UserCircle size={24} /></div>
                <div className="admin-stat-info"><h3>Cidadãos</h3><p>{displayStats.totalCitizens}</p></div>
              </div>
            </>
          ) : activeTab === 'ongs' ? (
            <>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}><Building2 size={24} /></div>
                <div className="admin-stat-info"><h3>Total ONGs</h3><p>{displayStats.totalOngs}</p></div>
              </div>
            </>
          ) : activeTab === 'commerces' ? (
            <>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}><Store size={24} /></div>
                <div className="admin-stat-info"><h3>Parceiros</h3><p>{displayStats.totalCommerces}</p></div>
              </div>
            </>
          ) : activeTab === 'families' ? (
            <>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#fff7ed', color: '#c2410c' }}><Users size={24} /></div>
                <div className="admin-stat-info"><h3>Famílias</h3><p>{displayStats.totalFamilies}</p></div>
              </div>
            </>
          ) : (
            <>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#f0fdf4', color: '#15803d' }}><UserCircle size={24} /></div>
                <div className="admin-stat-info"><h3>Cidadãos</h3><p>{displayStats.totalCitizens}</p></div>
              </div>
            </>
          )}
        </div>

        <div className="admin-toolbar">
          <div className="input-with-icon search-box">
            <Search className="field-icon" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, email ou documento..."
              className="admin-input" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="toolbar-actions">
            <div className="input-with-icon" style={{ width: 'auto' }}>
              <Calendar className="field-icon" size={18} />
              <input 
                type="text" 
                className="admin-input" 
                style={{ paddingLeft: '2.5rem', width: '150px' }}
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                placeholder="Data Inicial"
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
              />
            </div>
            <div className="input-with-icon" style={{ width: 'auto' }}>
              <Calendar className="field-icon" size={18} />
              <input 
                type="text" 
                className="admin-input" 
                style={{ paddingLeft: '2.5rem', width: '150px' }}
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                placeholder="Data Final"
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
              />
            </div>

            <div className="select-wrapper">
              <Filter size={16} className="select-icon" />
              <select className="admin-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Todos os Status</option>
                <option value="pending">Pendentes</option>
                <option value="verified">Verificados</option>
                <option value="rejected">Rejeitados</option>
              </select>
            </div>

            <div className="select-wrapper">
              <SlidersHorizontal size={16} className="select-icon" />
              <select className="admin-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date_desc">Mais Recentes</option>
                <option value="date_asc">Mais Antigos</option>
                <option value="name_asc">Nome (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <div className="dashboard-overview">
            <div className="dashboard-section">
                <h3 className="dashboard-section-title">
                  <Target size={18} color="var(--admin-success)" /> 
                  Resumo de Atividades
                  <span className="activity-status-badge">
                    {displayStats.pendingOngs + displayStats.pendingCommerces + displayStats.pendingFamilies + displayStats.pendingCitizens > 0 ? 'Ativo' : 'Em Dia'}
                  </span>
                </h3>
                <div className="dashboard-activity-grid">
                  <div className="activity-card total-card">
                    <div className="activity-icon"><Users2 size={18} /></div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <div className="activity-number">{displayStats.totalOngs + displayStats.totalCommerces + displayStats.totalFamilies + displayStats.totalCitizens}</div>
                        <div className="activity-trend positive">+{Math.floor(Math.random() * 5) + 1}</div>
                      </div>
                      <div className="activity-label">Total de Cadastros</div>
                      <div className="activity-subtitle">Esta semana</div>
                    </div>
                  </div>
                  <div className="activity-card pending-card">
                    <div className="activity-icon warning"><Clock size={18} /></div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <div className="activity-number">{displayStats.pendingOngs + displayStats.pendingCommerces + displayStats.pendingFamilies + displayStats.pendingCitizens}</div>
                        <div className={`activity-trend ${displayStats.pendingOngs + displayStats.pendingCommerces + displayStats.pendingFamilies + displayStats.pendingCitizens > 0 ? 'urgent' : 'ok'}`}>
                          {displayStats.pendingOngs + displayStats.pendingCommerces + displayStats.pendingFamilies + displayStats.pendingCitizens > 0 ? '⚠️' : '✅'}
                        </div>
                      </div>
                      <div className="activity-label">Aguardando Análise</div>
                      <div className="activity-subtitle">{displayStats.pendingOngs + displayStats.pendingCommerces + displayStats.pendingFamilies + displayStats.pendingCitizens > 0 ? 'Requer atenção' : 'Tudo em dia'}</div>
                    </div>
                  </div>
                  <div className="activity-card approved-card">
                    <div className="activity-icon success"><CheckCircle size={18} /></div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <div className="activity-number">{displayStats.analyzedOngs + displayStats.analyzedCommerces + displayStats.analyzedFamilies + displayStats.analyzedCitizens}</div>
                        <div className="activity-trend percentage">{Math.round((displayStats.analyzedOngs + displayStats.analyzedCommerces + displayStats.analyzedFamilies + displayStats.analyzedCitizens) / Math.max(1, displayStats.totalOngs + displayStats.totalCommerces + displayStats.totalFamilies + displayStats.totalCitizens) * 100)}%</div>
                      </div>
                      <div className="activity-label">Analisados pelo Admin</div>
                      <div className="activity-subtitle">Confirmados manualmente</div>
                    </div>
                  </div>
                </div>
                <div className="activity-progress">
                  <div className="progress-header">
                    <span>Taxa de Análise</span>
                    <span className="progress-percentage">{Math.round((displayStats.analyzedOngs + displayStats.analyzedCommerces + displayStats.analyzedFamilies + displayStats.analyzedCitizens) / Math.max(1, displayStats.totalOngs + displayStats.totalCommerces + displayStats.totalFamilies + displayStats.totalCitizens) * 100)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.round((displayStats.analyzedOngs + displayStats.analyzedCommerces + displayStats.analyzedFamilies + displayStats.analyzedCitizens) / Math.max(1, displayStats.totalOngs + displayStats.totalCommerces + displayStats.totalFamilies + displayStats.totalCitizens) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            
            <div className="dashboard-charts">
              <div className="chart-section">
                <h3 className="dashboard-section-title"><Zap size={18} color="var(--admin-accent)" /> Distribuição por Categoria</h3>
                <div className="chart-wrapper">
                  <Bar
                    data={{
                      labels: ['ONGs', 'Comércios', 'Famílias', 'Cidadãos'],
                      datasets: [{
                        label: 'Total',
                        data: [displayStats.totalOngs, displayStats.totalCommerces, displayStats.totalFamilies, displayStats.totalCitizens],
                        backgroundColor: ['rgba(139, 92, 246, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(21, 128, 61, 0.8)'],
                        borderColor: ['#8b5cf6', '#3b82f6', '#f97316', '#15803d'],
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          titleColor: 'white',
                          bodyColor: 'white',
                          borderColor: '#6366f1',
                          borderWidth: 1,
                          cornerRadius: 8
                        }
                      },
                      scales: {
                        y: { 
                          beginAtZero: true, 
                          ticks: { stepSize: 1, color: '#64748b' },
                          grid: { color: '#f1f5f9' }
                        },
                        x: {
                          ticks: { color: '#64748b' },
                          grid: { display: false }
                        }
                      }
                    }}
                    height={180}
                  />
                </div>
              </div>
              <div className="chart-section" style={{ gridColumn: '1 / -1' }}>
                <h3 className="dashboard-section-title"><Calendar size={18} color="var(--admin-accent)" /> Evolução de Cadastros (6 Meses)</h3>
                <div className="chart-wrapper">
                  <Line
                    data={{
                      labels: monthlyStats.labels,
                      datasets: [{
                        label: 'Novos Cadastros',
                        data: monthlyStats.data,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#8b5cf6',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          titleColor: 'white',
                          bodyColor: 'white',
                          borderColor: '#6366f1',
                          borderWidth: 1,
                          cornerRadius: 8,
                          padding: 10
                        }
                      },
                      scales: {
                        y: { 
                          beginAtZero: true, 
                          grid: { color: '#f1f5f9', borderDash: [4, 4] },
                          ticks: { color: '#94a3b8', stepSize: 1 }
                        },
                        x: {
                          grid: { display: false },
                          ticks: { color: '#94a3b8' }
                        }
                      }
                    }}
                    height={180}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Table */
          <>
          {selectedItems.length > 0 && (
            <div className="bulk-actions-bar animate-scale-in">
              <span style={{ fontWeight: 600 }}>{selectedItems.length} itens selecionados</span>
              <div className="bulk-actions-buttons">
                <button onClick={() => handleBulkAction('verified')} className="bulk-btn approve">
                  <CheckCircle size={16} /> Aprovar Selecionados
                </button>
                <button onClick={() => handleBulkAction('rejected')} className="bulk-btn reject">
                  <XCircle size={16} /> Rejeitar Selecionados
                </button>
              </div>
            </div>
          )}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                {activeTab === 'ongs' || activeTab === 'commerces' ? (
                <tr>
                  <th style={{ width: '40px' }}>
                    <input type="checkbox" 
                      onChange={handleSelectAll} 
                      checked={getCurrentList().length > 0 && selectedItems.length === getCurrentList().length} 
                    />
                  </th>
                  <th>Nome / Entidade</th>
                  <th>Documento</th>
                  <th>Data Cadastro</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              ) : (
                <tr>
                  <th style={{ width: '40px' }}>
                    <input type="checkbox" 
                      onChange={handleSelectAll} 
                      checked={getCurrentList().length > 0 && selectedItems.length === getCurrentList().length} 
                    />
                  </th>
                  <th>Nome / Responsável</th>
                  <th>Documento</th>
                  <th>Contato</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              )}
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '4rem' }}>
                  <div className="animate-pulse-custom">Carregando dados...</div>
                </td></tr>
              ) : activeTab === 'ongs' ? (
                processedOngs.length > 0 ? processedOngs.map((ong) => (
                  <tr key={ong.id} className={selectedItems.includes(ong.id) ? 'selected-row' : ''}>
                    <td>
                      <input type="checkbox" checked={selectedItems.includes(ong.id)} onChange={() => handleSelectItem(ong.id)} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{ong.razaoSocial || ong.razao_social || ong.nome_fantasia || ong.nomeFantasia}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>{ong.email}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--admin-accent)', marginTop: '0.25rem' }}>
                        {ong.causas && ong.causas.length > 0 && (
                          <span>Causas: {ong.causas.slice(0, 2).join(', ')}{ong.causas.length > 2 && '...'}</span>
                        )}
                      </div>
                    </td>
                    <td><code>{ong.cnpj}</code></td>
                    <td>{new Date(ong.created_at || ong.createdAt || Date.now()).toLocaleDateString('pt-BR')}</td>
                    <td>{getStatusBadge(ong.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => { setSelectedOng(ong); }} className="admin-action-btn">
                        <Eye size={16} /> Detalhes
                      </button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={6} className="empty-state">Nenhuma ONG encontrada com os filtros atuais.</td></tr>
              ) : activeTab === 'commerces' ? (
                processedCommerces.length > 0 ? processedCommerces.map((commerce) => (
                  <tr key={commerce.id} className={selectedItems.includes(commerce.id) ? 'selected-row' : ''}>
                    <td>
                      <input type="checkbox" checked={selectedItems.includes(commerce.id)} onChange={() => handleSelectItem(commerce.id)} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{commerce.nomeEstabelecimento || commerce.nome_fantasia || commerce.nomeFantasia}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>{commerce.contato?.email || commerce.email}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--admin-accent)', marginTop: '0.25rem' }}>
                        {commerce.segmento && <span>Segmento: {commerce.segmento}</span>}
                        {commerce.contribuicoes && commerce.contribuicoes.length > 0 && (
                          <span> • {commerce.contribuicoes.length} contribuições</span>
                        )}
                      </div>
                    </td>
                    <td><code>{commerce.cnpj}</code></td>
                    <td>{new Date(commerce.created_at || commerce.createdAt || Date.now()).toLocaleDateString('pt-BR')}</td>
                    <td>{getStatusBadge(commerce.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => { setSelectedCommerce(commerce); }} className="admin-action-btn">
                        <Eye size={16} /> Detalhes
                      </button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={6} className="empty-state">Nenhum comércio encontrado com os filtros atuais.</td></tr>
              ) : activeTab === 'citizens' ? (
                processedProfiles.length > 0 ? processedProfiles.map((citizen) => (
                  <tr key={citizen.id} className={selectedItems.includes(citizen.id) ? 'selected-row' : ''}>
                    <td>
                      <input type="checkbox" checked={selectedItems.includes(citizen.id)} onChange={() => handleSelectItem(citizen.id)} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: '36px', height: '36px', background: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                          <UserCircle size={18} color="#15803d" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{citizen.nome || citizen.nomeCompleto}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>{citizen.email}</div>
                          {citizen.interesses && citizen.interesses.length > 0 && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--admin-success)', marginTop: '0.25rem' }}>
                              {citizen.interesses.slice(0, 2).join(', ')}{citizen.interesses.length > 2 && '...'}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td><code>{citizen.cpf || '---'}</code></td>
                    <td>
                      <div>{citizen.telefone || '---'}</div>
                      {citizen.ocupacao && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--admin-secondary)' }}>Ocupação: {citizen.ocupacao}</div>
                      )}
                    </td>
                    <td>{getStatusBadge(citizen.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => { setSelectedProfile(citizen); setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false }); }} className="admin-action-btn">
                        <Eye size={16} /> Detalhes
                      </button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={6} className="empty-state">Nenhum cidadão encontrado com os filtros atuais.</td></tr>
              ) : activeTab === 'families' ? (
                processedProfiles.length > 0 ? processedProfiles.map((profile) => (
                  <tr key={profile.id} className={selectedItems.includes(profile.id) ? 'selected-row' : ''}>
                    <td>
                      <input type="checkbox" checked={selectedItems.includes(profile.id)} onChange={() => handleSelectItem(profile.id)} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: '36px', height: '36px', background: '#fff7ed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                          <Users size={18} color="#c2410c" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{profile.nomeCompleto || profile.nome}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--admin-secondary)' }}>{profile.email}</div>
                          {profile.necessidades && profile.necessidades.length > 0 && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--admin-danger)', marginTop: '0.25rem' }}>
                              {profile.necessidades.slice(0, 2).join(', ')}{profile.necessidades.length > 2 && '...'}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td><code>{profile.cpf || profile.nis || '---'}</code></td>
                    <td>
                      <div>{profile.telefone || '---'}</div>
                      {profile.rendaFamiliar && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--admin-secondary)' }}>Renda: {profile.rendaFamiliar}</div>
                      )}
                    </td>
                    <td>{getStatusBadge(profile.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => { setSelectedProfile(profile); setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false }); }} className="admin-action-btn">
                        <Eye size={16} /> Detalhes
                      </button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={6} className="empty-state">Nenhuma família encontrada com os filtros atuais.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
        </>
        )}
      </main>

      {/* Modals */}
      {selectedOng && (
        <div className="modal-overlay" onClick={() => setSelectedOng(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes da ONG</h2>
              <button onClick={() => setSelectedOng(null)} className="modal-close">
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Nome/Razão Social:</label>
                  <span>{selectedOng.razaoSocial || selectedOng.nome || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>CNPJ:</label>
                  <span>{selectedOng.cnpj || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedOng.email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Telefone:</label>
                  <span>{selectedOng.telefone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span>{getStatusBadge(selectedOng.status)}</span>
                </div>
                <div className="detail-item">
                  <label>Data de Cadastro:</label>
                  <span>{new Date(selectedOng.createdAt || selectedOng.created_at || Date.now()).toLocaleDateString('pt-BR')}</span>
                </div>
                {selectedOng.endereco && (
                  <div className="detail-item full-width">
                    <label>Endereço:</label>
                    <span>{selectedOng.endereco}</span>
                  </div>
                )}
                {selectedOng.descricao && (
                  <div className="detail-item full-width">
                    <label>Descrição:</label>
                    <span>{selectedOng.descricao}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedOng(null)} className="btn-secondary">Fechar</button>
              {selectedOng.status !== 'analyzed' && (
                <button 
                  onClick={() => handleConfirmAnalysis(selectedOng, 'ong')} 
                  className="btn-primary"
                  disabled={loading}
                >
                  <CheckCircle size={16} /> Confirmar Análise
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedCommerce && (
        <div className="modal-overlay" onClick={() => setSelectedCommerce(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do Comércio</h2>
              <button onClick={() => setSelectedCommerce(null)} className="modal-close">
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Nome do Estabelecimento:</label>
                  <span>{selectedCommerce.nomeEstabelecimento || selectedCommerce.nome || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>CNPJ:</label>
                  <span>{selectedCommerce.cnpj || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedCommerce.email || selectedCommerce.contato?.email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Telefone:</label>
                  <span>{selectedCommerce.telefone || selectedCommerce.contato?.telefone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span>{getStatusBadge(selectedCommerce.status)}</span>
                </div>
                <div className="detail-item">
                  <label>Data de Cadastro:</label>
                  <span>{new Date(selectedCommerce.createdAt || selectedCommerce.created_at || Date.now()).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedCommerce(null)} className="btn-secondary">Fechar</button>
              {selectedCommerce.status !== 'analyzed' && (
                <button 
                  onClick={() => handleConfirmAnalysis(selectedCommerce, 'commerce')} 
                  className="btn-primary"
                  disabled={loading}
                >
                  <CheckCircle size={16} /> Confirmar Análise
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedProfile && (
        <div className="modal-overlay" onClick={() => setSelectedProfile(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes {selectedProfile._type === 'family' ? 'da Família' : 'do Cidadão'}</h2>
              <button onClick={() => setSelectedProfile(null)} className="modal-close">
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Nome:</label>
                  <span>{selectedProfile.nome || selectedProfile.nomeCompleto || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>CPF:</label>
                  <span>{selectedProfile.cpf || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedProfile.email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Telefone:</label>
                  <span>{selectedProfile.telefone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span>{getStatusBadge(selectedProfile.status)}</span>
                </div>
                <div className="detail-item">
                  <label>Data de Cadastro:</label>
                  <span>{new Date(selectedProfile.createdAt || selectedProfile.created_at || Date.now()).toLocaleDateString('pt-BR')}</span>
                </div>
                {selectedProfile._type === 'family' && selectedProfile.rendaFamiliar && (
                  <div className="detail-item">
                    <label>Renda Familiar:</label>
                    <span>{selectedProfile.rendaFamiliar}</span>
                  </div>
                )}
                {selectedProfile._type === 'family' && selectedProfile.necessidades && (
                  <div className="detail-item full-width">
                    <label>Necessidades:</label>
                    <span>{selectedProfile.necessidades.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedProfile(null)} className="btn-secondary">Fechar</button>
              {selectedProfile.status !== 'analyzed' && (
                <button 
                  onClick={() => handleConfirmAnalysis(selectedProfile, selectedProfile._type === 'family' ? 'family' : 'citizen')} 
                  className="btn-primary"
                  disabled={loading}
                >
                  <CheckCircle size={16} /> Confirmar Análise
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}