import { relations } from 'drizzle-orm';
import { mysqlEnum, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

import { questions } from './questions';

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
  Overkill = 'overkill',
}

export const quizzes = mysqlTable('quizzes', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  title: varchar('title', {
    length: 255,
  }).notNull(),
  description: text('description'),
  category: varchar('category', {
    length: 255,
  }),
  difficulty: mysqlEnum('difficulty', [
    Difficulty.Easy,
    Difficulty.Medium,
    Difficulty.Hard,
    Difficulty.Overkill,
  ]).notNull(),
});

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
}));

export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;