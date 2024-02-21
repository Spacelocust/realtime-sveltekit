import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import { sessions } from './table/sessions';
import { users } from './table/users';

const { MARIADB_URL } = process.env;

export const connection = await mysql.createConnection(MARIADB_URL ?? '');

export const db = drizzle(connection, {
  schema: {
    users,
    sessions,
  },
  mode: 'default',
});

export const adapter = new DrizzleMySQLAdapter(db, sessions, users);
