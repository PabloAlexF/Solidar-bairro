import io from 'socket.io-client';

let socket;
const SOCKET_URL = 'http://localhost:3001';

export const connectSocket = (userId) => {
  console.log('🔌 [SocketService] Tentando conectar socket para:', userId);
  
  if (socket && socket.connected) {
    console.log('✅ [SocketService] Socket já conectado:', socket.id);
    return socket;
  }
  
  console.log('🔄 [SocketService] Criando nova conexão socket...');
  socket = io(SOCKET_URL, {
    query: { userId },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5
  });
  
  socket.on('connect', () => {
    console.log('✅ [SocketService] Socket conectado! ID:', socket.id, 'UserID:', userId);
  });
  
  socket.on('connect_error', (error) => {
    console.error('❌ [SocketService] Erro de conexão:', error.message);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('⚠️ [SocketService] Socket desconectado. Razão:', reason);
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
  }
};