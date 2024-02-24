/* eslint-disable @typescript-eslint/dot-notation */
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

type Answer = {
  id: string;
  text: string;
  countSelected: number;
};

type Question = {
  id: string;
  text: string;
  isMulti: boolean;
  answers: Record<string, Answer>;
};

type Scoreboard = {
  [key: string]: {
    id: string;
    name: string;
    score: number;
  };
};

type Quiz = {
  timeLeft: number;
  scoreboard: Scoreboard;
  question: Question;
};

type QuizStates = Record<string, Quiz>;

const quizStates: QuizStates = {};

io.on('connection', (socket) => {
  socket.on('', (arg) => {
    console.log(arg); // world
  });
  socket.emit('message', '[init]: Hello from server!');

  socket.join('quizz');

  io.to('quizz').emit('message', 'Hello from quizz room!');

  console.log('rooms:', io.of('/'));

  console.log('client connected : ', socket.data);
});

io.listen(9998);
