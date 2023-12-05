import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import * as path from 'path';

import { Server } from 'socket.io';

//Types
import type { User, Message } from '../types';
import StartListeners from './server/utils/listeners';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.REACT_APP_SERVER_PORT || process.env.PORT || 8083;

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

const corsOptions = {
  origin: '*',
  methods: ['GET', 'OPTIONS'],
};
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../dist')));

// Handle GET requests to /api route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from local server!' });
});

// All other GET requests not handled before will return our React app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  res.writeHead(200, {
    'Content-Type': 'text',
    'Access-Control-Allow-Origin': corsOptions.origin,
    'Access-Control-Allow-Methods': corsOptions.methods,
    'Access-Control-Max-Age': 2592000,
  });
});

export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>(httpServer, {
  /* options */
  connectionStateRecovery: {},
  cors: corsOptions,
  transports: ['websocket', 'polling'],
});

httpServer.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

io.on('connect', (socket: any) => {
  StartListeners(io, socket);
});
