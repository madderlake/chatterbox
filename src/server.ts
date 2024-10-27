import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// get the resolved path to the file
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file

// get the name of the directory
const __dirname = path.dirname(__filename); // get the name of the directory

import { Server } from "socket.io";

//Types
import type { User, Message } from "../types";
import StartListeners from "./server/listeners";

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.VITE_SERVER_PORT || process.env.PORT || 8083;

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
  origin: "*",
  methods: ["GET", "OPTIONS"],
};
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../dist")));

// Handle GET requests to /api route
// app.get("/", (req, res) => {
//   res.json({ message: "Hello from local server!" });
// });

// All other GET requests not handled before will return our React app
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>(httpServer, {
  /* options */
  connectionStateRecovery: {},
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

httpServer.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

io.on("connect", (socket: any) => {
  StartListeners(io, socket);
});
