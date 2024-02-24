import type { Session, User } from 'lucia';
import type { Socket as SocketIO } from 'socket.io';

export enum Event {
  QuestionTimer = 'question:timer',
  QuestionResult = 'question:result',
  QuestionTimerBeforeNext = 'question:timer-before-next',
  QuizTimerBeforeStart = 'quiz:timer-before-start',
  QuizEnd = 'quiz:end',
}

export interface ServerToClientEvents {
  questionTimer: (timeLeft: number) => void;
  questionResult: (scoreboard: any) => void;
  questionTimerBeforeNext: (timeLeft: number) => void;
  quizTimerBeforeStart: (timeLeft: number) => void;
  quizEnd: (scoreboard: any) => void;
}

export interface ClientToServerEvents {
  userAnswer: (answer: string) => void;
  userJoin: (quizId: string) => void;
  userLeave: () => void;
}

export interface InterServerEvents {}

export interface SocketData {
  user: User | null;
  session: Session | null;
}

export type Socket = SocketIO<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>;

export type Middleware = (socket: Socket, next: (err?: Error) => void) => void;
