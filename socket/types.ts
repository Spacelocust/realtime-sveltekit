import { GameStatus } from '../src/shared/enums/lobby';

import type { Choice, Question } from '../drizzle/table/questions';
import type { Quiz } from '../drizzle/table/quizzes';
import type { MessageType } from '../src/shared/enums/socket';
import type { Session, User } from 'lucia';
import type { Socket as SocketIO, Server } from 'socket.io';

export type QuestionWithoutAnswer = Omit<Question, 'choices'> & {
  choices: Omit<Choice, 'isCorrect'>[];
  isMultipleChoice: boolean;
};

export type Player = {
  id: string;
  name: string;
  score: number;
};

export type Timers = {
  answer: Record<string, Timer>;
  interlude: Record<string, Timer>;
};

// The current question being asked
export type CurrentQuestion = {
  timeLeft: number;
  question: QuestionWithoutAnswer;
  correctAnswers: string[];
  countPerAnswer: Record<string, number>;
};

// The result of a question after the timer runs out
export type QuestionResult = {
  playerAnswers: string[]; // choiceId[]
  correctAnswers: string[]; // choiceId[]
  countPerAnswer: Record<string, number>; // [choiceId]: selected count
};

// The result of a game after the last question
export type Scoreboard = Player[]; // [playerId]: score

// The game state
export type Game = {
  quiz: Quiz & { questions: Question[] };
  timeInterludeLeft: number;
  questionsLeft: string[]; // questionsLeft: QuestionId[];
  currentQuestion: CurrentQuestion;
};

// The lobby state
export type LobbyState = {
  id: string;
  owner: string;
  status: GameStatus;
  password: string | null;
  maxPlayers: number;
  players: Player[];
  game: Game;
  // TODO: improve later
  playerCurrentAnswers: Record<string, string[]>; // [playerId]: choiceId[]
  playerSockets: Record<string, SocketServer>;
};

export type LobbyStates = Record<string, LobbyState>; // [id]: Lobby

export interface ServerToClientEvents {
  message: (message: { type: MessageType; content: string }) => void;
  question: (question: QuestionWithoutAnswer) => void; // new question
  questionResult: (questionResult: QuestionResult) => void; // result of the question
  answerTimer: (timeLeft: number) => void; // timer for the question
  interludeTimer: (timeLeft: number) => void; // timer for the interlude between questions
  players: (players: Player[]) => void; // current players
  lobbyStatus: (status: GameStatus) => void; // lobby status
  answered: (isValid: boolean) => void;
}

export interface ClientToServerEvents {
  start: () => void; // start the game
  join: (id: string, password?: string) => void; // join a lobby
  answer: (choices: string[]) => void; // add an answer
}

export interface InterServerEvents {}

export interface SocketData {
  user: User | null;
  session: Session | null;
  lobbyId: string;
}

export type Socket = SocketIO<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>;

export type SocketServer = SocketIO<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type ServerIO = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type Middleware = (socket: Socket, next: (err?: Error) => void) => void;
