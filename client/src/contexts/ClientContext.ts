import React, {createContext} from 'react';
import io from 'socket.io-client';

const socketUrl = 'http://localhost:8083';

export const client = io(socketUrl).connect();
export const ClientContext: React.Context<any> = createContext(null);
