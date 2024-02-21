import { Lucia } from 'lucia';

import { adapter } from '$server/drizzle/db';

import { dev } from '$app/environment';

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
  },
  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});

export type Auth = typeof auth;
