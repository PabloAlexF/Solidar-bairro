import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Chat.css';

type UserType = 'doador' | 'receptor';
type MessageType = 'text' | 'image' | 'location' | 'system';
type UrgencyLevel = 'high' | 'medium' | 'low';
type DeliveryStatus = 'aguardando' | 'andamento' | 'entregue';

interface Message {
  id: string;
  type: MessageType;
  sender: UserType | 'system';
  content: string;
  timestamp: Date;
  read?: boolean;
  imageUrl?: string;
  location?: {
    name: string;
    address: string;
  };
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  type: UserType;
  distance: string;
  online: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface HelpInfo {
  type: string;
  urgency: UrgencyLevel;
  bairro: string;
  distance: string;
  status: DeliveryStatus;
}

// Icons
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PackageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const PaperclipIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const MapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CheckDoubleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 6 9 17 4 12" />
    <polyline points="22 10 13 21 11 19" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BanIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const FlagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const BigCheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

export default function Conversas() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
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
  const [currentUser] = useState<UserType>("receptor");
  const [selectedChatId, setSelectedChatId] = useState("1");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("andamento");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts: ChatUser[] = [
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
  ];

  const currentContact = contacts.find(c => c.id === selectedChatId) || contacts[0];

  const helpInfo: HelpInfo = {
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
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "text",
      sender: currentUser,
      content: inputValue,
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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

  return (
    <div className="chat-wrapper desktop-version">
      <div className="chat-layout-container">
        {/* Sidebar */}
        <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <div className="sidebar-title-row">
              <h2>SolidarBairro</h2>
              <button className="new-chat-btn" title="Nova conversa">
                <HeartIcon />
              </button>
            </div>
            <div className="search-bar">
              <SearchIcon />
              <input type="text" placeholder="Buscar conversas..." />
            </div>
          </div>
          <div className="contacts-list">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                className={`contact-item ${selectedChatId === contact.id ? 'active' : ''}`}
                onClick={() => setSelectedChatId(contact.id)}
              >
                <div className="contact-avatar-wrapper">
                  <div className={`contact-avatar ${contact.type}`}>
                    {contact.initials}
                  </div>
                  {contact.online && <span className="online-dot" />}
                </div>
                <div className="contact-info">
                  <div className="contact-name-row">
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-time">{contact.lastMessageTime}</span>
                  </div>
                  <div className="contact-preview-row">
                    <p className="contact-last-message">{contact.lastMessage}</p>
                    {contact.unreadCount > 0 && (
                      <span className="unread-badge">{contact.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
             <div className="user-profile-small">
               <div className="user-avatar-mini">EU</div>
               <div className="user-meta-mini">
                 <span className="user-name-mini">Seu Perfil</span>
                 <span className="user-status-mini">Online</span>
               </div>
             </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-main">
          {/* Header */}
          <header className="chat-header">
            <div className="chat-header-left">
              <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <ArrowLeftIcon />
              </button>
              <div className="chat-user-info">
                <div className="chat-avatar">
                  {currentContact.initials}
                  {currentContact.online && <span className="online-indicator" />}
                </div>
                <div className="chat-user-details">
                  <h3>
                    {currentContact.name}
                    <span className={`user-tag ${currentContact.type}`}>
                      {currentContact.type === "doador" ? "Doadora" : "Precisa de Ajuda"}
                    </span>
                  </h3>
                  <p>
                    <MapPinIcon />
                    {currentContact.distance}
                  </p>
                </div>
              </div>
            </div>
            <div className="chat-header-right">
              <button className="header-icon-btn" title="Ligar">
                <PhoneIcon />
              </button>
              <button
                className="header-icon-btn danger"
                onClick={() => setShowReportModal(true)}
                title="Segurança"
              >
                <AlertIcon />
              </button>
            </div>
          </header>

          <div className="header-connection">
            <HeartIcon />
            Conectados através do SolidarBairro
          </div>

          <div className="chat-body-scrollable">
            {/* Info Card */}
            <div className="chat-info-card desktop-card">
              <div className="info-card-left">
                <div className="info-card-icon">
                  <PackageIcon />
                </div>
                <div className="info-card-details">
                  <h4>
                    <span>Resumo da ajuda</span>
                  </h4>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem" }}>
                    {helpInfo.type}
                  </p>
                  <div className="info-card-meta">
                    <span className={`urgency-tag ${helpInfo.urgency}`}>
                      Urgência {helpInfo.urgency === "high" ? "Alta" : helpInfo.urgency === "medium" ? "Média" : "Baixa"}
                    </span>
                    <span className="meta-item">
                      <MapPinIcon />
                      {helpInfo.bairro} • {helpInfo.distance}
                    </span>
                  </div>
                </div>
              </div>
              <div className="info-card-center">
                <div className="status-stepper">
                  <div className={`step ${deliveryStatus === "aguardando" || deliveryStatus === "andamento" || deliveryStatus === "entregue" ? "active" : ""}`}>
                    <div className="step-circle" onClick={() => setDeliveryStatus("aguardando")}>1</div>
                    <span>Aguardando</span>
                  </div>
                  <div className="step-line" />
                  <div className={`step ${deliveryStatus === "andamento" || deliveryStatus === "entregue" ? "active" : ""}`}>
                    <div className="step-circle" onClick={() => setDeliveryStatus("andamento")}>2</div>
                    <span>Em andamento</span>
                  </div>
                  <div className="step-line" />
                  <div className={`step ${deliveryStatus === "entregue" ? "active" : ""}`}>
                    <div className="step-circle" onClick={() => setDeliveryStatus("entregue")}>3</div>
                    <span>Entregue</span>
                  </div>
                </div>
              </div>
              <div className="info-card-right">
                <button className="btn-details">
                  Ver detalhes
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              <div className="date-divider">
                <span>Hoje</span>
              </div>

              {messages.map((message) => {
                if (message.type === "system") {
                  return (
                    <div key={message.id} className="message system-message">
                      <div className="message-bubble">
                        <ShieldIcon />
                        {message.content}
                      </div>
                    </div>
                  );
                }

                if (message.type === "location") {
                  return (
                    <div key={message.id} className={`message ${message.sender}`}>
                      <div className="message-location">
                        <div className="location-preview">
                          <MapPinIcon />
                        </div>
                        <div className="location-info">
                          <h5>{message.location?.name}</h5>
                          <p>{message.location?.address}</p>
                        </div>
                      </div>
                      <div className="message-meta">
                        <span className="message-time">{formatTime(message.timestamp)}</span>
                        {message.sender === currentUser && (
                          <span className={`message-status ${message.read ? "read" : ""}`}>
                            <CheckDoubleIcon />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={message.id} className={`message ${message.sender}`}>
                    <div className="message-bubble">{message.content}</div>
                    <div className="message-meta">
                      <span className="message-time">{formatTime(message.timestamp)}</span>
                      {message.sender === currentUser && (
                        <span className={`message-status ${message.read ? "read" : ""}`}>
                          {message.read ? <CheckDoubleIcon /> : <CheckIcon />}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="message typing-indicator">
                  <div className="message-bubble">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Finish Delivery Action */}
          {deliveryStatus === "andamento" && (
            <div className="action-bar-floating">
               <p>A entrega foi realizada?</p>
               <button
                className="finish-delivery-btn-small"
                onClick={() => setShowFinishModal(true)}
              >
                <HeartIcon />
                Confirmar Entrega
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="chat-input-area">
            <div className="input-row-desktop">
              <div className="input-actions-desktop">
                <button className="input-action-btn-desktop" title="Anexar arquivo">
                  <PaperclipIcon />
                </button>
                <button className="input-action-btn-desktop" title="Enviar localização">
                  <MapIcon />
                </button>
              </div>
              <div className="input-field-wrapper-desktop">
                <textarea
                  className="input-field-desktop"
                  placeholder="Escreva uma mensagem..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                />
              </div>
              <button
                className={`send-btn-desktop ${currentUser === "receptor" ? "receptor-mode" : ""}`}
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon danger">
                <AlertIcon />
              </div>
              <h3>Segurança e Denúncia</h3>
            </div>
            <div className="modal-body">
              <p>O SolidarBairro preza pela sua segurança. O que ocorreu?</p>
              <div className="modal-options">
                <button className="modal-option">
                  <FlagIcon />
                  Denunciar comportamento inadequado
                </button>
                <button className="modal-option danger">
                  <BanIcon />
                  Bloquear este usuário permanentemente
                </button>
                <button className="modal-option">
                  <ShieldIcon />
                  Solicitar suporte da moderação
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-modal secondary"
                onClick={() => setShowReportModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish Delivery Modal */}
      {showFinishModal && (
        <div className="modal-overlay" onClick={() => setShowFinishModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon success">
                <HeartIcon />
              </div>
              <h3>Concluir Doação</h3>
            </div>
            <div className="modal-body">
              <p>Você confirma que a ajuda foi entregue com sucesso?</p>
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                Isso ajudará a manter o mapa de solidariedade atualizado.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-modal secondary"
                onClick={() => setShowFinishModal(false)}
              >
                Ainda não
              </button>
              <button className="btn-modal primary" onClick={handleFinishDelivery}>
                Sim, tudo certo!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="confirmation-animation">
              <div className="check-circle">
                <BigCheckIcon />
              </div>
              <h4>Missão Cumprida!</h4>
              <p>A união faz a força no SolidarBairro.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}