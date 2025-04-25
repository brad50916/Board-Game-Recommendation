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

const users = {}; 

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