import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import LogoutButton from '../components/LogoutButton';
import apiService from '../services/apiService';
import '../styles/pages/QueroAjudar.css';

const CATEGORIES = ["Alimentos", "Roupas", "Calçados", "Contas", "Emprego", "Higiene", "Medicamentos", "Móveis", "Eletrodomésticos", "Material Escolar", "Transporte"];
const URGENCIES = ["Alta", "Média", "Baixa"];

const QueroAjudar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUrgencies, setSelectedUrgencies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    loadPedidos();
    loadNotifications();

    const handleClickOutside = (event) => {
      if (showUserMenu || showNotifications) {
        const userMenuElement = document.querySelector('.user-menu-wrapper');
        const notificationElement = document.querySelector('.notification-wrapper');
        
        if (userMenuElement && !userMenuElement.contains(event.target)) {
          setShowUserMenu(false);
        }
        
        if (notificationElement && !notificationElement.contains(event.target)) {
          setShowNotifications(false);
        }
      }
    };
    
    window.addEventListener('notificationAdded', loadNotifications);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('notificationAdded', loadNotifications);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPedidos();
      if (response.success) {
        setPedidos(response.data || []);
      } else {
        error('Erro ao carregar pedidos');
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = () => {
    const savedNotifications = localStorage.getItem('solidar-notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('solidar-notifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('solidar-notifications');
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('solidar-notifications', JSON.stringify(updatedNotifications));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const userName = user?.nome || user?.nomeCompleto || user?.name || user?.nomeFantasia || user?.razaoSocial;

  const formatPedidoForDisplay = (pedido) => {
    const userName = pedido.usuario?.nome || 'Usuário';
    const helpType = pedido.items?.length > 0 ? pedido.items.join(', ') : pedido.category;
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;
    
    return {
      ...pedido,
      userName,
      avatar,
      helpType,
      distance: pedido.location || 'Localização não informada',
      familyInfo: `Usuário ${pedido.usuario?.tipo || 'cidadão'}`,
      history: []
    };
  };

  const filteredPedidos = pedidos
    .filter(pedido => pedido.status === 'ativo')
    .map(formatPedidoForDisplay)
    .filter(pedido => {
      const advancedCategoryMatch = selectedCategories.length === 0 || selectedCategories.includes(pedido.category);
      const urgencyMatch = selectedUrgencies.length === 0 || selectedUrgencies.includes(pedido.urgency);
      return advancedCategoryMatch && urgencyMatch;
    });

  const handleConfirmHelp = async () => {
    try {
      const interesseData = {
        pedidoId: selectedPedido.id,
        mensagem: `Olá! Gostaria de ajudar com: ${selectedPedido.helpType}. Podemos conversar sobre os detalhes?`,
        contato: user?.telefone || user?.email || 'Contato via plataforma'
      };
      
      await apiService.createInteresse(interesseData);
      setIsSuccess(true);
      success('Interesse registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar interesse:', error);
      error('Erro ao registrar interesse: ' + error.message);
    }
  };

  const closeSuccess = () => {
    setIsSuccess(false);
    setSelectedPedido(null);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleUrgency = (urgency) => {
    setSelectedUrgencies(prev => 
      prev.includes(urgency) 
        ? prev.filter(u => u !== urgency)
        : [...prev, urgency]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedUrgencies([]);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Alimentos': return <i className="fi fi-rr-shopping-basket"></i>;
      case 'Roupas': return <i className="fi fi-rr-shirt"></i>;
      case 'Calçados': return <i className="fi fi-rr-shoe-prints"></i>;
      case 'Contas': return <i className="fi fi-rr-lightbulb"></i>;
      case 'Emprego': return <i className="fi fi-rr-briefcase"></i>;
      case 'Higiene': return <i className="fi fi-rr-soap"></i>;
      case 'Medicamentos': return <i className="fi fi-rr-pills"></i>;
      case 'Móveis': return <i className="fi fi-rr-chair"></i>;
      case 'Eletrodomésticos': return <i className="fi fi-rr-tv"></i>;
      case 'Material Escolar': return <i className="fi fi-rr-book"></i>;
      case 'Transporte': return <i className="fi fi-rr-bus"></i>;
      default: return <i className="fi fi-rr-heart"></i>;
    }
  };

  return (
    <div className="pedidos-wrapper">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="section-container nav-container">
          <div className="logo" onClick={() => navigate('/')}>
            <i className="fi fi-rr-heart logo-icon"></i>
            <span>SolidarBairro</span>
          </div>
          <div className="nav-links">
            {!isAuthenticated() ? (
              <div className="auth-buttons">
                <button className="btn-nav-secondary" onClick={() => navigate('/login')}>
                  Entrar
                </button>
                <button className="btn-nav" onClick={() => navigate('/cadastro')}>
                  Cadastrar
                </button>
              </div>
            ) : (
              <div className="user-section">
                {/* Notificações */}
                <div className="notification-wrapper">
                  <button 
                    className="notification-btn"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    🔔
                    {unreadCount > 0 && (
                      <span className="notification-badge">{unreadCount}</span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="notification-dropdown">
                      <div className="notification-header">
                        <h3>Notificações</h3>
                        {notifications.length > 0 && (
                          <div className="notification-actions">
                            {unreadCount > 0 && (
                              <button 
                                className="action-btn mark-read-btn"
                                onClick={markAllAsRead}
                                title="Marcar todas como lidas"
                              >
                                ✓
                              </button>
                            )}
                            <button 
                              className="action-btn clear-btn"
                              onClick={clearAllNotifications}
                              title="Limpar todas"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="notification-list">
                        {notifications.length === 0 ? (
                          <div className="no-notifications">
                            Nenhuma notificação ainda
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                              onClick={() => !notification.read && markAsRead(notification.id)}
                            >
                              <div className="notification-content">
                                <p className="notification-title">{notification.title}</p>
                                <p className="notification-message">{notification.message}</p>
                                <span className="notification-time">
                                  {new Date(notification.timestamp).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              {!notification.read && <div className="unread-dot"></div>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Menu do usuário */}
                <div className="user-menu-wrapper">
                  <button 
                    className="user-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="user-avatar">
                      {userName?.substring(0, 2).toUpperCase()}
                    </div>
                    {user?.isVerified && <span className="verified-badge">✓</span>}
                  </button>

                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <div className="user-avatar-large">
                          {userName?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <div className="user-name">
                            {userName}
                            {user?.isVerified && (
                              <span className="verified-text">Verificado</span>
                            )}
                          </div>
                          <div className="user-phone">{user?.phone || user?.telefone || user?.email}</div>
                        </div>
                      </div>

                      <div className="user-stats">
                        <div className="stat">
                          <div className="stat-number">{user?.helpedCount || 0}</div>
                          <div className="stat-label">Pessoas ajudadas</div>
                        </div>
                        <div className="stat">
                          <div className="stat-number">{user?.receivedHelpCount || 0}</div>
                          <div className="stat-label">Ajudas recebidas</div>
                        </div>
                      </div>

                      <div className="user-actions">
                        <button 
                          className="menu-item profile-btn"
                          onClick={() => {
                            navigate('/perfil');
                            setShowUserMenu(false);
                          }}
                        >
                          👤 Ver perfil
                        </button>
                        
                        <button 
                          className="menu-item"
                          onClick={() => {
                            navigate('/conversas');
                            setShowUserMenu(false);
                          }}
                        >
                          💬 Minhas conversas
                        </button>
                        
                        <LogoutButton className="menu-item logout-btn">
                          🚪 Sair
                        </LogoutButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <header className="pedidos-header">
          <h1>Pedidos perto de você</h1>
          <p>Veja quem está precisando no seu bairro e escolha quem ajudar.</p>
        </header>

        {/* Filters */}
        <div className="filters-bar">
          <button 
            className={`filter-toggle-btn ${showFilters || selectedCategories.length > 0 || selectedUrgencies.length > 0 ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className="fi fi-rr-settings-sliders"></i>
            Filtrar
            {(selectedCategories.length > 0 || selectedUrgencies.length > 0) && (
              <span className="filter-count">
                {selectedCategories.length + selectedUrgencies.length}
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-content">
              <div className="filter-group">
                <h3>Categorias</h3>
                <div className="filter-options">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      className={`chip-btn ${selectedCategories.includes(cat) ? 'active' : ''}`}
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h3>Nível de Urgência</h3>
                <div className="filter-options">
                  {URGENCIES.map(urg => (
                    <button 
                      key={urg}
                      className={`chip-btn urgency-chip-${urg.toLowerCase()} ${selectedUrgencies.includes(urg) ? 'active' : ''}`}
                      onClick={() => toggleUrgency(urg)}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filters-actions">
                <button className="clear-filters-btn" onClick={clearFilters}>Limpar Filtros</button>
                <button className="apply-filters-btn" onClick={() => setShowFilters(false)}>Aplicar</button>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="results-info">
          {loading ? (
            'Carregando pedidos...'
          ) : (
            `Mostrando ${filteredPedidos.length} pedido${filteredPedidos.length !== 1 ? 's' : ''} de ajuda`
          )}
        </div>

        {/* Grid */}
        <div className="pedidos-grid">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando pedidos de ajuda...</p>
            </div>
          ) : filteredPedidos.length === 0 ? (
            <div className="no-results">
              <i className="fi fi-rr-search no-results-icon"></i>
              <h3>Nenhum pedido encontrado</h3>
              <p>Tente ajustar os filtros ou verificar novamente mais tarde.</p>
            </div>
          ) : (
            filteredPedidos.map((pedido) => (
              <div key={pedido.id} className="pedido-card">
                <div className="card-header">
                  <div className="user-meta">
                    <img src={pedido.avatar} alt={pedido.userName} className="user-avatar" />
                    <div>
                      <span className="user-name">{pedido.userName}</span>
                      <span className="distance">{pedido.distance}</span>
                    </div>
                  </div>
                  <span className={`urgency-badge urgency-${pedido.urgency.toLowerCase()}`}>
                    Urgência: {pedido.urgency}
                  </span>
                </div>

                <div className="card-body">
                  <div className="help-type">
                    {getCategoryIcon(pedido.category)}
                    {pedido.helpType}
                  </div>
                  <div className="family-info">
                    <i className="fi fi-rr-users"></i> {pedido.familyInfo}
                  </div>
                  <p className="description">{pedido.description}</p>
                </div>

                <div className="card-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedPedido(pedido)}>
                    <i className="fi fi-rr-eye"></i> Ver detalhes
                  </button>
                  <button className="btn btn-primary" onClick={() => setSelectedPedido(pedido)}>
                    <i className="fi fi-rr-hand-heart"></i> Ajudar agora
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Refresh Button */}
        {!loading && (
          <div className="refresh-section">
            <button className="btn btn-secondary" onClick={loadPedidos}>
              <i className="fi fi-rr-refresh"></i> Atualizar pedidos
            </button>
          </div>
        )}
      </div>

      {/* Modal Details */}
      {selectedPedido && (
        <div className="modal-overlay">
          <div className="modal-content">
            {!isSuccess ? (
              <>
                <button className="modal-close" onClick={() => setSelectedPedido(null)}>
                  <i className="fi fi-rr-cross"></i>
                </button>

                <div className="modal-section" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <img src={selectedPedido.avatar} alt="" className="user-avatar" style={{ width: 64, height: 64 }} />
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedPedido.userName}</h2>
                    <span className="distance">{selectedPedido.distance} • {selectedPedido.familyInfo}</span>
                  </div>
                </div>

                <div className="modal-section" style={{ background: 'var(--sb-teal-soft)', padding: 20, borderRadius: 20 }}>
                  <h3>Necessidade Específica</h3>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <i className="fi fi-rr-exclamation text-teal" style={{ marginTop: 2 }}></i>
                    <p style={{ fontWeight: 600, color: 'var(--sb-text)' }}>
                      {selectedPedido.description}
                    </p>
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Histórico de Apoio</h3>
                  {selectedPedido.history.length > 0 ? (
                    selectedPedido.history.map((h, i) => (
                      <div key={i} className="history-item">
                        <i className="fi fi-rr-time-past"></i>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{h.date} — {h.help}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.9rem', color: 'var(--sb-text-light)' }}>Nenhuma ajuda anterior registrada.</p>
                  )}
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }} onClick={handleConfirmHelp}>
                  Confirmar ajuda a esta pessoa
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 80, height: 80, background: '#f0fdfa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <i className="fi fi-rr-check-circle" style={{ fontSize: '48px', color: 'var(--sb-teal)' }}></i>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Iniciando Ajuda!</h2>
                <p style={{ color: 'var(--sb-text-light)', marginBottom: 24 }}>
                  Obrigado por se voluntariar! Você será conectado com {selectedPedido.userName} para finalizar os detalhes.
                </p>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={closeSuccess}>
                  Voltar para a lista
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueroAjudar;