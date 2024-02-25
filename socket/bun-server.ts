/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-console */
import { Server } from 'socket.io';

import { createCurrentQuestion, createLobby, updateStatusLobby } from './controllers';
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
} from './types';

const { PUBLIC_INTERLUDE_TIME } = process.env;

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
        // Decrease the time left
        const time = (lobbies[socket.data.lobbyId].game.currentQuestion.timeLeft =
          lobby.game.currentQuestion.timeLeft - 1);

        // Emit the time left to the lobby
        io.to(socket.data.lobbyId).emit('answerTimer', time);
      } else {
        // Clear the answer timer
        if (timers.answer[socket.data.lobbyId]) {
          clearInterval(timers.answer[socket.data.lobbyId]);
          timers.answer[socket.data.lobbyId] = undefined;
        }

        // Send the result of the question for each player
        lobby.players.forEach((player) => {
          const playerSocket = lobby.playerSockets[player.id];

          playerSocket.emit('questionResult', {
            correctAnswers: lobby.game.currentQuestion.correctAnswers,
            countPerAnswer: lobby.game.currentQuestion.countPerAnswer,
            playerAnswers: lobby.playerCurrentAnswers[player.id],
          });
        });

        // Emit the players scores to the lobby
        io.to(socket.data.lobbyId).emit('players', lobby.players);

        lobbies[socket.data.lobbyId].playerCurrentAnswers = {};

        // Launch the interlude timer
        if (!timers.interlude[socket.data.lobbyId]) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          timers.interlude[socket.data.lobbyId] = createInterludeTimer(socket);
        }
      }
    }
  }, 1000);
};

const createInterludeTimer = (socket: SocketServer) => {
  return setInterval(async () => {
    const lobby = lobbies[socket.data.lobbyId];

    if (lobby) {
      if (lobby.game.timeInterludeLeft > 0) {
        // Decrease the time left
        const time = (lobbies[socket.data.lobbyId].game.timeInterludeLeft =
          lobby.game.timeInterludeLeft - 1);

        // Emit the time left to the lobby
        io.to(socket.data.lobbyId).emit('interludeTimer', time);
      } else {
        // Clear the interlude timer
        if (timers.interlude[socket.data.lobbyId]) {
          clearInterval(timers.interlude[socket.data.lobbyId]);
          timers.interlude[socket.data.lobbyId] = undefined;
          lobbies[socket.data.lobbyId].game.timeInterludeLeft = PUBLIC_INTERLUDE_TIME
            ? parseInt(PUBLIC_INTERLUDE_TIME, 10)
            : 10;
        }

        // Get next question id and remove it from the list
        const nextQuestionId = lobbies[socket.data.lobbyId].game.questionsLeft.shift();

        if (nextQuestionId) {
          // Get next question
          const nextQuestion = lobbies[socket.data.lobbyId].game.quiz.questions.find(
            (question) => question.id === nextQuestionId,
          );

          if (nextQuestion) {
            // Set the current question
            lobbies[socket.data.lobbyId].game.currentQuestion = createCurrentQuestion(nextQuestion);

            // Emit the new question to the lobby
            io.to(socket.data.lobbyId).emit(
              'question',
              lobbies[socket.data.lobbyId].game.currentQuestion.question,
            );

            // Start the answer timer
            if (!timers.answer[socket.data.lobbyId]) {
              timers.answer[socket.data.lobbyId] = createAnswerTimer(socket);
            }
          }
        } else {
          // Finish the game if there are no more questions

          // Set the lobby status to finished
          lobbies[socket.data.lobbyId].status = GameStatus.Finished;
          await updateStatusLobby(socket.data.lobbyId, GameStatus.Finished);

          // Emit the lobby status to the lobby
          io.to(socket.data.lobbyId).emit('lobbyStatus', GameStatus.Finished);
          io.to(socket.data.lobbyId).emit('players', lobbies[socket.data.lobbyId].players);

          delete lobbies[socket.data.lobbyId];
        }
      }
    }
  }, 1000);
};

io.on('connection', (socket) => {
  const { emitError, emitMessage } = createEmitter(socket);

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

    if (socket.data.user) {
      lobbies[lobbyId].players.push({
        id: socket.data.user.id,
        name: socket.data.user.username,
        score: 0,
      });

      lobbies[lobbyId].playerSockets[socket.data.user.id] = socket;

      io.to(lobbyId).emit('message', {
        type: MessageType.Message,
        content: `${socket.data.user.username} joined the game!`,
      });

      io.to(lobbyId).emit('players', lobbies[lobbyId].players);
    }
  });

  socket.on('start', async () => {
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

    io.to(lobbyId).emit('lobbyStatus', GameStatus.InProgress);
    await updateStatusLobby(lobbyId, GameStatus.InProgress);
    io.to(lobbyId).emit('question', lobby.game.currentQuestion.question);

    io.to(lobbyId).emit('message', {
      type: MessageType.Message,
      content: 'Game started!',
    });

    if (!timers.answer[lobbyId]) {
      timers.answer[lobbyId] = createAnswerTimer(socket);
    }
  });

  socket.on('answer', (choices) => {
    const { lobbyId } = socket.data;

    if (!socket.data.user) {
      emitError('You need to be logged in to answer');
      return;
    }

    if (!lobbyId) {
      emitError('You need to join a lobby to answer');
      return;
    }

    const lobby = lobbies[lobbyId];
    if (!lobby) {
      emitError('Lobby not found');
      return;
    }

    if (lobby.status !== GameStatus.InProgress) {
      emitError('Game is not in progress');
      return;
    }

    if (!lobby.players.find((player) => player.id === socket.data.user?.id)) {
      emitError('You are not in the lobby');
      return;
    }

    if (lobby.game.currentQuestion.timeLeft <= 0) {
      emitError('Time is up');
      return;
    }

    if (
      lobby.playerCurrentAnswers[socket.data.user?.id] &&
      lobby.playerCurrentAnswers[socket.data.user?.id].length > 0
    ) {
      emitError('You already answered this question');
      return;
    }

    lobbies[lobbyId].playerCurrentAnswers[socket.data.user?.id] = choices;

    choices.forEach((choice) => {
      if (lobbies[lobbyId].game.currentQuestion.countPerAnswer[choice]) {
        lobbies[lobbyId].game.currentQuestion.countPerAnswer[choice] += 1;
      } else {
        lobbies[lobbyId].game.currentQuestion.countPerAnswer[choice] = 1;
      }
    });

    emitMessage('Answer received');
    socket.emit('answered', true);
  });

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
