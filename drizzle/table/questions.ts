import { relations } from 'drizzle-orm';
import { json, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

import { quizzes } from './quizzes';

export type Choice = {
  label: string;
  isCorrect: boolean;
};

export const questions = mysqlTable('questions', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  question: varchar('question', {
    length: 255,
  }).notNull(),
  hint: text('hint'),
  choices: json('choices').$type<Choice[]>().default([]).notNull(),
  quizId: varchar('quiz_id', {
    length: 255,
  })
    .notNull()
    .references(() => quizzes.id),
});

export const questionsRelations = relations(questions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
}));

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
