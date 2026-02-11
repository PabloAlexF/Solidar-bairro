import io from 'socket.io-client';

let socket;
const SOCKET_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:3001';

export const connectSocket = (userId) => {
  console.log('🔌 [SocketService] Tentando conectar socket para:', userId);
  
  if (socket && socket.connected) {
    console.log('✅ [SocketService] Socket já conectado:', socket.id);
    // Garantir que está nas salas corretas
    socket.emit('join_user_room', userId);
    return socket;
  }
  
  console.log('🔄 [SocketService] Criando nova conexão socket...');
  socket = io(SOCKET_URL, {
    query: { userId },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });
  
  // Armazenar instância global para evitar duplicação
  window.socketInstance = socket;
  
  socket.on('connect', () => {
    console.log('✅ [SocketService] Socket conectado! ID:', socket.id, 'UserID:', userId);
    // Entrar nas salas ao conectar
    socket.emit('join_user_room', userId);
  });
  
  socket.on('connect_error', (error) => {
    console.error('❌ [SocketService] Erro de conexão:', error.message);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('⚠️ [SocketService] Socket desconectado. Razão:', reason);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 [SocketService] Socket reconectado após', attemptNumber, 'tentativas');
    socket.emit('join_user_room', userId);
  });
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn('⚠️ [SocketService] getSocket() chamado mas socket não existe!');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('🔌 [SocketService] Desconectando socket...');
    socket.disconnect();
    socket = null;
    window.socketInstance = null;
  }
};