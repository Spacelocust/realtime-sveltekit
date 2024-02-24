/* eslint-disable no-console */
import { Socket } from 'socket.io';

import { auth } from './auth';

export type Middleware = (socket: Socket, next: (err?: Error) => void) => void;

export const isAuth: Middleware = async (socket, next) => {
  const error = new Error('Unauthorized: You are not logged in.');

  const { authorization } = socket.handshake.headers;
  if (!authorization) {
    next(error);
  }

  const sessionId = auth.readBearerToken(authorization ?? '');
  if (!sessionId) {
    next(error);
  } else {
    const { session, user } = await auth.validateSession(sessionId);
    if (!session) {
      next(error);
    }

    console.log('Logged in as:', user?.username);
    next();
  }
};
