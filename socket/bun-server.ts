/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-console */
import { Server } from 'socket.io';

import { isAuth } from './middleware';

import type {
  ClientToServerEvents,
  Games,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types';

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

io.use(isAuth);

const games: Games = {};

io.on('connection', (socket) => {
  socket.on('join', (quizId) => {
    socket.join(quizId);
    socket.data.currentGame.id = quizId;

    if

    io.to(quizId).emit('message', `${socket.data.user?.username} joined the game!`);
  });

  socket.on('answer', (answer) => {});

  socket.on('disconnect', () => {
    const { gameId } = socket.data;

    if (gameId) {
      io.to(gameId).emit('message', `${socket.data.user?.username} left the game!`);
    }
  });
});

io.listen(9998);
