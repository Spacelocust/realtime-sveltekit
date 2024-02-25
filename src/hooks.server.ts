import { auth } from '$server/auth';
import { db } from '$server/drizzle';
import { Role } from '$shared/enums/user';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.db = db;

  const sessionId = event.cookies.get(auth.sessionCookieName);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;

    return resolve(event);
  }

  const { session, user } = await auth.validateSession(sessionId);

  if (session?.fresh) {
    const sessionCookie = auth.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });
  }

  if (!session) {
    const sessionCookie = auth.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });
  }

  if (event.url.pathname.startsWith('/admin') && user?.role !== Role.Admin) {
    return new Response(null, {
      status: 303,
      headers: {
        location: '/',
      },
    });
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};
