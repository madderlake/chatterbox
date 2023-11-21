import { createContext } from 'react';
import io from 'socket.io-client';
import { PORT } from '../../server';

const socketUrl = `https://localhost:${PORT}`;

export const socket = io.connect(socketUrl);
export const SocketContext = createContext();
