import { datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

import { users } from './users';

export const sessions = mysqlTable('sessions', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 255,
  })
    .notNull()
    .references(() => users.id),
  expiresAt: datetime('expires_at').notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
