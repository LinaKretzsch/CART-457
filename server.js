// NPM run dev --> To run dev script

// Import node modules
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { createCanvas, loadImage } = require('canvas')
const image = require('image-js');

// File stream to decode base64
const fs = require('fs');


// Module to decode base64 image URIs
const {base64, decode} = require('node-base64-image');
// import {encode, decode} from 'node-base64-image';


// const loadImage = require('canvas');
// const konva = require('public/JS/drawingScript.js');


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

  // console.log('Socket id: ' + socket.id);
  // socket.emit('socketID', socket.id);
  // socket.id++;

  console.log('New web socket connection..');

  socket.emit('message', 'Welcome to SketchQuisite');

  socket.broadcast.emit('message', 'A user has joined the chat');

  socket.on('join', (data) => {
    count++;
    socket.emit('joinedClientId', count);
    console.log('new user ' + count + ' has joined.')
  })

  // Listen for strokesArray and socketId of user sending the strokes
  socket.on('strokesAndId', (strokes, userId) => {


    // pushStrokesArray(strokes, userId);

    console.log(strokes);

    combineTest();

  });

  //To emit back to the server for everyone to see: io.emit('message', msg) --> Will use this to send fininshed drawing to the database?

  // Runs when client disconnects --> needs to be inside connection
  socket.on('disconnect', () => {
      io.emit('message', 'A user has finished drawing');
  })
});

// Adds each strokes array to the corresponding array, either mid/center or bottom strokes
function pushStrokesArray(strokes, socketId){
  if (socketId%3 === 1){
    topStrokes.push({
      sessionId: socketId,
      data: strokes
    })
    console.log(topStrokes[0]);
  }
  else if (socketId%3 === 2){
    midStrokes.push({
      sessionId: socketId,
      data: strokes
    })
    console.log(midStrokes[0]);
  }
  else if (socketId%3 === 0){
    bottomStrokes.push({
      sessionId: socketId,
      data: strokes
    })
    console.log(bottomStrokes[0]);
  }
  else {
    console.log('ID invalid, strokes could not be pushed back in array.');
  }
  combineDrawing(topStrokes[0], midStrokes[0], bottomStrokes[0]);
}


// Verify if top/mid/bottom stroke arrays hold at least one stroke array each to combine drawing
// Combines each 1st slots from top/mid/bottom stroke arrays
function combineDrawing(){
  if(topStrokes.length > 0 && midStrokes.length > 0 && bottomStrokes.length > 0){

    console.log('One entry each');

    // const canvas = createCanvas(500, 768);
    // const context = canvas.getContext('2d');
    // const canvasContainer = document.getElementById("divContainer");


    // Not working since I am unsure how to import the data from Konva module
    // var stage = new Konva.Stage({
    //   container: none,
    //   width: 500,
    //   height: 768
    // });
    //
    // var layer = new Konva.Layer();
    // stage.add(layer);
    //
    // var canvas = document.createElement('canvas');
    // canvas.width = stage.width();
    // canvas.height = stage.height();
    //
    // var image = new Konva.Image({
    //   image: canvas,
    //   x: 0,
    //   y: 0
    // });
    // layer.add(image);
    // stage.draw();
    //
    // var strokes = topStrokes[0].data;
    //
    // for (var i = 0; i < strokes.length; i++) {
    //
    //   context.lineWidth = strokes[i].size;
    //
    //   if (strokes[i].mode === 'pencil') {
    //     context.globalCompositeOperation = 'source-over';
    //
    //   } else if (strokes[i].mode === 'eraser') {
    //     context.globalCompositeOperation = 'destination-out';
    //   }
    //
    //   if (strokes[i] === 'start') {
    //     context.beginPath();
    //     context.moveTo(strokes[i].x, strokes[i].y);
    //   }
    //
    //   context.lineTo(strokes[i].x, strokes[i].y);
    //   context.closePath();
    //   lastPointerPosition.x = strokes[i].x;
    //   lastPointerPosition.y = strokes[i].y;
    //   context.moveTo(lastPointerPosition.x, lastPointerPosition.y);
    //
    //
    //   if (strokes[i] === 'end' || i == strokes.length - 1) {
    //     context.stroke();
    //     layer.batchDraw();
    //   }
    //   console.log('Inside draw function');
    // }

    // Last getPointerPosition
    // layer

  }
}

function combineTest(){
  var base64 = "data:image/png;base64,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";


  /// code found online

//   var ReadableData = require('stream').Readable;
// const imageBufferData = Buffer.from(base64, 'base64');
// var streamObj = new ReadableData();
// streamObj.push(imageBufferData);
// streamObj.push(null);
// streamObj.pipe(fs.createWriteStream('testImage2.jpg'));

  // let base64String = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA';
  let base64Image = base64.split(';base64,').pop();

  fs.writeFile('image.png', base64Image, {encoding: 'base64'}, function(err) {
      console.log('File created');
    });


  const canvas = createCanvas(500, 768);
  const context = canvas.getContext('2d');

/// code found online


  let image = new Image('image.png');
  context.drawImage(image, 0, 0);

  // var example = imageUrl;
  //
  // decode(image, {
  //   fname: 'example',
  //   ext: 'png'
  // });

  console.log('Canvas was created');
}


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
