import type { Question } from '../drizzle/table/questions';
import type { Session, User } from 'lucia';
import type { Socket as SocketIO } from 'socket.io';

export type CurrentQuestion = {
  timeLeft: number;
  question: Question;
  answers: {
    [key: string]: number;
  };
};

export type Scoreboard = {
  [key: string]: {
    id: string;
    name: string;
    score: number;
  };
};

export type Game = {
  quizId: string;
  scoreboard: Scoreboard;
  questionsLeft: string[];
  currentQuestion: CurrentQuestion;
};

export type Games = Record<string, Game>;

export interface ServerToClientEvents {
  message: (message: string) => void;
  questionTimer: (timeLeft: number) => void;
  questionResult: (scoreboard: Scoreboard) => void;
  questionTimerBeforeNext: (timeLeft: number) => void;
  quizTimerBeforeStart: (timeLeft: number) => void;
  quizEnd: (scoreboard: Scoreboard) => void;
}

export interface ClientToServerEvents {
  answer: (answer: string) => void;
  join: (quizId: string) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  user: User | null;
  session: Session | null;
  currentGame: {
    quizId: string;
    currentAnswer: string | string[] | null;
  };
}

export type Socket = SocketIO<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>;

export type Middleware = (socket: Socket, next: (err?: Error) => void) => void;
