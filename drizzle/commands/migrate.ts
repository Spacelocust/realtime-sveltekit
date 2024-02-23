import { migrate } from 'drizzle-orm/mysql2/migrator';

import { connection, db } from '../db';
import drizzleConfig from '../drizzle.config';

await migrate(db, { migrationsFolder: drizzleConfig.out });

// eslint-disable-next-line no-console
console.log('Migrations complete.');

await connection.end();

// eslint-disable-next-line no-console
console.log('Connection closed.');

process.exit();
