/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-console */
import { Server } from 'socket.io';

import { isAuth } from './middleware';
import {
  GameStatus,
  type ClientToServerEvents,
  type InterServerEvents,
  type Lobbies,
  type ServerToClientEvents,
  type SocketData,
} from './types';

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

io.use(isAuth);

const lobbies: Lobbies = {};

io.on('connection', (socket) => {
  socket.on('join', (lobbyKey, password) => {
    const lobby = lobbies[lobbyKey];
    if (!lobby) {
      // TODO: create lobby
      // remove return when lobby is implemented
      return;
    }

    if (lobby.game.status !== 'waiting') {
      socket.emit('message', 'You can only join a lobby that is waiting for players');
      return;
    }

    if (lobby.players.length >= lobby.maxPlayers) {
      socket.emit('message', 'Lobby is full');
      return;
    }

    if (socket.data.user && lobby.players.includes(socket.data.user.id)) {
      socket.emit('message', 'You are already in the lobby');
      return;
    }

    if (lobby.password && lobby.password !== password) {
      socket.emit('message', 'Invalid password');
      return;
    }

    socket.join(lobbyKey);
    socket.data.lobbyKey = lobbyKey;

    io.to(lobbyKey).emit('message', `${socket.data.user?.username} joined the game!`);
  });

  socket.on('start', () => {
    const { lobbyKey } = socket.data;

    if (!lobbyKey) {
      socket.emit('message', 'You need to join a lobby to start the game');
      return;
    }

    const lobby = lobbies[lobbyKey];
    if (!lobby) {
      socket.emit('message', 'Lobby not found');
      return;
    }

    if (socket.data.user && !lobby.players.includes(socket.data.user.id)) {
      socket.emit('message', 'You are not in the lobby');
      return;
    }

    if (lobby.game.status !== GameStatus.Waiting) {
      socket.emit('message', 'Game has already started or finished');
      return;
    }

    if (lobby.owner !== socket.data.user?.id) {
      socket.emit('message', 'Only the owner can start the game');
      return;
    }

    lobbies[lobbyKey].game.status = GameStatus.InProgress;

    io.to(lobbyKey).emit('message', 'Game started!');
  });

  socket.on('answer', (answer) => {});

  socket.on('disconnect', () => {
    const { lobbyKey } = socket.data;

    if (lobbyKey) {
      io.to(lobbyKey).emit('message', `${socket.data.user?.username} left the game!`);
    }
  });
});

io.listen(9998);
