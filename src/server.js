const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

app.set('port', process.env.PORT || 3000);

const sockets = require('./sockets')(io); // é chamada depois da confg do socket.io


app.use(express.static(path.join(__dirname, 'public')));


server.listen(app.get('port'), () => {
  console.log(`Server on  http://localhost:${app.get('port')}/`);
});
