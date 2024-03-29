import mongoose from 'mongoose';
import app from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const port = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB_URL.replace('<password>', process.env.DB_PW), {
  useNewUrlParser: true, // <-- no longer necessary
  useUnifiedTopology: true, // <-- no longer necessary
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  // cors: 'https://statuesque-truffle-30853b.netlify.app',
  cors: 'http://localhost:5173',
  methods: ['GET', 'POST'],
});

const users = new Map();

io.on('connection', (socket) => {
  socket.on('sendUser', (userId) => {
    console.log({ userId, id: socket.id });
    users.set(userId, socket.id);
    io.emit('getUsers', [...users.keys()]);
  });

  socket.on('sendMessage', (message) => {
    io.to(users.get(message.receiverId)).emit('getMessage', message);
  });

  socket.on('sendKeyUp', (userId) => {
    io.to(users.get(userId)).emit('getKeyUp', 123);
  });

  socket.on('disconnect', () => {
    const disconnectUser = [...users.keys()].find(
      (id) => users.get(id) === socket.id
    );
    users.delete(disconnectUser);
    io.emit('getUsers', [...users.keys()]);
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
