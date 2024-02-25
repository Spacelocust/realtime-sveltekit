import { get } from 'http';

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

export const getLobby = async (lobbyId: string) => {};

// TODO: improve when lobby is implemented
// export const createGame = async (quizId: string): Promise<Game> => {
//   const lo

//   if (!quiz) {
//     throw new Error('Quiz not found');
//   }

//   const questionsLeft = quiz.questions.map((q) => q.id);

//   const currentQuestion = await getQuestion(quizId, questionsLeft);

//   if (!currentQuestion) {
//     throw new Error('No question found');
//   }

//   return {
//     quiz,
//     status: GameStatus.Waiting,
//     scoreboard: {},
//     questionsLeft: questionsLeft.filter((q) => q !== currentQuestion.id),
//     currentQuestion: {
//       timeLeft: time.question,
//       question: currentQuestion,
//     },
//   };
// };

export const createLobby = async (lobbyId: string) => {
  // TODO: implement lobby request
  const lobby = await getLobby(lobbyId);
  
  return {};
};
