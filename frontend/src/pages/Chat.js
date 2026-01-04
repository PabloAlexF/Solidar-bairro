import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import '../styles/pages/Chat.css';

const Chat = () => {
  const { conversaId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState(null);
  const [conversa, setConversa] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('solidar-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Carregar conversa específica
    const conversas = JSON.parse(localStorage.getItem('solidar-conversas') || '[]');
    const conversaAtual = conversas.find(c => c.id === conversaId);
    
    if (conversaAtual) {
      setConversa(conversaAtual);
      setMensagens(conversaAtual.mensagens || []);
    }
  }, [conversaId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const enviarMensagem = (e) => {
    e.preventDefault();
    if (!novaMensagem.trim() || !user || !conversa) return;

    const mensagem = {
      id: Date.now().toString(),
      texto: novaMensagem,
      remetente: user.id,
      timestamp: new Date().toISOString(),
      lida: false
    };

    const novasMensagens = [...mensagens, mensagem];
    setMensagens(novasMensagens);

    // Atualizar localStorage
    const conversas = JSON.parse(localStorage.getItem('solidar-conversas') || '[]');
    const conversaIndex = conversas.findIndex(c => c.id === conversaId);
    if (conversaIndex !== -1) {
      conversas[conversaIndex].mensagens = novasMensagens;
      conversas[conversaIndex].ultimaMensagem = novaMensagem;
      conversas[conversaIndex].ultimaAtividade = new Date().toISOString();
      localStorage.setItem('solidar-conversas', JSON.stringify(conversas));
    }

    setNovaMensagem('');
  };

  const finalizarAjuda = () => {
    if (!conversa) return;
    
    const conversas = JSON.parse(localStorage.getItem('solidar-conversas') || '[]');
    const conversaIndex = conversas.findIndex(c => c.id === conversaId);
    
    if (conversaIndex !== -1) {
      conversas[conversaIndex].status = 'finalizada';
      localStorage.setItem('solidar-conversas', JSON.stringify(conversas));
      
      // Adicionar mensagem do sistema
      const mensagemSistema = {
        id: Date.now().toString(),
        texto: 'Ajuda finalizada com sucesso! 🎉',
        remetente: 'sistema',
        timestamp: new Date().toISOString(),
        lida: true
      };
      
      conversas[conversaIndex].mensagens.push(mensagemSistema);
      localStorage.setItem('solidar-conversas', JSON.stringify(conversas));
      setMensagens([...mensagens, mensagemSistema]);
    }
  };

  const enviarLocalizacao = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const mensagem = {
          id: Date.now().toString(),
          texto: `📍 Localização compartilhada`,
          remetente: user.id,
          timestamp: new Date().toISOString(),
          lida: false,
          tipo: 'localizacao',
          coordenadas: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        };

        const novasMensagens = [...mensagens, mensagem];
        setMensagens(novasMensagens);

        // Atualizar localStorage
        const conversas = JSON.parse(localStorage.getItem('solidar-conversas') || '[]');
        const conversaIndex = conversas.findIndex(c => c.id === conversaId);
        if (conversaIndex !== -1) {
          conversas[conversaIndex].mensagens = novasMensagens;
          localStorage.setItem('solidar-conversas', JSON.stringify(conversas));
        }
      });
    }
  };

  if (!conversa || !user) {
    return (
      <div className="chat-loading">
        <Header showLoginButton={false} />
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Carregando conversa...</p>
        </div>
      </div>
    );
  }

  const outroUsuario = conversa.participantes.find(p => p.id !== user.id);
  const isDoador = user.id === conversa.doadorId;

  return (
    <div className="chat-page">
      <Header showLoginButton={false} />
      
      {/* Cabeçalho do Chat */}
      <div className="chat-header">
        <div className="chat-header-content">
          <button className="back-btn" onClick={() => navigate('/conversas')}>
            ←
          </button>
          
          <div className="chat-user-info">
            <div className="chat-avatar">
              {outroUsuario.nome.substring(0, 2).toUpperCase()}
            </div>
            <div className="chat-user-details">
              <h3>{outroUsuario.nome}</h3>
              <div className="user-tags">
                <span className={`user-tag ${isDoador ? 'recebedor' : 'doador'}`}>
                  {isDoador ? 'Precisa de Ajuda' : 'Doadora'}
                </span>
                <span className="distance">450 metros de você</span>
              </div>
            </div>
          </div>
          
          <div className="chat-actions">
            <button className="action-btn report-btn" onClick={() => setShowReportModal(true)}>
              ❗
            </button>
          </div>
        </div>
        
        <div className="connection-info">
          Conectados através do SolidarBairro
        </div>
      </div>

      {/* Card da Ajuda */}
      <div className="help-card">
        <div className="help-info">
          <h4>📌 {conversa.tipoAjuda}</h4>
          <div className="help-details">
            <span className="urgency high">Urgência: Alta</span>
            <span className="location">Bairro: {conversa.bairro}</span>
            <span className="distance">Distância: 450 m</span>
          </div>
          <div className="help-status">
            Status: <span className={`status ${conversa.status}`}>
              {conversa.status === 'ativa' ? 'Em andamento' : 'Finalizada'}
            </span>
          </div>
        </div>
        <button className="details-btn">
          ➡️ Ver detalhes
        </button>
      </div>

      {/* Mensagens */}
      <div className="chat-messages">
        {mensagens.map((mensagem) => (
          <div
            key={mensagem.id}
            className={`message ${
              mensagem.remetente === 'sistema' 
                ? 'system-message' 
                : mensagem.remetente === user.id 
                  ? 'sent' 
                  : 'received'
            }`}
          >
            {mensagem.remetente === 'sistema' ? (
              <div className="system-content">
                {mensagem.texto}
              </div>
            ) : (
              <div className="message-content">
                <p>{mensagem.texto}</p>
                <span className="message-time">
                  {new Date(mensagem.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Caixa de Envio */}
      <div className="chat-input-container">
        <form onSubmit={enviarMensagem} className="chat-form">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Escreva uma mensagem..."
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              className="message-input"
            />
            <div className="input-actions">
              <button type="button" className="attachment-btn" onClick={enviarLocalizacao}>
                🗺️
              </button>
              <button type="button" className="attachment-btn">
                📎
              </button>
            </div>
          </div>
          <button type="submit" className={`send-btn ${isDoador ? 'doador' : 'recebedor'}`}>
            →
          </button>
        </form>
        
        {conversa.status === 'ativa' && (
          <button className="finalize-btn" onClick={finalizarAjuda}>
            💚 Finalizar entrega
          </button>
        )}
      </div>

      {/* Modal de Denúncia */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reportar usuário</h3>
            <div className="report-options">
              <button className="report-option">Comportamento inadequado</button>
              <button className="report-option">Spam ou golpe</button>
              <button className="report-option">Não cumpriu acordo</button>
              <button className="report-option">Outro motivo</button>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowReportModal(false)}>
                Cancelar
              </button>
              <button className="btn-danger">
                Reportar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;