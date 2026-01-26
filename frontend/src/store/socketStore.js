import { create } from 'zustand';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../utils/constants';

const useSocketStore = create((set, get) => ({
  socket: null,
  connected: false,
  rooms: [],
  error: null,

  // Connect to socket
  connect: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ error: 'No token available' });
      return;
    }

    const socket = io(API_BASE_URL.replace('/api', ''), {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      set({ connected: true, error: null });
    });

    socket.on('disconnect', () => {
      set({ connected: false });
    });

    socket.on('connect_error', (error) => {
      set({ error: error.message, connected: false });
    });

    socket.on('reconnect', (attemptNumber) => {
      set({ connected: true, error: null });
    });

    socket.on('reconnect_error', (error) => {
      set({ error: error.message });
    });

    set({ socket });
  },

  // Disconnect from socket
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, connected: false, rooms: [] });
    }
  },

  // Join a room
  joinRoom: (roomName) => {
    const { socket, rooms } = get();
    if (socket && !rooms.includes(roomName)) {
      socket.emit('join_room', roomName);
      set({ rooms: [...rooms, roomName] });
    }
  },

  // Leave a room
  leaveRoom: (roomName) => {
    const { socket, rooms } = get();
    if (socket && rooms.includes(roomName)) {
      socket.emit('leave_room', roomName);
      set({ rooms: rooms.filter((r) => r !== roomName) });
    }
  },

  // Emit event
  emit: (event, data) => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit(event, data);
    }
  },

  // Listen to event
  on: (event, callback) => {
    const { socket } = get();
    if (socket) {
      socket.on(event, callback);
      // Return cleanup function
      return () => {
        socket.off(event, callback);
      };
    }
  },

  // Remove event listener
  off: (event, callback) => {
    const { socket } = get();
    if (socket) {
      socket.off(event, callback);
    }
  },
}));

export default useSocketStore;
