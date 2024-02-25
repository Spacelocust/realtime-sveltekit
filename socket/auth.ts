import { Lucia } from 'lucia';

import { adapter } from '../drizzle/db';
import { Role } from '../src/shared/enums/user';

const { NODE_ENV } = process.env;

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: NODE_ENV === 'production',
    },
  },
  getUserAttributes: (data) => {
    return {
      username: data.username,
      role: data.role,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  role: Role;
}
