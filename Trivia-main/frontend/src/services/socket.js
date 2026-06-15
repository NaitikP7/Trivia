import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});
