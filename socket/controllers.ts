import { get } from 'http';

import { Game, LobbyState, QuestionWithoutAnswer } from './types';

import { db } from '../drizzle/db';
import { GameStatus } from '../drizzle/enums/lobby';
import { Question } from '../drizzle/table/questions';

export const join = () => {};
export const leave = () => {};
export const answer = () => {};

export const sendQuestionTimer = () => {};
export const sendQuestionInterludeTimer = () => {};
export const sendQuestionResult = () => {};
export const sendGameResult = () => {};

const time = {
  question: 15,
  interlude: 5,
};

// TODO: Replace by Env variable
const maxPlayers = 4;

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

  // TODO: add shuffle fonctionnality
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
    maxPlayers,
    players: [],
    game: {
      quiz: lobby.quiz,
      timeInterludeLeft: time.interlude,
      scoreboard: {},
      questionsLeft,
      currentQuestion: {
        timeLeft: time.question,
        question: formatQuestion(firstQuestion),
      },
    },
  };
};
