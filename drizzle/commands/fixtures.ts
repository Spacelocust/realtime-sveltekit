import { randomUUID } from 'crypto';

import { Role } from '../../src/shared/enums/user';
import { db } from '../db';
import { users, type NewUser } from '../table/users';

const password = await Bun.password.hash('xxx');
const userValues: NewUser[] = [
  {
    id: randomUUID(),
    username: 'dallas',
    password,
    role: Role.Admin,
  },
  {
    id: randomUUID(),
    username: 'bob',
    password,
    role: Role.Admin,
  },
  {
    id: randomUUID(),
    username: 'shade',
    password,
    role: Role.Admin,
  },
  {
    id: randomUUID(),
    username: 'karl',
    password,
    role: Role.User,
  },
  {
    id: randomUUID(),
    username: 'caddyman',
    password,
    role: Role.User,
  },
];

db.insert(users).values(userValues).execute();

// eslint-disable-next-line no-console
console.log(`Inserted ${userValues.length} users.`);

process.exit(0);
