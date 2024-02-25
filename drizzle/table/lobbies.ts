import { relations } from 'drizzle-orm';
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

import { quizzes } from './quizzes';
import { users } from './users';

import { GameStatus } from '../../src/shared/enums/lobby';

export const lobbies = mysqlTable('lobbies', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  name: varchar('name', {
    length: 255,
  }).notNull(),
  description: text('description'),
  password: varchar('password', {
    length: 20,
  }),
  code: varchar('code', {
    length: 30,
  }).notNull(),
  private: boolean('private').default(false).notNull(),
  randomizeQuestions: boolean('randomize_questions').default(false).notNull(),
  status: mysqlEnum('status', [GameStatus.Waiting, GameStatus.InProgress, GameStatus.Finished])
    .default(GameStatus.Waiting)
    .notNull(),
  playerCount: int('player_count').default(0).notNull(),
  quizId: varchar('quiz_id', {
    length: 255,
  })
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  createdById: varchar('created_by_id', {
    length: 255,
  })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const lobbiesRelations = relations(lobbies, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [lobbies.quizId],
    references: [quizzes.id],
  }),
  createdBy: one(users, {
    fields: [lobbies.createdById],
    references: [users.id],
  }),
}));

export type Lobby = typeof lobbies.$inferSelect;
export type NewLobby = typeof lobbies.$inferInsert;
