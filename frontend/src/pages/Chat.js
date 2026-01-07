import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import '../styles/pages/Chat.css';

// Ícones SVG convertidos
const Heart = ({ size = 20, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ArrowLeft = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const AlertTriangle = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ShieldCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const Package = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const MapPin = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Check = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CheckCheck = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.2.45 4.53 1.23" />
  </svg>
);

const Paperclip = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49" />
  </svg>
);

const Send = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const MoreVertical = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const ChevronRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const Search = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Star = ({ size = 20, fill = "none", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Mail = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22 6 12 13 2 6" />
  </svg>
);

const Phone = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const User = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Sparkles = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

const formatTime = (date) => {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

const Chat = () => {
  const { conversaId } = useParams();
  const navigate = useNavigate();
  
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
                  {currentContact.initials}
                  {currentContact.online && <span className="online-indicator" />}
                </div>
                <div className="header-text-details">
                  <div className="header-name-row">
                    <h3>{currentContact.name}</h3>
                    <span className={`role-badge ${currentContact.type}`}>
                      {currentContact.type === "doador" ? "Doador Verificado" : "Vizinho em Busca"}
                    </span>
                  </div>
                  <div className="header-status-pills">
                    <span className="status-pill distance">
                      <MapPin size={12} />
                      {currentContact.distance}
                    </span>
                    <span className={`status-pill state ${currentContact.online ? 'online' : 'offline'}`}>
                      <span className="pulse-dot" />
                      {currentContact.online ? 'Ativo Agora' : 'Offline'}
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
                background: ["#ffd700", "#ffffff", "#0d9488", "#fbbf24", "#38bdf8"][Math.floor(Math.random() * 5)],
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
