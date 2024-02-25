import { Lucia } from 'lucia';

import { adapter } from '$server/drizzle';

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
      role: data.role,
    };
  },
});

export type Auth = typeof auth;
