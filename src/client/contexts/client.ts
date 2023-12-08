import io from 'socket.io-client';

const socketUrl =
  process.env.NODE_ENV === 'production'
    ? `https://chatterbox.adaptable.app`
    : `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_SERVER_PORT}`;

export const socket =
  socketUrl !== undefined &&
  io(socketUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
  });
