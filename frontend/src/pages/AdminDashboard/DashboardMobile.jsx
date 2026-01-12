import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, 
  ShieldCheck, LogOut, Search,
  Eye, CheckCircle, XCircle,
  Bell, Clock, ArrowRight,
  Heart, Store, UserCircle,
  Zap, Target, Sparkles,
  Home, Users2, Menu, X
} from 'lucide-react';
import './DashboardMobile.css';

// Mock data service (same as desktop)
const mockApiService = {
  async request(endpoint) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (endpoint === '/ongs') {
      return {
        data: [
          {
            id: '1',
            nome_fantasia: 'Instituto Esperança',
            razao_social: 'Instituto Esperança de Desenvolvimento Social LTDA',
            cnpj: '12.345.678/0001-90',
            email: 'contato@institutoesperanca.org',
            telefone: '(11) 98765-4321',
            data_fundacao: '2015-03-15',
            website: 'https://institutoesperanca.org',
            sede: 'Rua das Flores, 123 - Centro, São Paulo - SP',
            areas_cobertura: ['Centro', 'Zona Norte', 'Periferia'],
            num_voluntarios: 45,
            colaboradores_fixos: 8,
            causas: ['Segurança Alimentar', 'Educação e Cultura', 'Direitos Humanos'],
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]
      };
    }
    
    if (endpoint === '/comercios') {
      return {
        data: [
          {
            id: '2',
            nome_fantasia: 'Padaria do Bairro',
            razao_social: 'Padaria e Confeitaria do Bairro LTDA',
            cnpj: '98.765.432/0001-10',
            segmento: 'Alimentação',
            responsavel_legal: 'João Silva Santos',
            telefone: '(11) 91234-5678',
            email: 'contato@padariabairro.com',
            endereco: 'Av. Principal, 456 - Vila Nova, São Paulo - SP',
            horario_funcionamento: 'Segunda a Sábado das 06h às 20h',
            contribuicoes: ['Ponto de Coleta de Doações', 'Descontos para Famílias Cadastradas', 'Doação de Excedentes (Alimentos)'],
            observacoes: 'Disponível para parcerias sociais',
            status: 'pending',
            created_at: new Date().toISOString()
          },
          {
            id: '5',
            nome_fantasia: 'Padaria do Baixo',
            razao_social: 'Panificadora Baixo Centro LTDA',
            cnpj: '11.222.333/0001-44',
            segmento: 'Alimentação',
            responsavel_legal: 'Ricardo Mendes',
            telefone: '(11) 97777-8888',
            email: 'contato@padariabaixo.com',
            endereco: 'Rua do Baixo, 10 - Centro, São Paulo - SP',
            horario_funcionamento: 'Todos os dias das 07h às 22h',
            contribuicoes: ['Doação de Pães', 'Café Solidário'],
            observacoes: 'Parceiro engajado',
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]
      };
    }
    
    if (endpoint === '/familias') {
      return {
        data: [
          {
            id: '3',
            nomeCompleto: 'Maria Santos Silva',
            dataNascimento: '1985-07-20',
            estadoCivil: 'Casado(a)',
            profissao: 'Diarista',
            cpf: '123.456.789-00',
            rg: '12.345.678-9',
            nis: '123.45678.90-1',
            rendaFamiliar: '501_1000',
            telefone: '(11) 99876-5432',
            whatsapp: '(11) 99876-5432',
            email: 'maria.santos@email.com',
            horarioContato: 'Tarde',
            endereco: 'Rua das Palmeiras, 789',
            bairro: 'Jardim Esperança',
            pontoReferencia: 'Próximo ao posto de saúde',
            tipoMoradia: 'Casa Alugada',
            criancas: 2,
            jovens: 1,
            adultos: 2,
            idosos: 0,
            necessidades: ['Alimentação', 'Material Escolar', 'Roupas'],
            status: 'pending',
            created_at: new Date().toISOString(),
            role: 'family'
          }
        ]
      };
    }
    
    if (endpoint === '/cidadaos') {
      return {
        data: [
          {
            id: '4',
            nomeCompleto: 'Carlos Eduardo Oliveira',
            email: 'carlos.oliveira@email.com',
            telefone: '(11) 94567-8901',
            cpf: '987.654.321-00',
            dataNascimento: '1990-12-10',
            profissao: 'Engenheiro de Software',
            endereco: 'Rua dos Desenvolvedores, 321 - Tech Valley, São Paulo - SP',
            disponibilidade: ['Fins de semana', 'Noites'],
            interesses: ['Educação e Cultura', 'Meio Ambiente', 'Tecnologia Social'],
            proposito: 'Quero usar minhas habilidades técnicas para ajudar ONGs com soluções digitais',
            status: 'pending',
            created_at: new Date().toISOString(),
            role: 'citizen'
          }
        ]
      };
    }
    
    return { data: [] };
  }
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'dashboard') {
      await Promise.all([fetchOngs(), fetchCommerces(), fetchProfiles(), fetchCitizens()]);
      generateNotifications();
    } else if (activeTab === 'ongs') {
      await fetchOngs();
    } else if (activeTab === 'commerces') {
      await fetchCommerces();
    } else if (activeTab === 'families') {
      await fetchProfiles();
    } else {
      await fetchCitizens();
    }
    setLoading(false);
  };

  const generateNotifications = () => {
    const newNotifications = [
      {
        id: 'n1',
        title: 'Nova ONG pendente',
        message: 'Instituto Esperança aguarda sua revisão.',
        time: 'Há 5 min',
        type: 'ong',
        isRead: false,
      },
      {
        id: 'n2',
        title: 'Parceria Comercial',
        message: 'Padaria do Bairro solicitou adesão.',
        time: 'Há 12 min',
        type: 'commerce',
        isRead: false,
      },
      {
        id: 'n3',
        title: 'Cadastro de Família',
        message: 'Maria Santos Silva enviou documentos.',
        time: 'Há 1 hora',
        type: 'family',
        isRead: true,
      }
    ];
    setNotifications(newNotifications);
  };

  const fetchOngs = async () => {
    try {
      const response = await mockApiService.request('/ongs');
      const data = response.data || [];
      setOngs(data);
      const pending = data.filter((o) => o.status === 'pending').length;
      setStats((prev) => ({ ...prev, pendingOngs: pending, totalOngs: data.length }));
    } catch (error) {
      console.error('Error fetching ONGs:', error);
      setOngs([]);
    }
  };

  const fetchCommerces = async () => {
    try {
      const response = await mockApiService.request('/comercios');
      const data = response.data || [];
      setCommerces(data);
      const pending = data.filter((c) => c.status === 'pending').length;
      setStats((prev) => ({ ...prev, pendingCommerces: pending, totalCommerces: data.length }));
    } catch (error) {
      console.error('Error fetching commerces:', error);
      setCommerces([]);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await mockApiService.request('/familias');
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
    }
  };

  const fetchCitizens = async () => {
    try {
      const response = await mockApiService.request('/cidadaos');
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
    }
  };

  const handleUpdateStatus = async (id, status, type, name) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      if (type === 'ongs') fetchOngs();
      else if (type === 'commerces') fetchCommerces();
      else if (type === 'citizens') fetchCitizens();
      else fetchProfiles();

      setSelectedOng(null);
      setSelectedCommerce(null);
      setSelectedProfile(null);
      setEvaluationChecklist({ check1: false, check2: false, check3: false, check4: false });

      if (status === 'verified') {
        setSuccessAction({
          title: 'Sucesso!',
          message: `${name || 'O registro'} foi aprovado com sucesso e já está ativo no sistema.`
        });
      }

    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const filteredOngs = ongs.filter(
    (ong) =>
      ong.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ong.cnpj?.includes(searchTerm) ||
      ong.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommerces = commerces.filter(
    (commerce) =>
      commerce.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commerce.cnpj?.includes(searchTerm) ||
      commerce.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCitizens = citizens.filter(
    (citizen) =>
      citizen.nomeCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.cpf?.includes(searchTerm)
  );

  const filteredFamilies = profiles.filter(
    (profile) =>
      profile.nomeCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.cpf?.includes(searchTerm)
  );

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
            <button className={`adm-notification-btn ${totalPending > 0 ? "has-badge" : ""}`} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={22} />
              {totalPending > 0 && <span className="adm-badge">{totalPending}</span>}
            </button>
          </div>
        </header>

        <div className="adm-content-area">
          <div className="adm-search-bar">
            <Search size={18} />
            <input type="text" placeholder="Pesquisar registros..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {activeTab === "dashboard" && (
            <div className="adm-dashboard-content">
              <div className="adm-summary-section" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', border: 'none' }}>
                <div className="adm-section-header" style={{ marginBottom: '0.5rem' }}>
                  <h2 style={{ color: 'white' }}>Meta de Aprovação</h2>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, opacity: 0.8 }}>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="adm-progress-bar-container" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="adm-progress-fill" style={{ width: `${progressPercentage}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                </div>
                <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>
                  {approvedItems} de {totalItems} solicitações processadas
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
                  </div>
                </div>
                <div className="adm-stat-card" style={{ color: 'var(--adm-commerce-color)' }}>
                  <div className="adm-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                    <Store size={24} />
                  </div>
                  <div className="adm-stat-info">
                    <span className="adm-stat-label">Comércios</span>
                    <span className="adm-stat-value">{stats.totalCommerces}</span>
                  </div>
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
                          <button className="adm-quick-approve-badge" onClick={(e) => { e.stopPropagation(); setSelectedOng(ong); }}>
                            Detalhes
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
                          <button className="adm-quick-approve-badge" onClick={(e) => { e.stopPropagation(); setSelectedCommerce(commerce); }}>
                            Detalhes
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
                <div className="adm-loading-state">
                  <div className="adm-spinner" />
                  <p>Sincronizando dados...</p>
                </div>
              ) : (
                <div className="adm-items-list">
                    {activeTab === "ongs" && filteredOngs.map((ong) => (
                      <div key={ong.id} className="adm-list-item" onClick={() => setSelectedOng(ong)}>
                        <div className="adm-item-icon adm-ong">
                          <Heart size={20} />
                        </div>
                        <div className="adm-item-content">
                          <span className="adm-item-name">{ong.nome_fantasia}</span>
                          <span className="adm-item-email">{ong.email}</span>
                        </div>
                        <div className="adm-item-actions">
                          <span className={`adm-status-badge adm-${ong.status}`}>{ong.status === "pending" ? "Análise" : "OK"}</span>
                          {ong.status === "pending" && (
                            <button className="adm-quick-approve-badge" onClick={(e) => { e.stopPropagation(); setSelectedOng(ong); }}>
                              Aprovar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {activeTab === "commerces" && filteredCommerces.map((commerce) => (
                      <div key={commerce.id} className="adm-list-item" onClick={() => setSelectedCommerce(commerce)}>
                        <div className="adm-item-icon adm-commerce">
                          <Store size={20} />
                        </div>
                        <div className="adm-item-content">
                          <span className="adm-item-name">{commerce.nome_fantasia}</span>
                          <span className="adm-item-email">{commerce.email}</span>
                        </div>
                        <div className="adm-item-actions">
                          <span className={`adm-status-badge adm-${commerce.status}`}>{commerce.status === "pending" ? "Análise" : "OK"}</span>
                          {commerce.status === "pending" && (
                            <button className="adm-quick-approve-badge" onClick={(e) => { e.stopPropagation(); setSelectedCommerce(commerce); }}>
                              Aprovar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {activeTab === "families" && filteredFamilies.map((profile) => (
                      <div key={profile.id} className="adm-list-item" onClick={() => setSelectedProfile(profile)}>
                        <div className="adm-item-icon" style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--adm-family-color)' }}>
                          <Users size={20} />
                        </div>
                        <div className="adm-item-content">
                          <span className="adm-item-name">{profile.nomeCompleto || profile.full_name}</span>
                          <span className="adm-item-email">{profile.email}</span>
                        </div>
                        <div className="adm-item-actions">
                          <span className={`adm-status-badge adm-${profile.status}`}>{profile.status === "pending" ? "Análise" : "OK"}</span>
                          {profile.status === "pending" && (
                            <button className="adm-quick-approve-badge" onClick={(e) => { e.stopPropagation(); setSelectedProfile(profile); }}>
                              Aprovar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {activeTab === "citizens" && filteredCitizens.map((citizen) => (
                      <div key={citizen.id} className="adm-list-item" onClick={() => setSelectedProfile(citizen)}>
                        <div className="adm-item-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--adm-citizen-color)' }}>
                          <UserCircle size={20} />
                        </div>
                        <div className="adm-item-content">
                          <span className="adm-item-name">{citizen.nomeCompleto || citizen.full_name}</span>
                          <span className="adm-item-email">{citizen.email}</span>
                        </div>
                        <div className="adm-item-actions">
                          <span className={`adm-status-badge adm-${citizen.status}`}>{citizen.status === "pending" ? "Análise" : "OK"}</span>
                          {citizen.status === "pending" && (
                            <button className="adm-quick-approve-badge" onClick={(e) => { e.stopPropagation(); setSelectedProfile(citizen); }}>
                              Aprovar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals - Same as desktop but with mobile styles */}
      {selectedOng && (
        <div className="adm-modal-overlay" onClick={closeModals}>
          <div className="adm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header adm-ong" style={{ background: 'var(--adm-ong-color)' }}>
              <div className="adm-modal-title-area">
                <h2>{selectedOng.nome_fantasia}</h2>
                <p>Verificação Institucional</p>
              </div>
              <button className="adm-modal-close" onClick={closeModals}>
                <X size={24} />
              </button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-detail-section">
                <h3>Dados Institucionais</h3>
                <div className="adm-detail-grid">
                  <div className="adm-detail-item"><label>Razão Social</label><p>{selectedOng.razao_social || "Não informado"}</p></div>
                  <div className="adm-detail-item"><label>CNPJ</label><p>{selectedOng.cnpj}</p></div>
                  <div className="adm-detail-item"><label>E-mail</label><p>{selectedOng.email}</p></div>
                  <div className="adm-detail-item"><label>Telefone</label><p>{selectedOng.telefone}</p></div>
                  <div className="adm-detail-item"><label>Website</label><p>{selectedOng.website || "N/A"}</p></div>
                  <div className="adm-detail-item"><label>Sede</label><p>{selectedOng.sede || "N/A"}</p></div>
                  <div className="adm-detail-item"><label>Áreas de Cobertura</label><p>{selectedOng.areas_cobertura?.join(", ") || "N/A"}</p></div>
                  <div className="adm-detail-item"><label>Causas</label><p>{selectedOng.causas?.join(", ") || "N/A"}</p></div>
                </div>
              </div>
              <div className="adm-checklist-section">
                <h3>Checklist de Aprovação</h3>
                <div className="adm-checklist-items">
                  <div className={`adm-checklist-item ${evaluationChecklist.check1 ? 'adm-checked' : ''}`} onClick={() => setEvaluationChecklist(p => ({ ...p, check1: !p.check1 }))}>
                    <div className="adm-checkbox" /><span>Documentação Legal Validada</span>
                  </div>
                  <div className={`adm-checklist-item ${evaluationChecklist.check2 ? 'adm-checked' : ''}`} onClick={() => setEvaluationChecklist(p => ({ ...p, check2: !p.check2 }))}>
                    <div className="adm-checkbox" /><span>Sede Física Verificada</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn-secondary" onClick={() => handleUpdateStatus(selectedOng.id, "rejected", "ongs")}>Recusar</button>
              <button className="adm-btn-primary adm-ong" disabled={!evaluationChecklist.check1 || !evaluationChecklist.check2} onClick={() => handleUpdateStatus(selectedOng.id, "verified", "ongs", selectedOng.nome_fantasia)}>Aprovar ONG</button>
            </div>
          </div>
        </div>
      )}

      {/* Commerce Modal */}
      {selectedCommerce && (
        <div className="adm-modal-overlay" onClick={closeModals}>
          <div className="adm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header adm-commerce" style={{ background: 'var(--adm-commerce-color)' }}>
              <div className="adm-modal-title-area">
                <h2>{selectedCommerce.nome_fantasia}</h2>
                <p>Análise de Parceria</p>
              </div>
              <button className="adm-modal-close" onClick={closeModals}>
                <X size={24} />
              </button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-detail-section">
                <h3>Dados do Estabelecimento</h3>
                <div className="adm-detail-grid">
                  <div className="adm-detail-item"><label>Razão Social</label><p>{selectedCommerce.razao_social || "Não informado"}</p></div>
                  <div className="adm-detail-item"><label>CNPJ</label><p>{selectedCommerce.cnpj}</p></div>
                  <div className="adm-detail-item"><label>Segmento</label><p>{selectedCommerce.segmento || "Não informado"}</p></div>
                  <div className="adm-detail-item"><label>Responsável</label><p>{selectedCommerce.responsavel_legal || "Não informado"}</p></div>
                  <div className="adm-detail-item"><label>E-mail</label><p>{selectedCommerce.email}</p></div>
                  <div className="adm-detail-item"><label>Telefone</label><p>{selectedCommerce.telefone}</p></div>
                  <div className="adm-detail-item"><label>Endereço</label><p>{selectedCommerce.endereco || "Não informado"}</p></div>
                  <div className="adm-detail-item"><label>Funcionamento</label><p>{selectedCommerce.horario_funcionamento || "Não informado"}</p></div>
                </div>
              </div>
              <div className="adm-detail-section">
                <h3>Contribuições Pretendidas</h3>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--adm-primary)', fontWeight: 600 }}>
                  {selectedCommerce.contribuicoes?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div className="adm-checklist-section">
                <h3>Checklist de Parceria</h3>
                <div className="adm-checklist-items">
                  <div className={`adm-checklist-item ${evaluationChecklist.check1 ? 'adm-checked' : ''}`} onClick={() => setEvaluationChecklist(p => ({ ...p, check1: !p.check1 }))}>
                    <div className="adm-checkbox" /><span>CNPJ Ativo na Receita</span>
                  </div>
                  <div className={`adm-checklist-item ${evaluationChecklist.check2 ? 'adm-checked' : ''}`} onClick={() => setEvaluationChecklist(p => ({ ...p, check2: !p.check2 }))}>
                    <div className="adm-checkbox" /><span>Compromisso Social Assinado</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn-secondary" onClick={() => handleUpdateStatus(selectedCommerce.id, "rejected", "commerces")}>Recusar</button>
              <button className="adm-btn-primary adm-commerce" disabled={!evaluationChecklist.check1 || !evaluationChecklist.check2} onClick={() => handleUpdateStatus(selectedCommerce.id, "verified", "commerces", selectedCommerce.nome_fantasia)}>Aprovar Parceiro</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal (Beneficiary/Volunteer) */}
      {selectedProfile && (
        <div className="adm-modal-overlay" onClick={closeModals}>
          <div className="adm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header" style={{ background: selectedProfile.role === 'family' ? 'var(--adm-family-color)' : 'var(--adm-citizen-color)' }}>
              <div className="adm-modal-title-area">
                <h2>{selectedProfile.nomeCompleto || selectedProfile.full_name}</h2>
                <p>{selectedProfile.role === 'family' ? 'Cadastro de Família' : 'Cadastro de Cidadão'}</p>
              </div>
              <button className="adm-modal-close" onClick={closeModals}>
                <X size={24} />
              </button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-detail-section">
                <h3>Informações Pessoais</h3>
                <div className="adm-detail-grid">
                  <div className="adm-detail-item"><label>CPF</label><p>{selectedProfile.cpf}</p></div>
                  <div className="adm-detail-item"><label>E-mail</label><p>{selectedProfile.email}</p></div>
                  <div className="adm-detail-item"><label>Telefone</label><p>{selectedProfile.telefone || selectedProfile.phone}</p></div>
                  <div className="adm-detail-item"><label>Endereço</label><p>{selectedProfile.endereco}</p></div>
                  
                  {selectedProfile.role === 'family' ? (
                    <>
                      <div className="adm-detail-item"><label>Renda Familiar</label><p>{selectedProfile.rendaFamiliar || "Não informado"}</p></div>
                      <div className="adm-detail-item"><label>Composição</label><p>{selectedProfile.adultos} adultos, {selectedProfile.criancas} crianças</p></div>
                      <div className="adm-detail-item"><label>Necessidades</label><p>{selectedProfile.necessidades?.join(", ") || "N/A"}</p></div>
                    </>
                  ) : (
                    <>
                      <div className="adm-detail-item"><label>Profissão</label><p>{selectedProfile.profissao || "Não informado"}</p></div>
                      <div className="adm-detail-item"><label>Disponibilidade</label><p>{selectedProfile.disponibilidade?.join(", ") || "N/A"}</p></div>
                      <div className="adm-detail-item"><label>Interesses</label><p>{selectedProfile.interesses?.join(", ") || "N/A"}</p></div>
                    </>
                  )}
                </div>
              </div>

              {selectedProfile.proposito && (
                <div className="adm-detail-section">
                  <h3>Propósito</h3>
                  <p style={{ fontStyle: 'italic', color: 'var(--adm-secondary)' }}>"{selectedProfile.proposito}"</p>
                </div>
              )}

              <div className="adm-checklist-section">
                <h3>Verificação de Perfil</h3>
                <div className="adm-checklist-items">
                  <div className={`adm-checklist-item ${evaluationChecklist.check1 ? 'adm-checked' : ''}`} onClick={() => setEvaluationChecklist(p => ({ ...p, check1: !p.check1 }))}>
                    <div className="adm-checkbox" /><span>Identidade Confirmada (CPF)</span>
                  </div>
                  <div className={`adm-checklist-item ${evaluationChecklist.check2 ? 'adm-checked' : ''}`} onClick={() => setEvaluationChecklist(p => ({ ...p, check2: !p.check2 }))}>
                    <div className="adm-checkbox" /><span>Comprovante de Residência OK</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn-secondary" onClick={() => handleUpdateStatus(selectedProfile.id, "rejected", selectedProfile.role === 'family' ? "families" : "citizens")}>Recusar</button>
              <button className="adm-btn-primary" 
                style={{ background: selectedProfile.role === 'family' ? 'var(--adm-family-color)' : 'var(--adm-citizen-color)' }}
                disabled={!evaluationChecklist.check1 || !evaluationChecklist.check2} 
                onClick={() => handleUpdateStatus(selectedProfile.id, "verified", selectedProfile.role === 'family' ? "families" : "citizens", selectedProfile.nomeCompleto || selectedProfile.full_name)}>
                Aprovar {selectedProfile.role === 'family' ? 'Família' : 'Cidadão'}
              </button>
            </div>
          </div>
        </div>
      )}
      
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
    </div>
  );
}