import * as express from 'express';
// server/index.js
const path = require('path');
import * as http from 'http';
import * as cors from 'cors';
import { Server } from 'socket.io';

import type { User } from './src/redux/slices/userSlice';
import type { Message } from './src/redux/slices/messageSlice';
import StartListeners from './src/server/listeners';

const app = express();
const httpServer = http.createServer(app);
const PORT = 8083;

type Data = User | Message;
type BasicEmit = (data: Data | Data[]) => void;

export interface ServerToClientEvents {
  noArg: () => void;
  roomUsers: BasicEmit;
  roomMessages: BasicEmit;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

app.use(cors());

app.use(express.static(path.resolve(__dirname, '/dist')));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '/dist', 'index.html'));
});
export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>(httpServer, {
  /* options */
  cors: {
    origin: `*`,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

httpServer.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

io.on('connect', (socket: any) => {
  StartListeners(io, socket);
});
