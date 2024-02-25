import { Game, GameStatus } from './types';

import { db } from '../drizzle/db';

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

/**
 * Get a question that hasn't been asked yet in a quiz
 */
export const getQuestion = async (quizId: string, questionsLeft: string[]) => {
  return db.query.questions
    .findFirst({
      where: (question, { and, eq, sql, inArray }) => {
        return and(
          eq(question.quizId, sql.placeholder('quizId')),
          inArray(question.id, questionsLeft),
        );
      },
    })
    .prepare()
    .execute({ quizId });
};

/**
 * Get a quiz by id
 */
export const getQuiz = async (id: string) => {
  return db.query.quizzes
    .findFirst({
      where: (quiz, { eq, sql }) => eq(quiz.id, sql.placeholder('id')),
      with: {
        questions: {
          columns: {
            id: true,
          },
        },
      },
    })
    .prepare()
    .execute({ id });
};

// TODO: improve when lobby is implemented
export const createGame = async (quizId: string): Promise<Game> => {
  const quiz = await getQuiz(quizId);

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  const questionsLeft = quiz.questions.map((q) => q.id);

  const currentQuestion = await getQuestion(quizId, questionsLeft);

  if (!currentQuestion) {
    throw new Error('No question found');
  }

  return {
    quiz,
    status: GameStatus.Waiting,
    scoreboard: {},
    questionsLeft: questionsLeft.filter((q) => q !== currentQuestion.id),
    currentQuestion: {
      timeLeft: time.question,
      question: currentQuestion,
    },
  };
};

export const createLobby = (lobbyId: string) => {
  // TODO: implement lobby request
  return {};
};
