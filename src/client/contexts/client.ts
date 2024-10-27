import io from "socket.io-client";

const socketUrl =
  import.meta.env.NODE_ENV === "production"
    ? `https://chatterbox.adaptable.app`
    : `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_SERVER_PORT}`;

export const socket =
  socketUrl !== undefined &&
  io(socketUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
  });
