import type { Config } from 'drizzle-kit';

const { MARIADB_DATABASE, MARIADB_HOST, MARIADB_ROOT_PASSWORD, MARIADB_ROOT_USER } = process.env;

export default {
  schema: './src/lib/server/drizzle/table/*.ts',
  out: './src/lib/server/drizzle/migrations',
  driver: 'mysql2',
  dbCredentials: {
    host: MARIADB_HOST ?? '',
    user: MARIADB_ROOT_USER,
    password: MARIADB_ROOT_PASSWORD,
    database: MARIADB_DATABASE ?? '',
  },
} satisfies Config;
