import type { ClientToServerEvents, ServerToClientEvents } from '$socket/types';
import type { Socket as SocketIO } from 'socket.io-client';

export type Socket = SocketIO<ServerToClientEvents, ClientToServerEvents>;
export type { ClientToServerEvents, ServerToClientEvents };
