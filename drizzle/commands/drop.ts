import { connection } from '../db';
import drizzleConfig from '../drizzle.config';

await connection.query(`DROP DATABASE IF EXISTS ${drizzleConfig.dbCredentials.database};`);

// eslint-disable-next-line no-console
console.log('Database dropped.');

await connection.end();

// eslint-disable-next-line no-console
console.log('Connection closed.');

process.exit();
