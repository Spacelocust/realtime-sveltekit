import { relations } from 'drizzle-orm';
import { mysqlEnum, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

import { lobbies } from './lobbies';
import { questions } from './questions';

import { Difficulty } from '../../src/shared/enums/quizzes';

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
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
  lobbies: many(lobbies),
}));

export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;
