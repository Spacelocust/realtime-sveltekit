/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-console */
import { Server } from 'socket.io';

import { createLobby } from './controllers';
import { isAuth } from './middleware';
import { createEmitter } from './utils';

import { GameStatus } from '../src/shared/enums/lobby';
import { MessageType } from '../src/shared/enums/socket';

import type {
  LobbyStates,
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
  SocketServer,
  Timers,
  ServerIO,
} from './types';

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

io.use(isAuth);

const lobbies: LobbyStates = {};

const timers: Timers = {
  answer: {},
  interlude: {},
};

const createAnswerTimer = (socket: SocketServer) => {
  return setInterval(() => {
    const lobby = lobbies[socket.data.lobbyId];
    if (lobby) {
      if (lobby.game.currentQuestion.timeLeft > 0) {
        const time = (lobbies[socket.data.lobbyId].game.currentQuestion.timeLeft =
          lobby.game.currentQuestion.timeLeft - 1);

        io.to(socket.data.lobbyId).emit('answerTimer', time);
      } else {
        clearInterval(timers.answer[socket.data.lobbyId]);
        socket.emit('questionResult', {
          playerAnswers: socket.data.currentAnswers,
          correctAnswers: lobby.game.currentQuestion.correctAnswers,
          countPerAnswer: lobby.game.currentQuestion.countPerAnswer,
        });
        createInterludeTimer(socket);
      }
    }
  }, 1000);
};

const createInterludeTimer = (socket: SocketServer) => {
  return setInterval(() => {
    const lobby = lobbies[socket.data.lobbyId];
    if (lobby) {
      if (lobby.game.timeInterludeLeft > 0) {
        const time = (lobbies[socket.data.lobbyId].game.timeInterludeLeft =
          lobby.game.timeInterludeLeft - 1);

        io.to(socket.data.lobbyId).emit('interludeTimer', time);
      } else {
        clearInterval(timers.answer[socket.data.lobbyId]);
        const nextQuestionId = lobbies[socket.data.lobbyId].game.questionsLeft.shift();
        if (nextQuestionId) {
          // TODO: get next question
          // lobbies[socket.data.lobbyId].game.currentQuestion = nextQuestion;
          // io.to(socket.data.lobbyId).emit('question', nextQuestion);
          // createAnswerTimer(socket);
        } else {
          lobbies[socket.data.lobbyId].status = GameStatus.Finished;
          io.to(socket.data.lobbyId).emit('lobbyStatus', GameStatus.Finished);
        }
      }
    }
  }, 1000);
};

io.on('connection', (socket) => {
  const { emitError } = createEmitter(socket);

  socket.on('join', async (lobbyId, password) => {
    let lobby = lobbies[lobbyId];
    if (!lobby) {
      try {
        lobbies[lobbyId] = await createLobby(lobbyId);
        lobby = lobbies[lobbyId];
      } catch (error) {
        emitError('Lobby not found');
        return;
      }
    }

    if (lobby.status === GameStatus.Finished) {
      emitError('Game has already finished');
      return;
    }

    if (lobby.players.length >= lobby.maxPlayers) {
      emitError('Lobby is full');
      return;
    }

    if (socket.data.user && lobby.players.find((player) => player.id === socket.data.user?.id)) {
      emitError('You are already in the lobby');
      return;
    }

    if (lobby.password && lobby.password !== password) {
      emitError('Invalid password');
      return;
    }

    socket.join(lobbyId);
    socket.data.lobbyId = lobbyId;

    lobbies[lobbyId].players.push({
      id: socket.data.user?.id || '',
      name: socket.data.user?.username || '',
      score: 0,
    });

    io.to(lobbyId).emit('message', {
      type: MessageType.Message,
      content: `${socket.data.user?.username} joined the game!`,
    });

    io.to(lobbyId).emit('players', lobbies[lobbyId].players);
  });

  socket.on('start', () => {
    const { lobbyId } = socket.data;

    if (!lobbyId) {
      emitError('You need to join a lobby to start the game');
      return;
    }

    const lobby = lobbies[lobbyId];
    if (!lobby) {
      emitError('Lobby not found');
      return;
    }

    if (socket.data.user && !lobby.players.find((player) => player.id === socket.data.user?.id)) {
      emitError('You are not in the lobby');
      return;
    }

    if (lobby.status === GameStatus.Finished) {
      emitError('Game has already finished');
      return;
    }

    if (lobby.owner !== socket.data.user?.id) {
      emitError('Only the owner can start the game');
      return;
    }

    lobbies[lobbyId].status = GameStatus.InProgress;

    io.to(lobbyId).emit('message', {
      type: MessageType.Message,
      content: 'Game started!',
    });

    if (!timers[lobbyId]) {
      createAnswerTimer(socket);
    }
  });

  socket.on('answer', (answer) => {});

  socket.on('disconnect', () => {
    const { lobbyId } = socket.data;

    if (lobbyId) {
      if (lobbies[lobbyId]) {
        lobbies[lobbyId].players = lobbies[lobbyId].players.filter(
          (player) => player.id !== socket.data.user?.id,
        );
        io.to(lobbyId).emit('players', lobbies[lobbyId].players);

        io.to(lobbyId).emit('message', {
          type: MessageType.Message,
          content: `${socket.data.user?.username} left the game!`,
        });
      }
    }
  });
});

io.listen(9998);
