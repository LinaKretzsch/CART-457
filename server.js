// NPM run dev --> To run dev script

// Import node modules
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

// Assign variables to node modules
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Arrays which will hold stroke arrays
const topStrokes = [];
const midStrokes = [];
const bottomStrokes = [];
let count = 0;

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// socket.id = 0;

//Run when client connects
io.on('connection', socket => {


  // socket.id = i;

  console.log('Socket id: ' + socket.id);
  socket.emit('socketID', socket.id);
  socket.id++;

  console.log('New web socket connection..');

  socket.emit('message', 'Welcome to SketchQuisite');

  socket.broadcast.emit('message', 'A user has joined the chat');

  socket.on('join', (data) => {
    count++;
    socket.emit('joinedClientId', count);
    console.log('new user ' + count + ' has joined.')
  })

  // Listen for strokesArray and socketId of user sending the strokes
  socket.on('strokesArray', (strokesArray, userId) => {


    pushStrokesArray(strokesArray, userId);


    // console.log(strokesArray);
    // console.log('Current user ' + userId);
  });

  //To emit back to the server for everyone to see: io.emit('message', msg) --> Will use this to send fininshed drawing to the database?

  // Runs when client disconnects --> needs to be inside connection
  socket.on('disconnect', () => {
      io.emit('message', 'A user has finished drawing');
  })
});

// Adds each strokes array to the corresponding array, either mid/center or bottom strokes
function pushStrokesArray(strokesArray, socketId){
  if (socketId%3 === 1){
    topStrokes.push({
      sessionId: socketId,
      data: strokesArray
    })
  }
  else if (socketId%3 === 2){
    midStrokes.push({
      sessionId: socketId,
      data: strokesArray
    })
  }
  else if (socketId%3 === 0){
    bottomStrokes.push({
      sessionId: socketId,
      data: strokesArray
    })
  }
  else {
    console.log('ID invalid, strokes could not be pushed back in array.');
  }
  combineDrawing();
}




// Verify if top/mid/bottom stroke arrays hold at least one stroke array each to combine drawing
// Combines each 1st slots from top/mid/bottom stroke arrays
function combineDrawing(){
  if(topStrokes.length > 0 && midStrokes.length > 0 && bottomStrokes.length > 0){
    console.log('Yihaa we got one');
  }
}


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
