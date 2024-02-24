import { Game } from './types';

import { db } from '../drizzle/db';
import { Question, questions } from '../drizzle/table/questions';
import { Quiz } from '../drizzle/table/quizzes';

export const joinQuiz = () => {};
export const leaveQuiz = () => {};
export const answerQuestion = () => {};

export const sendQuestionTimer = () => {};
export const sendQuestionResult = () => {};
export const sendQuestionTimerBeforeNext = () => {};
export const sendQuizTimerBeforeStart = () => {};
export const sendQuizEnd = () => {};

const time = {
  question: 15,
  questionBeforeNext: 5,
  quizBeforeStart: 30,
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
    quizId,
    scoreboard: {},
    questionsLeft: questionsLeft.filter((q) => q !== currentQuestion.id),
    currentQuestion: {
      timeLeft: time.question,
      question: currentQuestion,
      answers: {},
    },
  };
};
