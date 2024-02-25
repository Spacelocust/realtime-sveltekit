import type { Question } from '../drizzle/table/questions';
import type { Quiz } from '../drizzle/table/quizzes';
import type { Session, User } from 'lucia';
import type { Socket as SocketIO } from 'socket.io';

export enum GameStatus {
  Waiting = 'waiting',
  InProgress = 'in-progress',
  Finished = 'finished',
}

// The current question being asked
export type CurrentQuestion = {
  timeLeft: number;
  question: Question;
};

// The result of a question after the timer runs out
export type QuestionResult = {
  playerIsCorrect: boolean;
  answers: Record<string, number>; // [choiceId]: selected count
};

// The result of a game after the last question
export type Scoreboard = Record<string, number>; // [playerId]: score

// The game state
export type Game = {
  quiz: Quiz;
  status: GameStatus;
  scoreboard: Scoreboard;
  questionsLeft: string[]; // questionsLeft: QuestionId[];
  currentQuestion: CurrentQuestion;
};

// The lobby state
export type Lobby = {
  key: string;
  owner: string;
  password?: string;
  maxPlayers: number;
  players: string[]; // players: UserId[];
  game: Game;
};

export type Lobbies = Record<string, Lobby>; // [lobbyKey]: Lobby

export interface ServerToClientEvents {
  message: (message: string) => void;
  question: (question: Question) => void; // new question
  questionTimer: (timeLeft: number) => void; // timer for the question
  questionInterludeTimer: (timeLeft: number) => void; // timer for the interlude between questions
  questionResult: (questionResult: QuestionResult) => void; // result of the question
  gameResult: (scoreboard: Scoreboard) => void; // result of the game
}

export interface ClientToServerEvents {
  start: () => void; // start the game
  join: (lobbyKey: string, password?: string) => void; // join a lobby
  answer: (choiceId: string) => void; // answer the current question
}

export interface InterServerEvents {}

export interface SocketData {
  user: User | null;
  session: Session | null;
  lobbyKey: string;
  currentAnswer: string | string[] | null; // current answer for the current question
}

export type Socket = SocketIO<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>;

export type Middleware = (socket: Socket, next: (err?: Error) => void) => void;
