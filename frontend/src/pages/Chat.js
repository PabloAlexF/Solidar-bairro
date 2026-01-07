import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/pages/Chat.css";

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
  const [currentUser] = useState("receptor");
  const [selectedChatId, setSelectedChatId] = useState("1");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState("andamento");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef(null);

  const contacts = [
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
    }
  }, [conversaId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
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

  return (
    <div className="chat-wrapper desktop-version">
      <div className="chat-layout-container">
        {/* Sidebar */}
        <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <div className="sidebar-title-row">
              <h2>SolidarBairro</h2>
              <button className="new-chat-btn" title="Nova conversa">
                <i className="fi fi-rr-heart"></i>
              </button>
            </div>
            <div className="search-bar">
              <i className="fi fi-rr-search"></i>
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
              <button className="sidebar-toggle" onClick={() => navigate('/conversas')}>
                <i className="fi fi-rr-arrow-left"></i>
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
                    <i className="fi fi-rr-marker"></i>
                    {currentContact.distance}
                  </p>
                </div>
              </div>
            </div>
            <div className="chat-header-right">
              <button className="header-icon-btn" title="Ligar">
                <i className="fi fi-rr-phone-call"></i>
              </button>
              <button
                className="header-icon-btn danger"
                onClick={() => setShowReportModal(true)}
                title="Segurança"
              >
                <i className="fi fi-rr-triangle-warning"></i>
              </button>
            </div>
          </header>

          <div className="header-connection">
            <i className="fi fi-rr-heart"></i>
            Conectados através do SolidarBairro
          </div>

          <div className="chat-body-scrollable">
            {/* Info Card */}
            <div className="chat-info-card desktop-card">
              <div className="info-card-left">
                <div className="info-card-icon">
                  <i className="fi fi-rr-box"></i>
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
                      <i className="fi fi-rr-marker"></i>
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
                  <i className="fi fi-rr-angle-right"></i>
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
                        <i className="fi fi-rr-shield-check"></i>
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
                          <i className="fi fi-rr-marker"></i>
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
                            <i className="fi fi-rr-check-double"></i>
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
                          {message.read ? <i className="fi fi-rr-check-double"></i> : <i className="fi fi-rr-check"></i>}
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
                <i className="fi fi-rr-heart"></i>
                Confirmar Entrega
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="chat-input-area">
            <div className="input-row-desktop">
              <div className="input-actions-desktop">
                <button className="input-action-btn-desktop" title="Anexar arquivo">
                  <i className="fi fi-rr-paperclip"></i>
                </button>
                <button className="input-action-btn-desktop" title="Enviar localização">
                  <i className="fi fi-rr-map"></i>
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
                <i className="fi fi-rr-paper-plane"></i>
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
                <i className="fi fi-rr-triangle-warning"></i>
              </div>
              <h3>Segurança e Denúncia</h3>
            </div>
            <div className="modal-body">
              <p>O SolidarBairro preza pela sua segurança. O que ocorreu?</p>
              <div className="modal-options">
                <button className="modal-option">
                  <i className="fi fi-rr-flag"></i>
                  Denunciar comportamento inadequado
                </button>
                <button className="modal-option danger">
                  <i className="fi fi-rr-ban"></i>
                  Bloquear este usuário permanentemente
                </button>
                <button className="modal-option">
                  <i className="fi fi-rr-shield-check"></i>
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
                <i className="fi fi-rr-heart"></i>
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
                <i className="fi fi-rr-check" style={{ fontSize: '40px', color: 'white' }}></i>
              </div>
              <h4>Missão Cumprida!</h4>
              <p>A união faz a força no SolidarBairro.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;