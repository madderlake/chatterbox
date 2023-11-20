import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';

import { Server } from 'socket.io';

//Types
import type { User } from '../client/src/redux/slices/userSlice';
import type { Message } from '../client/src/redux/slices/messageSlice';
import StartListeners from './utils/listeners';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.REACT_APP_SERVER_PORT;

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

app.use(
  cors({
    origin: `*`,
    methods: ['GET', 'POST'],
  })
);

const corsOptions = {
  origin: `*`,
  methods: ['GET', 'POST'],
};
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, './dist')));

// Handle GET requests to /api route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from local server!' });
});

// All other GET requests not handled before will return our React app
app.get('/*', (req, res) => {
  console.log(req.path);
  res.sendFile(path.resolve(__dirname, './dist', 'index.html'));
});

export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>(httpServer, {
  /* options */
  cors: corsOptions,
  transports: ['websocket', 'polling'],
});

httpServer.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

io.on('connect', (socket: any) => {
  StartListeners(io, socket);
});
