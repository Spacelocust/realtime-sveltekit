/* eslint-disable no-console */
import { Server } from 'socket.io';

import { isAuth } from './middleware';

const io = new Server();

io.use(isAuth);

io.on('connection', (socket) => {
  socket.emit('message', '[init]: Hello from server!');
  console.log('client connected');
});

io.listen(9998);
