import type { Config } from 'drizzle-kit';

const { MYSQL_DATABASE, MYSQL_HOST, MYSQL_ROOT_PASSWORD, MYSQL_ROOT_USER } = process.env;

export default {
  schema: './drizzle/table/*.ts',
  out: './drizzle/migrations',
  driver: 'mysql2',
  dbCredentials: {
    host: MYSQL_HOST ?? '',
    user: MYSQL_ROOT_USER,
    password: MYSQL_ROOT_PASSWORD,
    database: MYSQL_DATABASE ?? '',
  },
} satisfies Config;
