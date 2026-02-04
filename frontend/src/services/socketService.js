import io from 'socket.io-client';

let socket;
const SOCKET_URL = 'http://localhost:3001';

export const connectSocket = (userId) => {
  if (socket && socket.connected) return socket;
  
  socket = io(SOCKET_URL, {
    query: { userId },
    transports: ['websocket'],
    reconnectionAttempts: 5
  });
  
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};