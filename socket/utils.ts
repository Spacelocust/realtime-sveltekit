import { SocketServer } from './types';

import { MessageType } from '../src/shared/enums/socket';

export const createEmitter = (socket: SocketServer) => {
  return {
    emitError: (message: string) => {
      socket.emit('message', {
        type: MessageType.Error,
        content: message,
      });
    },
    emitMessage: (message: string) => {
      socket.emit('message', {
        type: MessageType.Message,
        content: message,
      });
    },
  };
};
