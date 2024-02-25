import { LobbyState, QuestionWithoutAnswer } from './types';

import { db } from '../drizzle/db';
import { Question } from '../drizzle/table/questions';
import { GameStatus } from '../src/shared/enums/lobby';

const { PUBLIC_MAX_PLAYERS, PUBLIC_ANSWER_TIME, PUBLIC_INTERLUDE_TIME } = process.env;

export const join = () => {};
export const leave = () => {};
export const answer = () => {};

export const sendQuestion = () => {};
export const sendAnswerTimer = () => {};
export const sendInterludeTimer = () => {};
export const sendQuestionResult = () => {};
export const sendScoreboard = () => {};
export const sendLobbyStatus = () => {};

const formatQuestion = (question: Question): QuestionWithoutAnswer => {
  return {
    ...question,
    isMultipleChoice: question.choices.filter((choice) => choice.isCorrect).length > 1,
    choices: question.choices.map((choice) => {
      const { isCorrect, ...rest } = choice;
      return rest;
    }),
  };
};

export const getLobby = async (lobbyId: string) => {
  return db.query.lobbies.findFirst({
    where: (lobby, { eq }) => eq(lobby.id, lobbyId),
    with: {
      quiz: {
        with: {
          questions: true,
        },
      },
    },
  });
};

export const createLobby = async (lobbyId: string): Promise<LobbyState> => {
  const lobby = await getLobby(lobbyId);
  if (!lobby) {
    throw new Error('Lobby not found');
  }

  if (lobby.randomizeQuestions) {
    lobby.quiz.questions = lobby.quiz.questions.sort(() => Math.random() - 0.5);
  }

  const firstQuestion = lobby.quiz.questions.shift();
  if (!firstQuestion) {
    throw new Error('No question found');
  }

  const questionsLeft = lobby.quiz.questions.map((q) => q.id);

  return {
    id: lobby.id,
    status: GameStatus.Waiting,
    password: lobby.password,
    owner: lobby.createdById,
    maxPlayers: PUBLIC_MAX_PLAYERS ? parseInt(PUBLIC_MAX_PLAYERS, 10) : 8,
    players: [],
    game: {
      quiz: lobby.quiz,
      timeInterludeLeft: PUBLIC_INTERLUDE_TIME ? parseInt(PUBLIC_INTERLUDE_TIME, 10) : 10,
      scoreboard: [],
      questionsLeft,
      currentQuestion: {
        timeLeft: PUBLIC_ANSWER_TIME ? parseInt(PUBLIC_ANSWER_TIME, 10) : 30,
        question: formatQuestion(firstQuestion),
      },
    },
  };
};
