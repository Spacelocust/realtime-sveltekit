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
  playerAnswer: string[]; // choiceId[]
  correctAnswer: string[]; // choiceId[]
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

export type LobbiesState = Record<string, LobbyState>; // [id]: Lobby

export interface ServerToClientEvents {
  message: (message: { type: MessageType; content: string }) => void;
  question: (question: Question) => void; // new question
  questionResult: (questionResult: QuestionResult) => void; // result of the question
  answerTimer: (timeLeft: number) => void; // timer for the question
  interludeTimer: (timeLeft: number) => void; // timer for the interlude between questions
  scoreboard: (scoreboard: Scoreboard) => void; // current scoreboard
  lobbyStatus: (status: GameStatus) => void; // lobby status
}

export interface ClientToServerEvents {
  start: () => void; // start the game
  join: (id: string, password?: string) => void; // join a lobby
  addAnswer: (choiceId: string) => void; // add an answer
  removeAnswer: (choiceId: string) => void; // remove an answer
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
