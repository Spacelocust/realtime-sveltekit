/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-console */
import { Server } from 'socket.io';

import { isAuth } from './middleware';
import {
  LobbiesState,
  type ClientToServerEvents,
  type InterServerEvents,
  type ServerToClientEvents,
  type SocketData,
} from './types';

import { GameStatus } from '../src/shared/enums/lobby';
import { MessageType } from '../src/shared/enums/socket';

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

io.use(isAuth);

const lobbies: LobbiesState = {};

io.on('connection', (socket) => {
  socket.on('join', (lobbyId, password) => {
    const lobby = lobbies[lobbyId];
    if (!lobby) {
      // TODO: create lobby
      // remove return when lobby is implemented
      return;
    }

    if (lobby.status !== GameStatus.Waiting) {
      socket.emit('message', {
        type: MessageType.Error,
        content: 'Game has already started or finished',
      });
      return;
    }

    if (lobby.players.length >= lobby.maxPlayers) {
      socket.emit('message', {
        type: MessageType.Error,
        content: 'Lobby is full',
      });
      return;
    }

    if (socket.data.user && lobby.players.find((player) => player.id === socket.data.user?.id)) {
      socket.emit('message', {
        type: MessageType.Error,
        content: 'You are already in the lobby',
      });
      return;
    }

    if (lobby.password && lobby.password !== password) {
      socket.emit('message', {
        type: MessageType.Error,
        content: 'Invalid password',
      });
      return;
    }

    socket.join(lobbyId);
    socket.data.lobbyId = lobbyId;

    io.to(lobbyId).emit('message', {
      type: MessageType.Message,
      content: `${socket.data.user?.username} joined the game!`,
    });
  });

  socket.on('start', () => {
    const { lobbyId } = socket.data;

    if (!lobbyId) {
      socket.emit('message', {
        type: MessageType.Error,
        content: 'You need to join a lobby to start the game',
      });
      return;
    }

    const lobby = lobbies[lobbyId];
    if (!lobby) {
      socket.emit('message', {
        type: MessageType.Error,
        content: 'Lobby not found',
      });
      return;
    }

    if (socket.data.user && !lobby.players.find((player) => player.id === socket.data.user?.id)) {
      socket.emit('message', {
        type: MessageType.Error,
        content: 'You are not in the lobby',
      });
      return;
    }

    if (lobby.status === GameStatus.Finished) {
      socket.emit('message', {
        type: MessageType.Error,
        content: 'Game has already finished',
      });
      return;
    }

    if (lobby.owner !== socket.data.user?.id) {
      socket.emit('message', {
        type: MessageType.Error,
        content: 'Only the owner can start the game',
      });
      return;
    }

    lobbies[lobbyId].status = GameStatus.InProgress;

    io.to(lobbyId).emit('message', {
      type: MessageType.Message,
      content: 'Game started!',
    });
  });

  socket.on('addAnswer', (answer) => {});
  socket.on('removeAnswer', (answer) => {});

  socket.on('disconnect', () => {
    const { lobbyId } = socket.data;

    if (lobbyId) {
      io.to(lobbyId).emit('message', {
        type: MessageType.Message,
        content: `${socket.data.user?.username} left the game!`,
      });
    }
  });
});

io.listen(9998);
