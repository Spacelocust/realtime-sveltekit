import { relations } from 'drizzle-orm';
import { mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

import { lobbies } from './lobbies';
import { sessions } from './sessions';

import { Role } from '../enums/user';

export const users = mysqlTable('users', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  username: varchar('username', {
    length: 255,
  })
    .unique()
    .notNull(),
  password: varchar('password', {
    length: 255,
  }).notNull(),
  role: mysqlEnum('role', [Role.User, Role.Admin]).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  lobbies: many(lobbies),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
