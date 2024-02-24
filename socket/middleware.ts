/* eslint-disable no-console */
import { parse } from 'cookie';

import { auth } from './auth';

import type { Middleware } from './types';

export const isAuth: Middleware = async (socket, next) => {
  socket.data.user = null;
  socket.data.session = null;

  const cookies = parse(socket.handshake.headers.cookie ?? '');
  const sessionId = cookies[auth.sessionCookieName] ?? null;
  const error = new Error('Unauthorized: You are not logged in.');

  if (!sessionId) {
    next(error);

    return;
  }

  const { session, user } = await auth.validateSession(sessionId);

  if (!session || !user) {
    next(error);

    return;
  }

  console.log('Logged in as:', user.username);

  socket.data.user = user;
  socket.data.session = session;

  next();
};
