/* eslint-disable no-console */
import { Server } from 'socket.io';

import { isAuth } from './middleware';

import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types';

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

io.use(isAuth);

io.on('connection', (socket) => {
  socket.emit('message', '[init]: Hello from server!');

  console.log('client connected : ', socket.data);
});

io.listen(9998);
