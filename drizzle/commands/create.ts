import { connection } from '../db';
import drizzleConfig from '../drizzle.config';

await connection.query(`CREATE DATABASE IF NOT EXISTS ${drizzleConfig.dbCredentials.database};`);

// eslint-disable-next-line no-console
console.log('Database created.');

await connection.end();

// eslint-disable-next-line no-console
console.log('Connection closed.');

process.exit();
