import io from "socket.io-client";

const socketUrl =
  process.env.NODE_ENV === "production"
    ? `https://famous-aurie-madderlake-6cff3876.koyeb.app/`
    : `${process.env.VITE_BACKEND_URL}:${process.env.VITE_SERVER_PORT}`;

export const socket =
  socketUrl !== undefined &&
  io(socketUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
  });
