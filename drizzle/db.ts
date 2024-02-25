import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import { questions, questionsRelations } from './table/questions';
import { quizzes, quizzesRelations } from './table/quizzes';
import { sessions } from './table/sessions';
import { users } from './table/users';

const { MYSQL_URL } = process.env;

export const connection = await mysql.createConnection(MYSQL_URL ?? '');

export const db = drizzle(connection, {
  schema: {
    users,
    sessions,
    quizzes,
    quizzesRelations,
    questions,
    questionsRelations,
  },
  mode: 'default',
});

export const adapter = new DrizzleMySQLAdapter(db, sessions, users);
