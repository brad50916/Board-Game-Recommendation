const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5001;
const routes = require('./routers');
const cors = require('cors');
const pool = require('./db');
const Server = require("socket.io");
const http = require('http');
const server = http.createServer(app);

const io = Server(server, {
  cors: {
    origin: [process.env.GITHUB_CLIENT_URL, 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

const users = {}; 

io.on('connection', (socket) => {
  // console.log('connected');

  socket.on('register', (userId) => {
    users[userId] = socket.id;
  });

  socket.on('sendMessage', async (message) => {
    const { userId, toUserId, currentChatId, text } = message;
    const toSocketId = users[toUserId];
    const fromSocketId = users[userId];
    if (toSocketId) {
      try {
        const query = 'INSERT INTO messages (chat_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *';
        const results = await pool.query(query, [currentChatId, userId, text]);
        if (toSocketId === fromSocketId) {
          io.to(toSocketId).emit('receiveMessage', results.rows[0]);
          return;
        }
        io.to(toSocketId).emit('receiveMessage', results.rows[0]);
        io.to(fromSocketId).emit('receiveMessage', results.rows[0]);
      }
      catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      // console.log(`User ${toUserId} not connected`);
      try {
        const query = 'INSERT INTO messages (chat_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *';
        const results = await pool.query(query, [currentChatId, userId, text]);
        io.to(fromSocketId).emit('receiveMessage', results.rows[0]);
      }
      catch (error) {
        console.error('Error sending message:', error);
      }
    }
  });

  socket.on('disconnect', () => {
    // console.log('user disconnected');
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

app.use(cors({
  origin: [process.env.GITHUB_CLIENT_URL, 'http://localhost:3000'],
}));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use('/', routes)

server.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}.`)
})