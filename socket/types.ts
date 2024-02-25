import { GameStatus } from '../src/shared/enums/lobby';

import type { Choice, Question } from '../drizzle/table/questions';
import type { Quiz } from '../drizzle/table/quizzes';
import type { MessageType } from '../src/shared/enums/socket';
import type { Session, User } from 'lucia';
import type { Socket as SocketIO } from 'socket.io';

export type QuestionWithoutAnswer = Omit<Question, 'choices'> & {
  choices: Omit<Choice, 'isCorrect'>[];
  isMultipleChoice: boolean;
};

export type Player = {
  id: string;
  name: string;
  score: number;
};

// The current question being asked
export type CurrentQuestion = {
  timeLeft: number;
  question: QuestionWithoutAnswer;
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
  quiz: Quiz;
  timeInterludeLeft: number;
  scoreboard: Scoreboard;
  questionsLeft: string[]; // questionsLeft: QuestionId[];
  currentQuestion: CurrentQuestion;
};

// The lobby state
export type LobbyState = {
  id: string;
  owner: string;
  status: GameStatus;
  password: string | null;
  maxPlayers: number; // Default 4
  players: Player[];
  game: Game;
};

export type LobbyStates = Record<string, LobbyState>; // [id]: Lobby

export interface ServerToClientEvents {
  message: (message: { type: MessageType; content: string }) => void;
  question: (question: QuestionWithoutAnswer) => void; // new question
  questionResult: (questionResult: QuestionResult) => void; // result of the question
  answerTimer: (timeLeft: number) => void; // timer for the question
  interludeTimer: (timeLeft: number) => void; // timer for the interlude between questions
  scoreboard: (scoreboard: Scoreboard) => void; // current scoreboard
  lobbyStatus: (status: GameStatus) => void; // lobby status
  players: (players: Player[]) => void;
  answered: (isValid: boolean) => void;
}

export interface ClientToServerEvents {
  start: () => void; // start the game
  join: (id: string, password?: string) => void; // join a lobby
  answer: (choices: string[]) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  user: User | null;
  session: Session | null;
  lobbyId: string;
  currentAnswer: string | string[] | null; // current answer for the current question
}

export type Socket = SocketIO<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>;

export type Middleware = (socket: Socket, next: (err?: Error) => void) => void;
