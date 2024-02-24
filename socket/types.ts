import type { Session, User } from 'lucia';
import type { Socket as SocketIO } from 'socket.io';

export interface ServerToClientEvents {
  /**
   * TODO delete dis uwu
   * Send a message to the client.
   */
  message: (message: string) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {
  user: User | null;
  session: Session | null;
}

export type Socket = SocketIO<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>;

export type Middleware = (socket: Socket, next: (err?: Error) => void) => void;
