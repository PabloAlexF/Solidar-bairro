// Gerenciador de estatísticas do usuário
export const StatsManager = {
  // Registrar quando usuário cria um pedido
  registerPedidoCriado: (userId, pedidoData) => {
    const pedidos = JSON.parse(localStorage.getItem('solidar-pedidos') || '[]');
    const novoPedido = {
      ...pedidoData,
      userId,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'ativo'
    };
    pedidos.push(novoPedido);
    localStorage.setItem('solidar-pedidos', JSON.stringify(pedidos));
    
    // Atualizar estatísticas do usuário
    StatsManager.updateUserStats(userId);
  },

  // Registrar quando usuário oferece ajuda
  registerAjudaOferecida: (userId, pedidoId, ajudaData) => {
    const interesses = JSON.parse(localStorage.getItem('solidar-interesses') || '[]');
    const novoInteresse = {
      ...ajudaData,
      ajudanteId: userId,
      pedidoId,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pendente'
    };
    interesses.push(novoInteresse);
    localStorage.setItem('solidar-interesses', JSON.stringify(interesses));
  },

  // Registrar quando ajuda é concluída
  registerAjudaConcluida: (userId, interesseId) => {
    const interesses = JSON.parse(localStorage.getItem('solidar-interesses') || '[]');
    const interesseIndex = interesses.findIndex(i => i.id === interesseId);
    
    if (interesseIndex !== -1) {
      interesses[interesseIndex].status = 'concluida';
      interesses[interesseIndex].completedAt = new Date().toISOString();
      localStorage.setItem('solidar-interesses', JSON.stringify(interesses));
      
      // Atualizar estatísticas
      StatsManager.updateUserStats(userId);
    }
  },

  // Registrar conversa finalizada
  registerConversaFinalizada: (userId, conversaId) => {
    const conversas = JSON.parse(localStorage.getItem('solidar-conversas') || '[]');
    const conversaIndex = conversas.findIndex(c => c.id === conversaId);
    
    if (conversaIndex !== -1) {
      conversas[conversaIndex].status = 'finalizada';
      conversas[conversaIndex].finalizedAt = new Date().toISOString();
      localStorage.setItem('solidar-conversas', JSON.stringify(conversas));
      
      // Atualizar estatísticas
      StatsManager.updateUserStats(userId);
    }
  },

  // Calcular estatísticas do usuário
  calculateStats: (userId) => {
    if (!userId) return { ajudasConcluidas: 0, pontos: 0, pedidosCriados: 0 };

    // Pedidos criados
    const allPedidos = JSON.parse(localStorage.getItem('solidar-pedidos') || '[]');
    const meusPedidos = allPedidos.filter(p => p.userId === userId);
    
    // Ajudas oferecidas e concluídas
    const allInteresses = JSON.parse(localStorage.getItem('solidar-interesses') || '[]');
    const minhasAjudas = allInteresses.filter(i => i.ajudanteId === userId);
    const ajudasConcluidas = minhasAjudas.filter(a => a.status === 'concluida').length;
    
    // Conversas finalizadas (também conta como ajuda)
    const allConversas = JSON.parse(localStorage.getItem('solidar-conversas') || '[]');
    const conversasFinalizadas = allConversas.filter(c => 
      (c.participants?.includes(userId) || c.userId === userId) && c.status === 'finalizada'
    ).length;
    
    const pedidosCriados = meusPedidos.length;
    const totalAjudas = ajudasConcluidas + conversasFinalizadas;
    const pontos = (totalAjudas * 50) + (pedidosCriados * 10);
    
    return {
      ajudasConcluidas: totalAjudas,
      pontos,
      pedidosCriados
    };
  },

  // Atualizar estatísticas no perfil do usuário
  updateUserStats: (userId) => {
    const stats = StatsManager.calculateStats(userId);
    const user = JSON.parse(localStorage.getItem('solidar-user') || '{}');
    
    if (user.uid === userId || user.id === userId) {
      const updatedUser = {
        ...user,
        ...stats
      };
      localStorage.setItem('solidar-user', JSON.stringify(updatedUser));
      
      // Disparar evento para atualizar UI
      window.dispatchEvent(new CustomEvent('statsUpdated', { detail: stats }));
    }
  },

  // Obter nível baseado nos pontos
  getLevel: (pontos) => {
    const level = Math.floor(pontos / 100) + 1;
    let badge = 'Iniciante';
    
    if (pontos >= 500) badge = 'Expert';
    else if (pontos >= 300) badge = 'Colaborador';
    else if (pontos >= 100) badge = 'Ajudante';
    
    return { level, badge };
  }
};