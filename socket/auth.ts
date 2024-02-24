import { Lucia } from 'lucia';

import { adapter } from '../drizzle/db';

const { ENV } = process.env;

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: ENV === 'production',
    },
  },
  getUserAttributes: (data) => {
    return {
      username: data.username,
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
}
