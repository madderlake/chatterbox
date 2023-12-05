import io from 'socket.io-client';

//const socketUrl = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_SERVER_PORT}`;
const socketUrl = process.env.NODE_ENV === 'production' ? 'https://chatterbox.adaptable.app:8083`: `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_SERVER_PORT}`;
console.log('socket url', socketUrl);
export const socket =
  socketUrl !== undefined &&
  io(socketUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
  });
