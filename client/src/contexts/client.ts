import { createContext } from 'react';
import io from 'socket.io-client';
//import { SOCKET_URL } from 'config';
import { PORT } from '../../../server/server';

const socketUrl = `http://localhost: ${PORT}`;

export const socket = io(socketUrl, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});
export const ClientContext = createContext(null);
