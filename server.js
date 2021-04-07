const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects
io.on('connection', socket => {
  console.log('New web socket connection..');

  socket.emit('message', 'Welcome to SketchQuisite');

  socket.broadcast.emit('message', 'A user has joined the chat');


  // Listen for strokesArray
  socket.on('strokesArray', (strokesArray) => {
    console.log(strokesArray);
  });

  //To emit back to the server for everyone to see: io.emit('message', msg) --> Will use this to send fininshed drawing to the database?


  // Runs when client disconnects --> needs to be inside connection
  socket.on('disconnect', () => {
      io.emit('message', 'A user has finished drawing');
  })
});



const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
