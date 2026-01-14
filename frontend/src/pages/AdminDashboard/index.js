import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
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
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  LayoutDashboard, Building2, Users, 
  ShieldCheck, LogOut, Search, Filter,
  Eye, CheckCircle, XCircle, FileText,
  MapPin, Globe, Mail, Phone, Calendar,
  ExternalLink, X, User, Fingerprint,
  Key, Shield, Hash, Map, UserCircle,
  Bell, AlertCircle, Clock, ArrowRight,
  Heart, Briefcase, Store, GraduationCap,
  Zap, Target, Sparkles, DollarSign,
  Home, Users2, ListChecks
} from 'lucide-react';
import './styles.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Real API service
const apiService = {
  async request(endpoint) {
    const token = localStorage.getItem('solidar-token');
    try {
      const response = await fetch(`http://localhost:3001/api${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Resposta não-JSON:', text);
        throw new Error(`Servidor retornou ${response.status}. Resposta: ${text.substring(0, 100)}`);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Erro na API:', data);
        throw new Error(data.error || `Erro HTTP: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erro na requisição:', { endpoint, error: error.message });
      throw error;
    }
  },
  
  async updateStatus(entityType, entityId, status, reason) {
    const token = localStorage.getItem('solidar-token');
    const response = await fetch(`http://localhost:3001/api/admin/entity/${entityType}/${entityId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, reason })
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar status');
    }
    
    return await response.json();
  }
};

export default function AdminDashboard() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ongs, setOngs] = useState([]);
  const [commerces, setCommerces] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOng, setSelectedOng] = useState(null);
  const [selectedCommerce, setSelectedCommerce] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [stats, setStats] = useState({ 
    pendingOngs: 0, 
    pendingCommerces: 0,
    pendingFamilies: 0,
    pendingCitizens: 0,
    totalOngs: 0,
    totalCommerces: 0,
    totalFamilies: 0,
    totalCitizens: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [evaluationChecklist, setEvaluationChecklist] = useState({
    check1: false,
    check2: false,
    check3: false,
    check4: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'dashboard') {
      await Promise.all([fetchOngs(), fetchCommerces(), fetchProfiles()]);
    } else if (activeTab === 'ongs') {
      await fetchOngs();
    } else if (activeTab === 'commerces') {
      await fetchCommerces();
    } else {
      await fetchProfiles();
    }
    setLoading(false);
  };

  const fetchOngs = async () => {
    try {
      const response = await apiService.request('/admin/entities/ongs');
      const data = response.data || [];
      setOngs(data);
      const pending = data.filter(o => o.status === 'pending').length;
      setStats(prev => ({ ...prev, pendingOngs: pending, totalOngs: data.length }));
    } catch (error) {
      console.error('Error fetching ONGs:', error);
      setOngs([]);
    }
  };

  const fetchCommerces = async () => {
    try {
      const response = await apiService.request('/admin/entities/comercios');
      const data = response.data || [];
      setCommerces(data);
      const pending = data.filter(c => c.status === 'pending').length;
      setStats(prev => ({ ...prev, pendingCommerces: pending, totalCommerces: data.length }));
    } catch (error) {
      console.error('Error fetching commerces:', error);
      setCommerces([]);
    }
  };

  const fetchProfiles = async () => {
    try {
      const [familiasResponse, cidadaosResponse] = await Promise.all([
        apiService.request('/admin/entities/familias'),
        apiService.request('/admin/entities/cidadaos')
      ]);
      
      const familias = familiasResponse.data || [];
      const cidadaos = cidadaosResponse.data || [];
      
      if (activeTab === 'families') {
        setProfiles(familias);
      } else if (activeTab === 'citizens') {
        setProfiles(cidadaos);
      } else {
        setProfiles([...familias, ...cidadaos]);
      }
      
      const pendingFamilies = familias.filter(f => f.status === 'pending').length;
      const pendingCitizens = cidadaos.filter(c => c.status === 'pending').length;
      
      setStats(prev => ({ 
        ...prev, 
        totalFamilies: familias.length, 
        pendingFamilies,
        totalCitizens: cidadaos.length,
        pendingCitizens
      }));
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setProfiles([]);
    }
  };

  const handleUpdateStatus = async (id, status, type, reason) => {
    try {
      await apiService.updateStatus(type, id, status, reason);
      
      if (type === 'ongs') fetchOngs();
      else if (type === 'comercios') fetchCommerces();
      else fetchProfiles();
      
      setSelectedOng(null);
      setSelectedCommerce(null);
      setSelectedProfile(null);
      setIsRejecting(false);
      setRejectionReason('');
      setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false });
      
      alert(`${type === 'ongs' ? 'ONG' : type === 'comercios' ? 'Comércio' : type === 'cidadaos' ? 'Cidadão' : 'Família'} ${status === 'verified' ? 'aprovado' : 'rejeitado'} com sucesso!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erro ao atualizar status. Tente novamente.');
    }
  };

  const handleLogout = () => {
    // Clear any auth tokens/data
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const filteredOngs = ongs.filter(ong => 
    ong.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ong.razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ong.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ong.cnpj?.includes(searchTerm) ||
    ong.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommerces = commerces.filter(commerce => 
    commerce.nomeEstabelecimento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commerce.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commerce.cnpj?.includes(searchTerm) ||
    commerce.contato?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commerce.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingOngs = ongs.filter(o => o.status === 'pending');
  const pendingCommerces = commerces.filter(c => c.status === 'pending');

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = 
      profile.nomeCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.cpf?.includes(searchTerm);
    
    return matchesSearch;
  });

  // Render mobile version if on mobile device
  if (isMobile) {
    return <DashboardMobile />;
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="nav-brand">
          <div className="brand-logo-wrapper">
            <div className="admin-logo-box">
              <ShieldCheck size={24} color="white" />
            </div>
            <div className="brand-decoration"></div>
          </div>
          <div className="brand-text">
            <span className="brand-name">Solidar</span>
            <span className="brand-subname">Admin</span>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div 
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false }); }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`admin-nav-item ${activeTab === 'ongs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('ongs'); setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false }); }}
          >
            <Building2 size={20} />
            <span>ONGs</span>
          </div>
          <div 
            className={`admin-nav-item ${activeTab === 'commerces' ? 'active' : ''}`}
            onClick={() => { setActiveTab('commerces'); setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false }); }}
          >
            <Store size={20} />
            <span>Comércios</span>
          </div>
          <div 
            className={`admin-nav-item ${activeTab === 'families' ? 'active' : ''}`}
            onClick={() => { setActiveTab('families'); setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false }); }}
          >
            <Users size={20} />
            <span>Famílias</span>
          </div>
          <div 
            className={`admin-nav-item ${activeTab === 'citizens' ? 'active' : ''}`}
            onClick={() => { setActiveTab('citizens'); setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false }); }}
          >
            <UserCircle size={20} />
            <span>Cidadãos</span>
          </div>
        </nav>

        <button onClick={handleLogout} className="admin-nav-item" style={{ background: 'transparent', border: 'none', width: '100%', marginTop: 'auto' }}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="admin-page-title">
              {activeTab === 'dashboard' ? 'Dashboard Geral' :
               activeTab === 'ongs' ? 'Gestão de ONGs' : 
               activeTab === 'commerces' ? 'Gestão de Comércios' :
               activeTab === 'families' ? 'Gestão de Famílias' : 'Gestão de Cidadãos'}
            </h1>
            <p style={{ color: 'var(--admin-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {activeTab === 'dashboard' ? 'Visão geral de todos os cadastros e estatísticas' : 'Painel administrativo do Solidar Bairro'}
            </p>
          </div>
          
          <div className="admin-header-actions">
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`notification-trigger ${(pendingOngs.length + pendingCommerces.length + stats.pendingFamilies + stats.pendingCitizens) > 0 ? 'has-notifications' : ''}`}
              >
                <Bell size={22} />
                {(pendingOngs.length + pendingCommerces.length + stats.pendingFamilies + stats.pendingCitizens) > 0 && (
                  <span className="notification-badge">{pendingOngs.length + pendingCommerces.length + stats.pendingFamilies + stats.pendingCitizens}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown animate-scale-in">
                  <div className="notification-header">
                    <h3>Pendências</h3>
                    <span className="badge-count">Aguardando</span>
                  </div>
                  <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {pendingOngs.length === 0 && pendingCommerces.length === 0 && stats.pendingFamilies === 0 && stats.pendingCitizens === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-secondary)' }}>
                        <Sparkles size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                        <p>Tudo em dia!</p>
                      </div>
                    ) : (
                      <>
                        {pendingOngs.map(ong => (
                          <div key={ong.id} className="notification-item" onClick={() => { setSelectedOng(ong); setActiveTab('ongs'); setShowNotifications(false); }}>
                            <div className="notification-icon" style={{ background: '#fef3c7', color: '#92400e' }}><Building2 size={18} /></div>
                            <div className="notification-content">
                              <p className="notification-title">ONG: {ong.razaoSocial || ong.razao_social || ong.nome_fantasia}</p>
                              <p className="notification-desc">Aguardando aprovação</p>
                            </div>
                          </div>
                        ))}
                        {pendingCommerces.map(commerce => (
                          <div key={commerce.id} className="notification-item" onClick={() => { setSelectedCommerce(commerce); setActiveTab('commerces'); setShowNotifications(false); }}>
                            <div className="notification-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}><Store size={18} /></div>
                            <div className="notification-content">
                              <p className="notification-title">Comércio: {commerce.nomeEstabelecimento || commerce.nome_fantasia}</p>
                              <p className="notification-desc">Novo pedido de parceria</p>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-user-info-card">
              <div className="admin-user-details">
                <div className="admin-user-name-row">
                  <p className="admin-user-name">Administrador</p>
                  <div className="admin-user-score" title="Nível de Acesso">
                    <Sparkles size={12} />
                    <span>Admin</span>
                  </div>
                </div>
                <div className="admin-user-access-badge">
                  <Shield size={10} />
                  <span>Acesso Total</span>
                </div>
              </div>
              <div className="admin-avatar-wrapper">
                <div className="admin-avatar-box">
                  <User size={20} />
                </div>
                <div className="admin-status-indicator online"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="admin-stats-grid">
          {activeTab === 'dashboard' ? (
            <>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#f3e8ff', color: '#8b5cf6' }}><Building2 size={24} /></div>
                <div className="admin-stat-info"><h3>ONGs</h3><p>{stats.totalOngs}</p><small style={{ color: 'var(--admin-warning)' }}>{stats.pendingOngs} pendentes</small></div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><Store size={24} /></div>
                <div className="admin-stat-info"><h3>Comércios</h3><p>{stats.totalCommerces}</p><small style={{ color: 'var(--admin-warning)' }}>{stats.pendingCommerces} pendentes</small></div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#fff7ed', color: '#f97316' }}><Users size={24} /></div>
                <div className="admin-stat-info"><h3>Famílias</h3><p>{stats.totalFamilies}</p><small style={{ color: 'var(--admin-warning)' }}>{stats.pendingFamilies} pendentes</small></div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#f0fdf4', color: '#15803d' }}><UserCircle size={24} /></div>
                <div className="admin-stat-info"><h3>Cidadãos</h3><p>{stats.totalCitizens}</p><small style={{ color: 'var(--admin-warning)' }}>{stats.pendingCitizens} pendentes</small></div>
              </div>
            </>
          ) : activeTab === 'ongs' ? (
            <>
              <div className={`admin-stat-card ${stats.pendingOngs > 0 ? 'pulse-urgent' : ''}`}>
                <div className="admin-stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}><Clock size={24} /></div>
                <div className="admin-stat-info"><h3>Pendentes</h3><p>{stats.pendingOngs}</p></div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}><Building2 size={24} /></div>
                <div className="admin-stat-info"><h3>Total ONGs</h3><p>{stats.totalOngs}</p></div>
              </div>
            </>
          ) : activeTab === 'commerces' ? (
            <>
              <div className={`admin-stat-card ${stats.pendingCommerces > 0 ? 'pulse-urgent' : ''}`}>
                <div className="admin-stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}><Clock size={24} /></div>
                <div className="admin-stat-info"><h3>Aguardando</h3><p>{stats.pendingCommerces}</p></div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}><Store size={24} /></div>
                <div className="admin-stat-info"><h3>Parceiros</h3><p>{stats.totalCommerces}</p></div>
              </div>
            </>
          ) : activeTab === 'families' ? (
            <>
              <div className={`admin-stat-card ${stats.pendingFamilies > 0 ? 'pulse-urgent' : ''}`}>
                <div className="admin-stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}><Clock size={24} /></div>
                <div className="admin-stat-info"><h3>Avaliações</h3><p>{stats.pendingFamilies}</p></div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#fff7ed', color: '#c2410c' }}><Users size={24} /></div>
                <div className="admin-stat-info"><h3>Famílias</h3><p>{stats.totalFamilies}</p></div>
              </div>
            </>
          ) : (
            <>
              <div className={`admin-stat-card ${stats.pendingCitizens > 0 ? 'pulse-urgent' : ''}`}>
                <div className="admin-stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}><Clock size={24} /></div>
                <div className="admin-stat-info"><h3>Novos</h3><p>{stats.pendingCitizens}</p></div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#f0fdf4', color: '#15803d' }}><UserCircle size={24} /></div>
                <div className="admin-stat-info"><h3>Cidadãos</h3><p>{stats.totalCitizens}</p></div>
              </div>
            </>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div className="input-with-icon" style={{ flex: 1 }}>
            <Search className="field-icon" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..."
              className="admin-input" 
              style={{ width: '100%', paddingLeft: '2.75rem' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <div className="dashboard-overview">
            <div className="dashboard-grid">
              <div className="dashboard-section">
                <h3 className="dashboard-section-title">
                  <Clock size={18} color="var(--admin-warning)" /> 
                  Pendentes de Aprovação 
                  <span className="pending-count-badge">{pendingOngs.length + pendingCommerces.length + stats.pendingFamilies + stats.pendingCitizens}</span>
                </h3>
                <div className="dashboard-pending-list">
                  {pendingOngs.map(ong => (
                    <div key={ong.id} className="dashboard-pending-item" onClick={() => { setSelectedOng(ong); setActiveTab('ongs'); }}>
                      <div className="pending-icon ong-icon"><Building2 size={16} /></div>
                      <div className="pending-info">
                        <span className="pending-name">{ong.razaoSocial || ong.razao_social || ong.nome_fantasia}</span>
                        <span className="pending-type">ONG</span>
                      </div>
                      <div className="pending-badge">Novo</div>
                      <ArrowRight size={14} />
                    </div>
                  ))}
                  {pendingCommerces.map(commerce => (
                    <div key={commerce.id} className="dashboard-pending-item" onClick={() => { setSelectedCommerce(commerce); setActiveTab('commerces'); }}>
                      <div className="pending-icon commerce-icon"><Store size={16} /></div>
                      <div className="pending-info">
                        <span className="pending-name">{commerce.nomeEstabelecimento || commerce.nome_fantasia}</span>
                        <span className="pending-type">Comércio</span>
                      </div>
                      <div className="pending-badge">Parceria</div>
                      <ArrowRight size={14} />
                    </div>
                  ))}
                  {profiles.filter(p => p.status === 'pending' && (p.nomeCompleto || p.necessidades)).map(profile => (
                    <div key={profile.id} className="dashboard-pending-item" onClick={() => { setSelectedProfile(profile); setActiveTab('families'); }}>
                      <div className="pending-icon family-icon"><Users size={16} /></div>
                      <div className="pending-info">
                        <span className="pending-name">{profile.nomeCompleto}</span>
                        <span className="pending-type">Família</span>
                      </div>
                      <div className="pending-badge">Cadastro</div>
                      <ArrowRight size={14} />
                    </div>
                  ))}
                  {profiles.filter(p => p.status === 'pending' && p.nome && !p.nomeCompleto).map(citizen => (
                    <div key={citizen.id} className="dashboard-pending-item" onClick={() => { setSelectedProfile(citizen); setActiveTab('citizens'); }}>
                      <div className="pending-icon family-icon"><UserCircle size={16} /></div>
                      <div className="pending-info">
                        <span className="pending-name">{citizen.nome}</span>
                        <span className="pending-type">Cidadão</span>
                      </div>
                      <div className="pending-badge">Cadastro</div>
                      <ArrowRight size={14} />
                    </div>
                  ))}
                  {(pendingOngs.length + pendingCommerces.length + stats.pendingFamilies + stats.pendingCitizens) === 0 && (
                    <div className="dashboard-empty">
                      <CheckCircle size={32} color="var(--admin-success)" />
                      <p>Todas as solicitações foram processadas!</p>
                      <small>Nenhuma pendência no momento</small>
                    </div>
                  )}
                </div>
                <div className="pending-summary">
                  <div className="summary-item">
                    <span className="summary-number">{pendingOngs.length}</span>
                    <span className="summary-label">ONGs</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-number">{pendingCommerces.length}</span>
                    <span className="summary-label">Comércios</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-number">{stats.pendingFamilies}</span>
                    <span className="summary-label">Famílias</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-number">{stats.pendingCitizens}</span>
                    <span className="summary-label">Cidadãos</span>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-section">
                <h3 className="dashboard-section-title">
                  <Target size={18} color="var(--admin-success)" /> 
                  Resumo de Atividades
                  <span className="activity-status-badge">
                    {stats.pendingOngs + stats.pendingCommerces + stats.pendingFamilies + stats.pendingCitizens > 0 ? 'Ativo' : 'Em Dia'}
                  </span>
                </h3>
                <div className="dashboard-activity-grid">
                  <div className="activity-card total-card">
                    <div className="activity-icon"><Users2 size={18} /></div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <div className="activity-number">{stats.totalOngs + stats.totalCommerces + stats.totalFamilies + stats.totalCitizens}</div>
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
                        <div className="activity-number">{stats.pendingOngs + stats.pendingCommerces + stats.pendingFamilies + stats.pendingCitizens}</div>
                        <div className={`activity-trend ${stats.pendingOngs + stats.pendingCommerces + stats.pendingFamilies + stats.pendingCitizens > 0 ? 'urgent' : 'ok'}`}>
                          {stats.pendingOngs + stats.pendingCommerces + stats.pendingFamilies + stats.pendingCitizens > 0 ? '⚠️' : '✅'}
                        </div>
                      </div>
                      <div className="activity-label">Aguardando Análise</div>
                      <div className="activity-subtitle">{stats.pendingOngs + stats.pendingCommerces + stats.pendingFamilies + stats.pendingCitizens > 0 ? 'Requer atenção' : 'Tudo em dia'}</div>
                    </div>
                  </div>
                  <div className="activity-card approved-card">
                    <div className="activity-icon success"><CheckCircle size={18} /></div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <div className="activity-number">{(stats.totalOngs - stats.pendingOngs) + (stats.totalCommerces - stats.pendingCommerces) + (stats.totalFamilies - stats.pendingFamilies) + (stats.totalCitizens - stats.pendingCitizens)}</div>
                        <div className="activity-trend percentage">{Math.round(((stats.totalOngs - stats.pendingOngs) + (stats.totalCommerces - stats.pendingCommerces) + (stats.totalFamilies - stats.pendingFamilies) + (stats.totalCitizens - stats.pendingCitizens)) / Math.max(1, stats.totalOngs + stats.totalCommerces + stats.totalFamilies + stats.totalCitizens) * 100)}%</div>
                      </div>
                      <div className="activity-label">Aprovados</div>
                      <div className="activity-subtitle">Taxa de aprovação</div>
                    </div>
                  </div>
                </div>
                <div className="activity-progress">
                  <div className="progress-header">
                    <span>Taxa de Processamento</span>
                    <span className="progress-percentage">{Math.round(((stats.totalOngs - stats.pendingOngs) + (stats.totalCommerces - stats.pendingCommerces) + (stats.totalFamilies - stats.pendingFamilies) + (stats.totalCitizens - stats.pendingCitizens)) / Math.max(1, stats.totalOngs + stats.totalCommerces + stats.totalFamilies + stats.totalCitizens) * 100)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.round(((stats.totalOngs - stats.pendingOngs) + (stats.totalCommerces - stats.pendingCommerces) + (stats.totalFamilies - stats.pendingFamilies) + (stats.totalCitizens - stats.pendingCitizens)) / Math.max(1, stats.totalOngs + stats.totalCommerces + stats.totalFamilies + stats.totalCitizens) * 100)}%` }}></div>
                  </div>
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
                        data: [stats.totalOngs, stats.totalCommerces, stats.totalFamilies, stats.totalCitizens],
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
              <div className="chart-section">
                <h3 className="dashboard-section-title"><Target size={18} color="var(--admin-success)" /> Status de Aprovação</h3>
                <div className="chart-wrapper">
                  <Doughnut
                    data={{
                      labels: ['Aprovados', 'Pendentes'],
                      datasets: [{
                        data: [
                          (stats.totalOngs - stats.pendingOngs) + (stats.totalCommerces - stats.pendingCommerces) + (stats.totalFamilies - stats.pendingFamilies) + (stats.totalCitizens - stats.pendingCitizens),
                          stats.pendingOngs + stats.pendingCommerces + stats.pendingFamilies + stats.pendingCitizens
                        ],
                        backgroundColor: ['rgba(21, 128, 61, 0.8)', 'rgba(249, 115, 22, 0.8)'],
                        borderColor: ['#15803d', '#f97316'],
                        borderWidth: 3,
                        hoverBorderWidth: 4
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '60%',
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { 
                            padding: 15, 
                            usePointStyle: true,
                            color: '#64748b',
                            font: { weight: 600 }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          titleColor: 'white',
                          bodyColor: 'white',
                          borderColor: '#6366f1',
                          borderWidth: 1,
                          cornerRadius: 8
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
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                {activeTab === 'ongs' || activeTab === 'commerces' ? (
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Data Cadastro</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              ) : (
                <tr>
                  <th>Nome</th>
                  <th>Documento</th>
                  <th>Contato</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              )}
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '4rem' }}>
                  <div className="animate-pulse-custom">Carregando...</div>
                </td></tr>
              ) : activeTab === 'ongs' ? (
                filteredOngs.map((ong) => (
                  <tr key={ong.id}>
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
                    <td><span className={`status-badge ${ong.status || 'pending'}`}>{(ong.status || 'pending') === 'pending' ? 'Pendente' : ong.status === 'verified' ? 'Verificada' : 'Rejeitada'}</span></td>
                    <td><button onClick={() => { setSelectedOng(ong); setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false }); }} className="admin-action-btn"><Eye size={16} /> Avaliar</button></td>
                  </tr>
                ))
              ) : activeTab === 'commerces' ? (
                filteredCommerces.map((commerce) => (
                  <tr key={commerce.id}>
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
                    <td><span className={`status-badge ${commerce.status || 'pending'}`}>{(commerce.status || 'pending') === 'pending' ? 'Pendente' : commerce.status === 'verified' ? 'Verificado' : 'Rejeitado'}</span></td>
                    <td><button onClick={() => { setSelectedCommerce(commerce); setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false }); }} className="admin-action-btn"><Eye size={16} /> Avaliar</button></td>
                  </tr>
                ))
              ) : activeTab === 'citizens' ? (
                filteredProfiles.map((citizen) => (
                  <tr key={citizen.id}>
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
                    <td><span className={`status-badge ${citizen.status || 'pending'}`}>{citizen.status === 'pending' ? 'Pendente' : citizen.status === 'verified' ? 'Verificado' : citizen.status === 'rejected' ? 'Rejeitado' : 'Pendente'}</span></td>
                    <td><button onClick={() => { setSelectedProfile(citizen); setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false }); }} className="admin-action-btn"><Eye size={16} /> Detalhes</button></td>
                  </tr>
                ))
              ) : activeTab === 'families' ? (
                filteredProfiles.map((profile) => (
                  <tr key={profile.id}>
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
                    <td><span className={`status-badge ${profile.status || 'pending'}`}>{(profile.status || 'pending') === 'pending' ? 'Pendente' : profile.status === 'verified' ? 'Verificado' : 'Rejeitado'}</span></td>
                    <td><button onClick={() => { setSelectedProfile(profile); setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false }); }} className="admin-action-btn"><Eye size={16} /> Detalhes</button></td>
                  </tr>
                ))
              ) : null}
              {!loading && filteredOngs.length === 0 && activeTab === 'ongs' && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-secondary)' }}>Nenhuma ONG encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </main>

      {/* Modals */}
      {selectedOng && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content animate-scale-in">
            <header className="admin-modal-header" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', color: 'white' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedOng.razaoSocial || selectedOng.razao_social || selectedOng.nome_fantasia || selectedOng.nomeFantasia}</h2>
                <p style={{ opacity: 0.8, fontSize: '0.75rem' }}>Avaliação Institucional</p>
              </div>
              <button onClick={() => setSelectedOng(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: 'white', width: '32px', height: '32px', borderRadius: '8px' }}><X size={20} /></button>
            </header>

            <div className="admin-modal-body">
              <div className="detail-section">
                <h3 className="detail-section-title"><Building2 size={18} /> Dados Institucionais</h3>
                <div className="detail-grid">
                  <div className="detail-item"><label>Nome Fantasia</label><p>{selectedOng.razaoSocial || selectedOng.razao_social || selectedOng.nome_fantasia || selectedOng.nomeFantasia}</p></div>
                  <div className="detail-item"><label>Razão Social</label><p>{selectedOng.razao_social || selectedOng.razaoSocial || '---'}</p></div>
                  <div className="detail-item"><label>CNPJ</label><p>{selectedOng.cnpj}</p></div>
                  <div className="detail-item"><label>Data Fundação</label><p>{selectedOng.data_fundacao ? new Date(selectedOng.data_fundacao).toLocaleDateString('pt-BR') : '---'}</p></div>
                  <div className="detail-item"><label>E-mail</label><p>{selectedOng.email}</p></div>
                  <div className="detail-item"><label>Telefone</label><p>{selectedOng.telefone}</p></div>
                  <div className="detail-item" style={{ gridColumn: 'span 2' }}><label>Website</label><p>{selectedOng.website || '---'}</p></div>
                  <div className="detail-item" style={{ gridColumn: 'span 2' }}><label>Sede</label><p>{selectedOng.sede || '---'}</p></div>
                </div>
              </div>

              {selectedOng.causas && selectedOng.causas.length > 0 && (
                <div className="detail-section">
                  <h3 className="detail-section-title"><Heart size={18} /> Causas e Atuação</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedOng.causas.map((causa, i) => (
                      <span key={i} style={{ background: '#f3e8ff', color: '#7c3aed', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>{causa}</span>
                    ))}
                  </div>
                  {selectedOng.areas_cobertura && (
                    <div className="detail-item" style={{ marginTop: '1rem' }}><label>Áreas de Cobertura</label><p>{selectedOng.areas_cobertura.join(', ')}</p></div>
                  )}
                </div>
              )}

              {(selectedOng.num_voluntarios || selectedOng.colaboradores_fixos) && (
                <div className="detail-section">
                  <h3 className="detail-section-title"><Users size={18} /> Equipe</h3>
                  <div className="detail-grid">
                    <div className="detail-item"><label>Voluntários</label><p>{selectedOng.num_voluntarios || 0}</p></div>
                    <div className="detail-item"><label>Colaboradores Fixos</label><p>{selectedOng.colaboradores_fixos || 0}</p></div>
                  </div>
                </div>
              )}

              <div className="detail-section" style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1.5rem' }}>
                <h3 className="detail-section-title" style={{ border: 'none' }}><ShieldCheck size={18} color="var(--admin-accent)" /> Checklist de Verificação</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check1: !p.check1 }))}><input type="checkbox" checked={evaluationChecklist.check1} readOnly/><label>CNPJ validado na Receita Federal</label></div>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check2: !p.check2 }))}><input type="checkbox" checked={evaluationChecklist.check2} readOnly/><label>Documentos institucionais verificados</label></div>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check3: !p.check3 }))}><input type="checkbox" checked={evaluationChecklist.check3} readOnly/><label>Histórico de atuação comprovado</label></div>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check4: !p.check4 }))}><input type="checkbox" checked={evaluationChecklist.check4} readOnly/><label>Contatos e endereço verificados</label></div>
                </div>
              </div>

              {isRejecting && (
                <div className="detail-section animate-scale-in">
                  <label className="admin-label" style={{ color: 'var(--admin-danger)' }}>Motivo da Rejeição</label>
                  <textarea className="admin-input" placeholder="Descreva os motivos..." style={{ minHeight: '100px', marginTop: '0.5rem' }} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                </div>
              )}
            </div>

            <footer className="admin-modal-footer">
              <button onClick={() => { setSelectedOng(null); setIsRejecting(false); }} className="admin-action-btn btn-close"><X size={18} /><span>Fechar</span></button>
              {!isRejecting ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setIsRejecting(true)} className="admin-action-btn btn-reject"><XCircle size={18} /><span>Rejeitar</span></button>
                  <button onClick={() => handleUpdateStatus(selectedOng.id, 'verified', 'ongs')} className="admin-action-btn btn-approve" disabled={!evaluationChecklist.check1 || !evaluationChecklist.check2 || !evaluationChecklist.check3 || !evaluationChecklist.check4}><CheckCircle size={18} /><span>Aprovar ONG</span></button>
                </div>
              ) : (
                <button onClick={() => handleUpdateStatus(selectedOng.id, 'rejected', 'ongs', rejectionReason)} className="admin-action-btn btn-reject" disabled={!rejectionReason.trim()}><AlertCircle size={18} /><span>Confirmar Rejeição</span></button>
              )}
            </footer>
          </div>
        </div>
      )}

      {selectedCommerce && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content animate-scale-in">
            <header className="admin-modal-header" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)', color: 'white' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedCommerce.nomeEstabelecimento || selectedCommerce.nome_fantasia || selectedCommerce.nomeFantasia}</h2>
                <p style={{ opacity: 0.8, fontSize: '0.75rem' }}>Verificação de Parceiro</p>
              </div>
              <button onClick={() => setSelectedCommerce(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: 'white', width: '32px', height: '32px', borderRadius: '8px' }}><X size={20} /></button>
            </header>

            <div className="admin-modal-body">
              <div className="detail-section">
                <h3 className="detail-section-title"><Store size={18} /> Dados do Comércio</h3>
                <div className="detail-grid">
                  <div className="detail-item"><label>Nome Fantasia</label><p>{selectedCommerce.nomeEstabelecimento || selectedCommerce.nome_fantasia || selectedCommerce.nomeFantasia}</p></div>
                  <div className="detail-item"><label>CNPJ</label><p>{selectedCommerce.cnpj}</p></div>
                  <div className="detail-item"><label>Segmento</label><p>{selectedCommerce.descricaoAtividade || selectedCommerce.segmento || '---'}</p></div>
                  <div className="detail-item"><label>Responsável</label><p>{selectedCommerce.responsavel?.nome || selectedCommerce.responsavel_legal || selectedCommerce.responsavelLegal || '---'}</p></div>
                  <div className="detail-item"><label>Telefone</label><p>{selectedCommerce.contato?.telefone || selectedCommerce.telefone}</p></div>
                  <div className="detail-item"><label>E-mail</label><p>{selectedCommerce.contato?.email || selectedCommerce.email}</p></div>
                  <div className="detail-item" style={{ gridColumn: 'span 2' }}><label>Endereço</label><p>{typeof selectedCommerce.endereco === 'object' ? `${selectedCommerce.endereco.endereco || ''}, ${selectedCommerce.endereco.bairro || ''} - ${selectedCommerce.endereco.cidade || ''}/${selectedCommerce.endereco.uf || ''}` : (selectedCommerce.endereco || '---')}</p></div>
                </div>
              </div>

              {selectedCommerce.contribuicoes && selectedCommerce.contribuicoes.length > 0 && (
                <div className="detail-section">
                  <h3 className="detail-section-title"><Heart size={18} /> Formas de Contribuição</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {selectedCommerce.contribuicoes.map((item, idx) => (
                      <div key={idx} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.75rem 1.25rem', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 700, color: '#1e40af' }}>
                        <CheckCircle size={16} style={{ marginRight: '0.5rem', color: 'var(--admin-success)' }} />{item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section" style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1.5rem' }}>
                <h3 className="detail-section-title" style={{ border: 'none' }}><Shield size={18} color="var(--admin-accent)" /> Checklist de Verificação</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check1: !p.check1 }))}><input type="checkbox" checked={evaluationChecklist.check1} readOnly/><label>CNPJ ativo e regularizado</label></div>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check2: !p.check2 }))}><input type="checkbox" checked={evaluationChecklist.check2} readOnly/><label>Localização física confirmada</label></div>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check3: !p.check3 }))}><input type="checkbox" checked={evaluationChecklist.check3} readOnly/><label>Segmento de atuação verificado</label></div>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check4: !p.check4 }))}><input type="checkbox" checked={evaluationChecklist.check4} readOnly/><label>Termo de parceria aceito</label></div>
                </div>
              </div>

              {isRejecting && (
                <div className="detail-section animate-scale-in">
                  <label className="admin-label" style={{ color: 'var(--admin-danger)' }}>Motivo da Rejeição</label>
                  <textarea className="admin-input" placeholder="Justificativa..." style={{ minHeight: '100px', marginTop: '0.5rem' }} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                </div>
              )}
            </div>

            <footer className="admin-modal-footer">
              <button onClick={() => { setSelectedCommerce(null); setIsRejecting(false); }} className="admin-action-btn btn-close"><X size={18} /><span>Fechar</span></button>
              {!isRejecting ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setIsRejecting(true)} className="admin-action-btn btn-reject"><XCircle size={18} /><span>Rejeitar</span></button>
                  <button onClick={() => handleUpdateStatus(selectedCommerce.id, 'verified', 'comercios')} className="admin-action-btn btn-approve" disabled={!evaluationChecklist.check1 || !evaluationChecklist.check2 || !evaluationChecklist.check3 || !evaluationChecklist.check4}><CheckCircle size={18} /><span>Aprovar Parceiro</span></button>
                </div>
              ) : (
                <button onClick={() => handleUpdateStatus(selectedCommerce.id, 'rejected', 'comercios', rejectionReason)} className="admin-action-btn btn-reject" disabled={!rejectionReason.trim()}><AlertCircle size={18} /><span>Confirmar Rejeição</span></button>
              )}
            </footer>
          </div>
        </div>
      )}

      {selectedProfile && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content animate-scale-in" style={{ maxWidth: '850px' }}>
            <header className="admin-modal-header" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={32} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedProfile.nome || selectedProfile.nomeCompleto || selectedProfile.full_name}</h2>
                  <p style={{ opacity: 0.9, fontWeight: 600 }}>Cadastro Familiar</p>
                </div>
              </div>
              <button onClick={() => setSelectedProfile(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: 'white', width: '36px', height: '36px', borderRadius: '10px' }}><X size={24} /></button>
            </header>

            <div className="admin-modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <div className="detail-section">
                <h3 className="detail-section-title"><User size={18} /> Dados Pessoais</h3>
                <div className="detail-grid">
                  <div className="detail-item"><label>Nome Completo</label><p>{selectedProfile.nome || selectedProfile.nomeCompleto || selectedProfile.full_name}</p></div>
                  <div className="detail-item"><label>Data Nascimento</label><p>{selectedProfile.dataNascimento || selectedProfile.data_nascimento || '---'}</p></div>
                  <div className="detail-item"><label>Estado Civil</label><p>{selectedProfile.estadoCivil || selectedProfile.estado_civil || '---'}</p></div>
                  <div className="detail-item"><label>Profissão</label><p>{selectedProfile.ocupacao || selectedProfile.profissao || '---'}</p></div>
                  <div className="detail-item"><label>CPF</label><p>{selectedProfile.cpf || '---'}</p></div>
                  <div className="detail-item"><label>RG</label><p>{selectedProfile.rg || '---'}</p></div>
                  <div className="detail-item"><label>NIS</label><p>{selectedProfile.nis || '---'}</p></div>
                  <div className="detail-item"><label>Renda Familiar</label><p>{selectedProfile.rendaFamiliar || selectedProfile.renda_mensal || '---'}</p></div>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="detail-section-title"><Phone size={18} /> Contato</h3>
                <div className="detail-grid">
                  <div className="detail-item"><label>Telefone</label><p>{selectedProfile.telefone || selectedProfile.phone || '---'}</p></div>
                  <div className="detail-item"><label>WhatsApp</label><p>{selectedProfile.telefone || selectedProfile.phone || '---'}</p></div>
                  <div className="detail-item"><label>E-mail</label><p>{selectedProfile.email || '---'}</p></div>
                  <div className="detail-item"><label>Horário Contato</label><p>{selectedProfile.horarioContato || selectedProfile.horario_contato || '---'}</p></div>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="detail-section-title"><Home size={18} /> Residência</h3>
                <div className="detail-grid">
                  <div className="detail-item" style={{ gridColumn: 'span 2' }}><label>Endereço</label><p>{typeof selectedProfile.endereco === 'object' ? `${selectedProfile.endereco.endereco || ''}, ${selectedProfile.endereco.bairro || ''} - ${selectedProfile.endereco.cidade || ''}/${selectedProfile.endereco.uf || ''}` : (selectedProfile.endereco || '---')}</p></div>
                  <div className="detail-item"><label>Bairro</label><p>{typeof selectedProfile.endereco === 'object' ? selectedProfile.endereco.bairro : (selectedProfile.bairro || '---')}</p></div>
                  <div className="detail-item"><label>Tipo Moradia</label><p>{typeof selectedProfile.endereco === 'object' ? selectedProfile.endereco.tipoMoradia : (selectedProfile.tipoMoradia || selectedProfile.tipo_moradia || '---')}</p></div>
                  <div className="detail-item" style={{ gridColumn: 'span 2' }}><label>Ponto Referência</label><p>{typeof selectedProfile.endereco === 'object' ? selectedProfile.endereco.pontoReferencia : (selectedProfile.pontoReferencia || selectedProfile.ponto_referencia || '---')}</p></div>
                </div>
              </div>

              {(selectedProfile.criancas || selectedProfile.jovens || selectedProfile.adultos || selectedProfile.idosos) && (
                <div className="detail-section">
                  <h3 className="detail-section-title"><Users2 size={18} /> Composição Familiar</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', background: '#fff7ed', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #ffedd5' }}>
                    <div style={{ textAlign: 'center' }}><label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>Crianças</label><strong style={{ fontSize: '1.5rem', color: '#c2410c' }}>{selectedProfile.criancas || 0}</strong></div>
                    <div style={{ textAlign: 'center' }}><label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>Jovens</label><strong style={{ fontSize: '1.5rem', color: '#c2410c' }}>{selectedProfile.jovens || 0}</strong></div>
                    <div style={{ textAlign: 'center' }}><label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>Adultos</label><strong style={{ fontSize: '1.5rem', color: '#c2410c' }}>{selectedProfile.adultos || 0}</strong></div>
                    <div style={{ textAlign: 'center' }}><label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>Idosos</label><strong style={{ fontSize: '1.5rem', color: '#c2410c' }}>{selectedProfile.idosos || 0}</strong></div>
                  </div>
                </div>
              )}

              {selectedProfile.necessidades && selectedProfile.necessidades.length > 0 && (
                <div className="detail-section">
                  <h3 className="detail-section-title"><ListChecks size={18} color="var(--admin-danger)" /> Necessidades Identificadas</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                    {selectedProfile.necessidades.map((item, i) => (
                      <span key={i} style={{ background: '#fee2e2', color: '#991b1b', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 700, border: '1px solid #fecaca' }}>{item}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section" style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1.5rem' }}>
                <h3 className="detail-section-title" style={{ border: 'none' }}><ShieldCheck size={18} color="var(--admin-accent)" /> Checklist de Verificação</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check1: !p.check1 }))}><input type="checkbox" checked={evaluationChecklist.check1} readOnly/><label>Documentação (CPF/RG) validada</label></div>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check2: !p.check2 }))}><input type="checkbox" checked={evaluationChecklist.check2} readOnly/><label>Dados de contato verificados</label></div>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check3: !p.check3 }))}><input type="checkbox" checked={evaluationChecklist.check3} readOnly/><label>Situação socioeconômica avaliada</label></div>
                  <div className="checklist-item" onClick={() => setEvaluationChecklist(p => ({ ...p, check4: !p.check4 }))}><input type="checkbox" checked={evaluationChecklist.check4} readOnly/><label>Necessidades prioritárias identificadas</label></div>
                </div>
              </div>

              {isRejecting && (
                <div className="detail-section animate-scale-in">
                  <label className="admin-label" style={{ color: 'var(--admin-danger)' }}>Motivo da Rejeição</label>
                  <textarea className="admin-input" placeholder="Justificativa..." style={{ minHeight: '100px', marginTop: '0.5rem' }} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                </div>
              )}
            </div>

            <footer className="admin-modal-footer">
              <button onClick={() => { setSelectedProfile(null); setIsRejecting(false); }} className="admin-action-btn btn-close"><X size={18} /><span>Fechar</span></button>
              {!isRejecting ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setIsRejecting(true)} className="admin-action-btn btn-reject"><XCircle size={18} /><span>Rejeitar</span></button>
                  <button onClick={() => handleUpdateStatus(selectedProfile.id, 'verified', activeTab === 'citizens' ? 'cidadaos' : 'familias')} className="admin-action-btn btn-approve" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }} disabled={!evaluationChecklist.check1 || !evaluationChecklist.check2 || !evaluationChecklist.check3 || !evaluationChecklist.check4}><CheckCircle size={18} /><span>Aprovar {activeTab === 'citizens' ? 'Cidadão' : 'Família'}</span></button>
                </div>
              ) : (
                <button onClick={() => handleUpdateStatus(selectedProfile.id, 'rejected', activeTab === 'citizens' ? 'cidadaos' : 'familias', rejectionReason)} className="admin-action-btn btn-reject" disabled={!rejectionReason.trim()}><AlertCircle size={18} /><span>Confirmar Rejeição</span></button>
              )}
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}