import { createContext } from 'react';
import io from 'socket.io-client';
//import { SOCKET_URL } from 'config';

const socketUrl = 'http://localhost:8083';

export const socket = io(socketUrl, { autoConnect: true });
export const SocketContext = createContext(socket);
