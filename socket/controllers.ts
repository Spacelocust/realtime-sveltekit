import { eq, sql } from 'drizzle-orm';

import { LobbyState, QuestionWithoutAnswer } from './types';

import { db } from '../drizzle/db';
import { lobbies } from '../drizzle/table/lobbies';
import { Question } from '../drizzle/table/questions';
import { GameStatus } from '../src/shared/enums/lobby';

const { PUBLIC_MAX_PLAYERS, PUBLIC_ANSWER_TIME, PUBLIC_INTERLUDE_TIME } = process.env;

const formatQuestion = (question: Question, isSingleAnswer: boolean): QuestionWithoutAnswer => {
  return {
    ...question,
    isMultipleChoice:
      !isSingleAnswer ?? question.choices.filter((choice) => choice.isCorrect).length > 1,
    choices: question.choices.map((choice) => {
      const { isCorrect, ...rest } = choice;
      return rest;
    }),
  };
};

export const createCurrentQuestion = (question: Question, isSingleAnswer: boolean) => {
  return {
    timeLeft: PUBLIC_ANSWER_TIME ? parseInt(PUBLIC_ANSWER_TIME, 10) : 30,
    question: formatQuestion(question, isSingleAnswer),
    countPerAnswer: {},
    correctAnswers: question.choices.reduce<string[]>(
      (acc, curr) => (curr.isCorrect ? [...acc, curr.id] : acc),
      [],
    ),
  };
};

export const getLobby = async (id: string) => {
  return db.query.lobbies
    .findFirst({
      where: (lobby) => eq(lobby.id, sql.placeholder('id')),
      with: {
        quiz: {
          with: {
            questions: true,
          },
        },
      },
    })
    .prepare()
    .execute({ id });
};

export const createLobby = async (id: string): Promise<LobbyState> => {
  const lobby = await getLobby(id);
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
    isSingleAnswer: lobby.useSingleAnswers,
    owner: lobby.createdById,
    maxPlayers: PUBLIC_MAX_PLAYERS ? parseInt(PUBLIC_MAX_PLAYERS, 10) : 8,
    players: [],
    playerSockets: {},
    playerCurrentAnswers: {},
    game: {
      quiz: lobby.quiz,
      timeInterludeLeft: PUBLIC_INTERLUDE_TIME ? parseInt(PUBLIC_INTERLUDE_TIME, 10) : 10,
      questionsLeft,
      currentQuestion: createCurrentQuestion(firstQuestion, lobby.useSingleAnswers),
    },
  };
};

export const updateStatusLobby = async (id: string, status: GameStatus) => {
  await db
    .update(lobbies)
    .set({ status })
    .where(eq(lobbies.id, sql.placeholder('id')))
    .prepare()
    .execute({ id });
};

export const updatePlayerCountLobby = async (id: string, count: number) => {
  await db
    .update(lobbies)
    .set({ playerCount: count })
    .where(eq(lobbies.id, sql.placeholder('id')))
    .prepare()
    .execute({ id });
};
