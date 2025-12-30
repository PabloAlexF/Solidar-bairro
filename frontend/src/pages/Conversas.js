import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import '../styles/pages/Conversas.css';

const Conversas = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [conversas, setConversas] = useState([]);
  const [filtro, setFiltro] = useState('todas'); // todas, ativas, finalizadas

  useEffect(() => {
    const savedUser = localStorage.getItem('solidar-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Carregar conversas do usuário
    const todasConversas = JSON.parse(localStorage.getItem('solidar-conversas') || '[]');
    const userData = savedUser ? JSON.parse(savedUser) : {};
    
    // Filtrar conversas do usuário atual
    const conversasUsuario = todasConversas.filter(conversa => 
      conversa.participantes && conversa.participantes.some(p => p.id === userData.id)
    );
    
    setConversas(conversasUsuario);
  }, []);



  const criarConversasExemplo = () => {
    const savedUser = JSON.parse(localStorage.getItem('solidar-user') || '{}');
    
    const conversasExemplo = [
      {
        id: 'conv_1',
        tipoAjuda: 'Cesta Básica',
        bairro: 'São Lucas',
        status: 'ativa',
        doadorId: savedUser.id,
        participantes: [
          { id: savedUser.id, nome: savedUser.name || 'Você', tipo: 'doador' },
          { id: 'user_2', nome: 'Ana Paula Silva', tipo: 'recebedor' }
        ],
        ultimaMensagem: 'Obrigada! Posso buscar hoje à tarde?',
        ultimaAtividade: new Date().toISOString(),
        mensagens: [
          {
            id: '1',
            texto: 'Olá! Vi que você precisa de cesta básica. Posso ajudar.',
            remetente: savedUser.id,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            lida: true
          },
          {
            id: '2',
            texto: 'Obrigada! Sim, preciso para mim e meus dois filhos.',
            remetente: 'user_2',
            timestamp: new Date(Date.now() - 3000000).toISOString(),
            lida: true
          },
          {
            id: '3',
            texto: 'Perfeito! Tenho uma cesta completa aqui. Onde podemos nos encontrar?',
            remetente: savedUser.id,
            timestamp: new Date(Date.now() - 2400000).toISOString(),
            lida: true
          },
          {
            id: '4',
            texto: 'Obrigada! Posso buscar hoje à tarde?',
            remetente: 'user_2',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            lida: false
          }
        ]
      },
      {
        id: 'conv_2',
        tipoAjuda: 'Remédios',
        bairro: 'Centro',
        status: 'finalizada',
        doadorId: 'user_3',
        participantes: [
          { id: savedUser.id, nome: savedUser.name || 'Você', tipo: 'recebedor' },
          { id: 'user_3', nome: 'Dr. Carlos Mendes', tipo: 'doador' }
        ],
        ultimaMensagem: 'Ajuda finalizada com sucesso! 🎉',
        ultimaAtividade: new Date(Date.now() - 86400000).toISOString(),
        mensagens: [
          {
            id: '1',
            texto: 'Olá! Tenho os remédios que você precisa.',
            remetente: 'user_3',
            timestamp: new Date(Date.now() - 90000000).toISOString(),
            lida: true
          },
          {
            id: '2',
            texto: 'Muito obrigado! Quando posso buscar?',
            remetente: savedUser.id,
            timestamp: new Date(Date.now() - 89400000).toISOString(),
            lida: true
          },
          {
            id: '3',
            texto: 'Ajuda finalizada com sucesso! 🎉',
            remetente: 'sistema',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            lida: true
          }
        ]
      }
    ];

    localStorage.setItem('solidar-conversas', JSON.stringify(conversasExemplo));
    setConversas(conversasExemplo);
  };

  const conversasFiltradas = conversas.filter(conversa => {
    if (filtro === 'todas') return true;
    if (filtro === 'ativas') return conversa.status === 'ativa';
    if (filtro === 'finalizadas') return conversa.status === 'finalizada';
    return true;
  });

  const formatarTempo = (timestamp) => {
    const agora = new Date();
    const data = new Date(timestamp);
    const diffMs = agora - data;
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHoras < 1) return 'Agora';
    if (diffHoras < 24) return `${diffHoras}h`;
    if (diffDias < 7) return `${diffDias}d`;
    return data.toLocaleDateString('pt-BR');
  };

  const obterOutroParticipante = (conversa) => {
    if (!conversa.participantes || !user) return null;
    return conversa.participantes.find(p => p.id !== user.id);
  };

  const contarMensagensNaoLidas = (conversa) => {
    if (!user || !conversa.mensagens) return 0;
    return conversa.mensagens.filter(m => 
      m.remetente !== user.id && !m.lida && m.remetente !== 'sistema'
    ).length;
  };

  if (!user) {
    return (
      <div className="conversas-page">
        <Header showLoginButton={false} />
        <main className="conversas-main">
          <div className="container">
            <div className="empty-state">
              <div className="empty-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828490.png" alt="login" width="64" height="64" />
              </div>
              <h3>Acesso restrito</h3>
              <p>Você precisa estar logado para ver suas conversas.</p>
              <div className="empty-actions">
                <button 
                  className="btn-primary"
                  onClick={() => window.dispatchEvent(new CustomEvent('openLogin'))}
                >
                  Fazer login
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/')}
                >
                  Voltar ao início
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="conversas-page">
      <Header showLoginButton={false} />
      
      <main className="conversas-main">
        <div className="container">
          <div className="conversas-header">
            <div className="header-content">
              <h1>
                <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="chat" width="32" height="32" className="icon" />
                Minhas Conversas
              </h1>
              <p className="subtitle">Gerencie suas conversas de ajuda</p>
            </div>
            
            <div className="header-actions">
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${filtro === 'todas' ? 'active' : ''}`}
                  onClick={() => setFiltro('todas')}
                >
                  Todas ({conversas.length})
                </button>
                <button 
                  className={`filter-tab ${filtro === 'ativas' ? 'active' : ''}`}
                  onClick={() => setFiltro('ativas')}
                >
                  Ativas ({conversas.filter(c => c.status === 'ativa').length})
                </button>
                <button 
                  className={`filter-tab ${filtro === 'finalizadas' ? 'active' : ''}`}
                  onClick={() => setFiltro('finalizadas')}
                >
                  Finalizadas ({conversas.filter(c => c.status === 'finalizada').length})
                </button>
              </div>
            </div>
          </div>

          <div className="conversas-content">
            {conversasFiltradas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="chat" width="64" height="64" />
                </div>
                <h3>
                  {conversas.length === 0 
                    ? 'Nenhuma conversa ainda' 
                    : `Nenhuma conversa ${filtro === 'ativas' ? 'ativa' : 'finalizada'}`
                  }
                </h3>
                <p>
                  {conversas.length === 0 
                    ? 'Quando você ajudar alguém ou pedir ajuda, suas conversas aparecerão aqui.'
                    : `Você não tem conversas ${filtro === 'ativas' ? 'ativas' : 'finalizadas'} no momento.`
                  }
                </p>
                {conversas.length === 0 && (
                  <div className="empty-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => navigate('/quero-ajudar')}
                    >
                      Quero Ajudar
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => navigate('/preciso-de-ajuda')}
                    >
                      Preciso de Ajuda
                    </button>
                    <button 
                      className="btn-outline"
                      onClick={criarConversasExemplo}
                    >
                      Criar conversas de exemplo
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="conversas-list">
                {conversasFiltradas.map((conversa) => {
                  const outroUsuario = obterOutroParticipante(conversa);
                  const mensagensNaoLidas = contarMensagensNaoLidas(conversa);
                  const isDoador = user && user.id === conversa.doadorId;
                  
                  if (!outroUsuario) return null;
                  
                  return (
                    <div
                      key={conversa.id}
                      className={`conversa-item ${mensagensNaoLidas > 0 ? 'unread' : ''}`}
                      onClick={() => navigate(`/chat/${conversa.id}`)}
                    >
                      <div className="conversa-avatar">
                        {outroUsuario.nome.substring(0, 2).toUpperCase()}
                      </div>
                      
                      <div className="conversa-info">
                        <div className="conversa-header-info">
                          <h3>{outroUsuario.nome}</h3>
                          <div className="conversa-meta">
                            <span className={`user-type ${isDoador ? 'recebedor' : 'doador'}`}>
                              {isDoador ? 'Precisa de Ajuda' : 'Doadora'}
                            </span>
                            <span className="time">
                              {formatarTempo(conversa.ultimaAtividade)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="conversa-details">
                          <div className="help-info">
                            <span className="help-type">📌 {conversa.tipoAjuda}</span>
                            <span className="location">📍 {conversa.bairro}</span>
                            <span className={`status ${conversa.status}`}>
                              {conversa.status === 'ativa' ? '🟢 Ativa' : '✅ Finalizada'}
                            </span>
                          </div>
                          
                          <div className="last-message">
                            <p>{conversa.ultimaMensagem}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="conversa-actions">
                        {mensagensNaoLidas > 0 && (
                          <div className="unread-badge">
                            {mensagensNaoLidas}
                          </div>
                        )}
                        <div className="arrow">→</div>
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Conversas;