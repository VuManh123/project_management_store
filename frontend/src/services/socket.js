import { io } from 'socket.io-client';
import { API_BASE_URL } from '../utils/constants';

let socketInstance = null;

export const initSocket = (token) => {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  const baseURL = API_BASE_URL.replace('/api', '');
  
  socketInstance = io(baseURL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  return socketInstance;
};

export const getSocket = () => {
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export default {
  initSocket,
  getSocket,
  disconnectSocket,
};
