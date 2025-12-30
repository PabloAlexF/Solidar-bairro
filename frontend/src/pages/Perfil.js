import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Perfil.css';
const Perfil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Simular busca de dados do usuário
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Aqui seria a chamada real para a API
        // const response = await fetch('/api/user/profile');
        // const userData = await response.json();
        
        // Simulando dados não encontrados no banco
        setTimeout(() => {
          setUser({
            name: "Usuário não identificado",
            email: "Não informado",
            memberSince: "Data não disponível",
            location: "Localização não informada",
            avatar: null,
            bio: "Biografia não cadastrada",
            stats: {
              helpsGiven: 0,
              requestsMade: 0,
              impactPoints: 0
            },
            isVerified: false
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Erro ao carregar dados do perfil');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar perfil</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Início
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Seção Superior - Perfil e Impacto lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Card Principal do Perfil */}
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-6">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-orange-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            
            {/* Nome do Usuário */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              {/* Selo de Verificação */}
              {user.isVerified ? (
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center" title="Conta não verificada">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Tipo de Conta */}
            <div className="inline-block bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-sm font-medium mb-6">
              Tipo de conta não definido
            </div>
            
            {/* Informações de Contato */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{user.email}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9" />
                </svg>
                <span className="text-sm">{user.memberSince}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{user.location}</span>
              </div>
            </div>
            
            {/* Botão de Ação */}
            <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
              Completar Perfil
            </button>
          </div>
          
          {/* Card "Seu Impacto" */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-orange-100 font-bold uppercase tracking-wide text-sm mb-4">Seu Impacto</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold">{user.stats.impactPoints}</span>
                <span className="text-orange-200 font-semibold">pontos</span>
              </div>
              <p className="text-orange-100 text-sm leading-relaxed mb-6">
                Você ainda não possui atividades registradas. Comece ajudando ou pedindo ajuda para acumular pontos!
              </p>
              <div className="mb-2">
                <div className="h-3 bg-orange-700/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white/40 w-0 rounded-full" />
                </div>
              </div>
              <p className="text-xs text-orange-200 font-semibold">🚀 Comece sua jornada solidária</p>
            </div>
          </div>
        </div>
        
        {/* Cards Inferiores */}
        <div className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{user.stats.helpsGiven}</div>
                <div className="text-sm text-gray-600">Nenhuma ajuda oferecida ainda</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14"/>
                  <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h11c1.1 0 2.1-.4 2.8-1.2l5.1-5.1c.4-.4.4-1 0-1.4s-1-.4-1.4 0L15 15"/>
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{user.stats.requestsMade}</div>
                <div className="text-sm text-gray-600">Nenhum pedido realizado ainda</div>
              </div>
            </div>
          </div>
          
          {/* Card "Detalhes da Conta" */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Cabeçalho */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Detalhes da Conta
              </h2>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Seção "Sobre Você" */}
              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-3">Sobre Você</label>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-gray-500 italic">"{user.bio}"</p>
                </div>
              </div>
              
              <div className="h-px bg-gray-100" />
              
              <div className="grid sm:grid-cols-2 gap-8">
                {/* Seção "Segurança" */}
                <div>
                  <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-3">Segurança</label>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-800">Senha</div>
                        <div className="text-xs text-gray-500">Não configurada</div>
                      </div>
                    </div>
                    <button className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                      Definir
                    </button>
                  </div>
                </div>
                
                {/* Seção "Status da Conta" */}
                <div>
                  <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-3">Status da Conta</label>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <div className="font-semibold text-red-800">Não Verificada</div>
                        <div className="text-xs text-red-600">Complete seu perfil para verificação</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card de Conquista */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">🎆 Bem-vindo ao Solidar Bairro!</h3>
              </div>
              <p className="text-slate-300 text-base mb-8 leading-relaxed">
                Sua jornada solidária começa agora! Conecte-se com sua comunidade, ajude seus vizinhos e construa um bairro mais unido. Cada ação conta e faz a diferença.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/preciso-de-ajuda')}
                  className="group bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14"/>
                    <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h11c1.1 0 2.1-.4 2.8-1.2l5.1-5.1c.4-.4.4-1 0-1.4s-1-.4-1.4 0L15 15"/>
                  </svg>
                  Preciso de Ajuda
                </button>
                <button 
                  onClick={() => navigate('/quero-ajudar')}
                  className="group bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  Quero Ajudar
                </button>
              </div>
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Dica:</span>
                  <span>Comece oferecendo ajuda para ganhar seus primeiros pontos e conquistar o selo "Vizinho Amigo"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;