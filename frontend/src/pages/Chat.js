import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { 
  Heart, 
  ArrowLeft, 
  AlertTriangle, 
  ShieldCheck, 
  Package, 
  MapPin, 
  Check, 
  CheckCheck, 
  Paperclip, 
  Send, 
  MoreVertical,
  ChevronRight,
  Search,
  Star,
  Mail,
  Phone,
  User,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/pages/Chat.css';

const formatTime = (date) => {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

const Chat = () => {
  const params = useParams();
  const navigate = useNavigate();
  const conversaId = params.id;
  
  const [messages, setMessages] = useState([
    {
      id: "sys1",
      type: "system",
      sender: "system",
      content: "Pedido confirmado: Ajuda com alimentos.",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "sys2",
      type: "system",
      sender: "system",
      content: "Este é um ambiente seguro. Evite compartilhar dados pessoais sensíveis.",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: "1",
      type: "text",
      sender: "doador",
      content: "Olá! Vi que você precisa de cesta básica. Posso ajudar.",
      timestamp: new Date(Date.now() - 3400000),
      read: true,
    },
    {
      id: "2",
      type: "text",
      sender: "receptor",
      content: "Obrigada! Sim, preciso para mim e meus dois filhos.",
      timestamp: new Date(Date.now() - 3300000),
      read: true,
    },
    {
      id: "3",
      type: "text",
      sender: "doador",
      content: "Perfeito! Tenho uma cesta completa aqui. Podemos combinar a entrega para amanhã?",
      timestamp: new Date(Date.now() - 3200000),
      read: true,
    },
    {
      id: "4",
      type: "text",
      sender: "receptor",
      content: "Seria ótimo! Qual horário fica melhor para você?",
      timestamp: new Date(Date.now() - 3100000),
      read: true,
    },
    {
      id: "5",
      type: "text",
      sender: "doador",
      content: "Pode ser às 14h? Sugiro a gente se encontrar na Praça Central, é um lugar seguro e movimentado.",
      timestamp: new Date(Date.now() - 3000000),
      read: true,
    },
    {
      id: "6",
      type: "location",
      sender: "doador",
      content: "",
      timestamp: new Date(Date.now() - 2900000),
      read: true,
      location: {
        name: "Praça Central - São Lucas",
        address: "Ponto de encontro sugerido",
      },
    },
    {
      id: "7",
      type: "text",
      sender: "receptor",
      content: "Perfeito! Conheço bem a praça. Estarei lá às 14h. Muito obrigada!",
      timestamp: new Date(Date.now() - 2800000),
      read: true,
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser] = useState("receptor");
  const [selectedChatId, setSelectedChatId] = useState(conversaId || "1");
  const [chatContacts, setChatContacts] = useState([
    {
      id: "1",
      name: "Ana Paula",
      initials: "AP",
      type: "doador",
      distance: "450m de você",
      online: true,
      lastMessage: "Perfeito! Conheço bem a praça...",
      lastMessageTime: "14:20",
      unreadCount: 0,
    },
    {
      id: "2",
      name: "Ricardo Silva",
      initials: "RS",
      type: "doador",
      distance: "1.2km de você",
      online: false,
      lastMessage: "Vou verificar os itens aqui.",
      lastMessageTime: "Ontem",
      unreadCount: 2,
    },
    {
      id: "3",
      name: "Maria Oliveira",
      initials: "MO",
      type: "receptor",
      distance: "800m de você",
      online: true,
      lastMessage: "Muito obrigada pela ajuda!",
      lastMessageTime: "Segunda",
      unreadCount: 0,
    },
  ]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState("andamento");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const messagesEndRef = useRef(null);

  const currentUserData = {
    name: "Seu Perfil",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    type: "Pessoa Física",
    address: "Rua das Flores, 123 - São Lucas",
    points: 1250,
    initials: "JS"
  };

  const filteredContacts = chatContacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentContact = chatContacts.find(c => c.id === selectedChatId) || chatContacts[0];

  const helpInfo = {
    type: "Doação de Cesta Básica",
    urgency: "high",
    bairro: "São Lucas",
    distance: "450 m",
    status: deliveryStatus,
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (conversaId) {
      setSelectedChatId(conversaId);
      setChatContacts(prev => prev.map(c => 
        c.id === conversaId ? { ...c, unreadCount: 0 } : c
      ));
    }
  }, [conversaId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: "text",
      sender: currentUser,
      content: inputValue,
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate typing from other user
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFinishDelivery = () => {
    setShowFinishModal(false);
    setShowConfirmation(true);
    setDeliveryStatus("entregue");
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const newMessage = {
          id: Date.now().toString(),
          type: "location",
          sender: currentUser,
          content: "",
          timestamp: new Date(),
          read: false,
          location: {
            lat: latitude,
            lng: longitude,
            name: "Minha Localização",
            address: "Compartilhada em tempo real",
          },
        };

        setMessages([...messages, newMessage]);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        alert("Não foi possível obter sua localização. Verifique as permissões.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="chat-page-wrapper">
      <Header showLoginButton={false} />
      
      <div className="chat-layout">
        {/* Sidebar */}
        <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <div className="sidebar-title-row">
              <h2>Conversas</h2>
              <button className="icon-btn" title="Nova conversa">
                <Heart size={20} />
              </button>
            </div>
            <div className="search-bar-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar vizinhos..." 
                className="search-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="contacts-list">
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                className={`contact-item ${selectedChatId === contact.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedChatId(contact.id);
                  setChatContacts(prev => prev.map(c => 
                    c.id === contact.id ? { ...c, unreadCount: 0 } : c
                  ));
                  navigate(`/chat/${contact.id}`);
                }}
              >
                <div className="avatar-wrapper">
                  <div className={`contact-avatar ${contact.type}`}>
                    {contact.initials}
                  </div>
                  {contact.online && <span className="online-status-dot" />}
                </div>
                <div className="contact-meta">
                  <div className="contact-name-row">
                    <span className="contact-name">{contact.name}</span>
                    <span className="last-time">{contact.lastMessageTime}</span>
                  </div>
                  <div className="contact-preview-row">
                    <p className="last-message">{contact.lastMessage}</p>
                    {contact.unreadCount > 0 && selectedChatId !== contact.id && (
                      <span className="unread-count-badge">{contact.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="sidebar-footer">
             <div className="mini-profile" onClick={() => setShowUserProfile(true)}>
               <div className="mini-avatar">EU</div>
               <div className="mini-info">
                 <span className="mini-name">Seu Perfil</span>
                 <span className="mini-status">Disponível</span>
               </div>
             </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-main-area">
          {/* Header */}
          <header className="chat-header-bar">
            <div className="header-left-group">
              <button className="mobile-back-btn" onClick={() => navigate('/conversas')}>
                <ArrowLeft size={24} />
              </button>
              <div className="current-user-info">
                <div className="header-avatar">
                  {currentContact?.initials || 'CV'}
                  {currentContact?.online && <span className="online-indicator" />}
                </div>
                <div className="header-text-details">
                  <div className="header-name-row">
                    <h3>{currentContact?.name || 'Carregando...'}</h3>
                    <span className={`role-badge ${currentContact?.type || 'conversa'}`}>
                      {currentContact?.type === "doador" ? "Doador Verificado" : "Vizinho em Busca"}
                    </span>
                  </div>
                  <div className="header-status-pills">
                    <span className="status-pill distance">
                      <MapPin size={12} />
                      {currentContact?.distance || '0m de você'}
                    </span>
                    <span className={`status-pill state ${currentContact?.online ? 'online' : 'offline'}`}>
                      <span className="pulse-dot" />
                      {currentContact?.online ? 'Ativo Agora' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="header-right-group">
              <div className="quick-actions-desktop">
                <button
                  className="header-action-btn danger"
                  onClick={() => setShowReportModal(true)}
                  title="Denunciar ou Bloquear"
                >
                  <AlertTriangle size={20} />
                </button>
                <button className="header-action-btn">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          </header>

          <div className="connection-banner">
            <ShieldCheck size={16} />
            <span>Conexão segura SolidarBairro • Dados protegidos</span>
          </div>

          <div className="chat-content-scroll">
            {/* Context Info Card */}
            <div className="chat-context-card">
              <div className="card-left-section">
                <div className="card-icon-box">
                  <Package size={24} />
                </div>
                <div className="card-info-text">
                  <h4>Resumo da Colaboração</h4>
                  <p className="help-title">{helpInfo.type}</p>
                  <div className="help-tags">
                    <span className={`urgency-pill ${helpInfo.urgency}`}>
                      Urgência {helpInfo.urgency === "high" ? "Alta" : "Média"}
                    </span>
                    <span className="neighborhood-pill">
                      {helpInfo.bairro}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="card-middle-section">
                <div className="status-progress-bar">
                  <div className={`status-step ${['aguardando', 'andamento', 'entregue'].includes(deliveryStatus) ? 'completed' : ''}`}>
                    <div className="step-dot" onClick={() => setDeliveryStatus("aguardando")}>1</div>
                    <span className="step-label">Pendente</span>
                  </div>
                  <div className="progress-line" />
                  <div className={`status-step ${['andamento', 'entregue'].includes(deliveryStatus) ? 'completed' : ''}`}>
                    <div className="step-dot" onClick={() => setDeliveryStatus("andamento")}>2</div>
                    <span className="step-label">Em curso</span>
                  </div>
                  <div className="progress-line" />
                  <div className={`status-step ${deliveryStatus === "entregue" ? 'completed' : ''}`}>
                    <div className="step-dot" onClick={() => setDeliveryStatus("entregue")}>3</div>
                    <span className="step-label">Concluído</span>
                  </div>
                </div>
              </div>
              
              <div className="card-right-section">
                {deliveryStatus === "andamento" ? (
                  <button 
                    className="finish-collaboration-btn"
                    onClick={() => setShowFinishModal(true)}
                  >
                    <Heart size={16} fill="white" />
                    Finalizar Ajuda
                  </button>
                ) : (
                  <button className="details-btn">
                    Detalhes <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Messages Feed */}
            <div className="messages-container">
              <div className="date-separator">
                <span>Hoje</span>
              </div>

              {messages.map((msg) => {
                if (msg.type === "system") {
                  const isSuccess = msg.content.includes("Pedido confirmado");
                  const isSecurity = msg.content.includes("ambiente seguro");

                  return (
                    <div key={msg.id} className="msg-row system">
                      <div className={`system-bubble ${isSuccess ? 'success' : ''} ${isSecurity ? 'security' : ''}`}>
                        {isSuccess && <Package size={14} />}
                        {isSecurity && <ShieldCheck size={14} />}
                        {!isSuccess && !isSecurity && <ShieldCheck size={14} />}
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                if (msg.type === "location") {
                  const { lat, lng } = msg.location || { lat: -23.5505, lng: -46.6333 };
                  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.005}%2C${lng + 0.005}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`;

                  return (
                    <div key={msg.id} className={`msg-row ${msg.sender === currentUser ? 'sent' : 'received'}`}>
                      <div className="msg-bubble location-bubble">
                        <div className="location-map-preview">
                          <iframe
                            title="Localização"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={mapUrl}
                            style={{ border: 0 }}
                          />
                        </div>
                        <div className="location-details">
                          <h5>{msg.location?.name}</h5>
                          <p>{msg.location?.address}</p>
                        </div>
                      </div>
                      <div className="msg-metadata">
                        <span className="msg-time">{formatTime(msg.timestamp)}</span>
                        {msg.sender === currentUser && (
                          <span className="msg-status">
                            <CheckCheck size={14} className="read" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`msg-row ${msg.sender === currentUser ? 'sent' : 'received'}`}>
                    <div className="msg-bubble text-bubble">
                      {msg.content}
                    </div>
                    <div className="msg-metadata">
                      <span className="msg-time">{formatTime(msg.timestamp)}</span>
                      {msg.sender === currentUser && (
                        <span className="msg-status">
                          {msg.read ? <CheckCheck size={14} className="read" /> : <Check size={14} />}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="msg-row received">
                  <div className="msg-bubble typing-bubble">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Footer */}
          <footer className="chat-input-footer">
            <div className="input-container">
              <div className="input-actions-left">
                <button className="action-icon-btn" title="Anexar">
                  <Paperclip size={20} />
                </button>
                <button 
                  className={`action-icon-btn ${isGettingLocation ? 'loading' : ''}`} 
                  title="Enviar Localização"
                  onClick={handleSendLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <div className="mini-loader" />
                  ) : (
                    <MapPin size={20} />
                  )}
                </button>
              </div>
              <div className="textarea-wrapper">
                <textarea
                  className="chat-textarea"
                  placeholder="Digite sua mensagem..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                />
              </div>
              <button
                className={`send-msg-btn ${inputValue.trim() ? 'active' : ''}`}
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* Modals */}
      {showReportModal && (
        <div className="modal-backdrop" onClick={() => setShowReportModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-circle danger">
                <AlertTriangle size={24} />
              </div>
              <h3>Segurança e Denúncia</h3>
            </div>
            <div className="modal-body">
              <p>O que aconteceu? Sua segurança é nossa prioridade.</p>
              <div className="modal-choices">
                <button className="choice-btn">
                  Denunciar comportamento inadequado
                </button>
                <button className="choice-btn danger">
                  Bloquear este vizinho
                </button>
                <button className="choice-btn">
                  Solicitar ajuda da moderação
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-ghost"
                onClick={() => setShowReportModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinishModal && (
        <div className="modal-backdrop" onClick={() => setShowFinishModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-circle success">
                <Heart size={24} fill="white" />
              </div>
              <h3>Finalizar Doação</h3>
            </div>
            <div className="modal-body">
              <p>Você confirma que a entrega foi realizada com sucesso?</p>
              <p className="modal-subtext">
                Isso conclui este ciclo de solidariedade no seu bairro.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-ghost"
                onClick={() => setShowFinishModal(false)}
              >
                Ainda não
              </button>
              <button className="btn-solid-success" onClick={handleFinishDelivery}>
                Sim, concluído!
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserProfile && (
        <div className="modal-backdrop" onClick={() => setShowUserProfile(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button 
                className="close-modal-btn" 
                onClick={() => setShowUserProfile(false)}
                style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 10 }}
              >
                <MoreVertical size={16} />
              </button>
              <div className="profile-main-info">
                <div className="profile-large-avatar">{currentUserData.initials}</div>
                <h3>{currentUserData.name}</h3>
                <div className="profile-badge-row">
                  <div className="points-badge">
                    <Star size={14} fill="currentColor" />
                    {currentUserData.points} Pontos Solidários
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body profile-modal-content">
              <div className="profile-details-grid">
                <div className="detail-item">
                  <div className="detail-icon-box">
                    <Mail size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Email de Contato</span>
                    <span className="detail-value">{currentUserData.email}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon-box">
                    <Phone size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Telefone / WhatsApp</span>
                    <span className="detail-value">{currentUserData.phone}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon-box">
                    <User size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Tipo de Conta</span>
                    <span className="detail-value">{currentUserData.type}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon-box">
                    <MapPin size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Endereço Principal</span>
                    <span className="detail-value">{currentUserData.address}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
              <button className="btn-solid-success" style={{ width: '100%', padding: '1rem', borderRadius: '1rem', fontSize: '1rem' }} onClick={() => setShowUserProfile(false)}>
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="modal-backdrop confirmation-overlay">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                position: 'absolute',
                top: '-10%',
                left: `${Math.random() * 100}%`,
                background: ["#ffd700", "#ffffff", "#10b981", "#fbbf24", "#38bdf8"][Math.floor(Math.random() * 5)],
                width: Math.random() * 8 + 4 + 'px',
                height: Math.random() * 8 + 4 + 'px',
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animation: `confetti-fall ${Math.random() * 2 + 2}s linear infinite`
              }}
            />
          ))}

          <div className="success-announcement">
            <div className="success-icon-ring">
              <Check size={64} strokeWidth={4} />
            </div>
            
            <h2>Solidariedade Concluída!</h2>
            
            <p>Mais um vizinho ajudado com sucesso. ❤️</p>

            <div className="reward-badge">
              <Star className="star-icon" size={20} fill="currentColor" />
              <span>+50 Pontos de Impacto Social</span>
              <Sparkles size={16} className="text-yellow-300" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
