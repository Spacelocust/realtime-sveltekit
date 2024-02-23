import { auth } from '$server/auth';
import { db } from '$server/drizzle';

import type { Handle } from '@sveltejs/kit';
import type { WebSocketHandler } from 'svelte-adapter-bun';

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

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};

export const handleWebsocket: WebSocketHandler = {
  open(ws) {
    console.log('client connected');
    ws.send('[init]: Hello from server!');
  },
  message(ws, message) {
    console.log('client sent message', message);
    ws.send(`[pong]: ${message}`);
  },
  close() {
    console.log('client disconnected');
  },
  upgrade(request, upgrade) {
    const url = new URL(request.url);
    // console.log('waiting to upgrade', url);
    console.log('client upgrade', url.pathname);

    if (url.pathname.startsWith('/ws')) {
      return upgrade(request);
    }
    return false;
  },
};
