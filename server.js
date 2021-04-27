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

// Arrays which will hold image file names
const topImage = [];
const midImage = [];
const bottomImage = [];
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

  // Listen for imageURL and socketId of user sending the strokes
  socket.on('urlAndId', (imageURL, userId) => {

    firstFunction(imageURL, userId);
  });

  //To emit back to the server for everyone to see: io.emit('message', msg) --> Will use this to send fininshed drawing to the database?

  // Runs when client disconnects --> needs to be inside connection
  socket.on('disconnect', () => {
      io.emit('message', 'A user has finished drawing');
  })
});


async function firstFunction(b64, uID){
  // var imageLoaded = false;
  // push URL back to first, second or third array depending on socket id

  var imgName = 'image' + uID + '.png';
  console.log(imgName);

  const canvasImg = await fs.writeFile(imgName, b64, {encoding: 'base64'}, function(err) {
      console.log('File created but not yet pushed');

      if(uID%3 === 1){
        topImage.push(imgName);
      }
      else if(uID%3 === 2){
        midImage.push(imgName);
      }
      else if(uID%3 === 0){
        bottomImage.push(imgName);
      }
      else {
        console.log('Invalid socket ID.');
      }

      // topImage.push('imageTest.png');
      console.log('pushed image into array');

      // if(canvasImg !== 'undefinded'){
      //   imageLoaded = true;
      //   secondFunction();
      // }
      //
      // else {
      //   console.log('canvas is empty');
      // }

      secondFunction();
    });




}



async function secondFunction() {
   // await firstFunction(b64);

   if(topImage.length>0 && midImage.length > 0 && bottomImage.length > 0){
     console.log('One entry each');

     const canvas = createCanvas(500, 768);
     const context = canvas.getContext('2d');

     // imageName = topStrokes[0];

     const image1 = await loadImage(topImage[0]);
     const image2 = await loadImage(midImage[0]);
     const image3 = await loadImage(bottomImage[0]);

     // if(image !== 'undefined'){
       context.drawImage(image1, 0, 0, 500, 256);
       context.drawImage(image2, 0, 256, 500, 256);
       context.drawImage(image3, 0, 512, 500, 256);
       const buffer = canvas.toBuffer('image/png');
       fs.writeFileSync('./imageCompleteTest4.png', buffer);
       console.log('Final image');
     // }


     loadImage(image).catch((err) => console.log(err));

     


   }

}


// Adds each strokes array to the corresponding array, either mid/center or bottom strokes
// function pushStrokesArray(base64, combineDrawing){
//
//   let base64Image = base64.split(';base64,').pop();
//
//   const canvasImg = fs.writeFile('image.png', base64Image, {encoding: 'base64'}, function(err) {
//       console.log('File created');
//     });

  // topStrokes.push(base64Image);

  // combineDrawing();

  // if (socketId%3 === 1){
  //   topStrokes.push({
  //     sessionId: socketId,
  //     data: strokes
  //   })
  //   console.log(topStrokes[0]);
  // }
  // else if (socketId%3 === 2){
  //   midStrokes.push({
  //     sessionId: socketId,
  //     data: strokes
  //   })
  //   console.log(midStrokes[0]);
  // }
  // else if (socketId%3 === 0){
  //   bottomStrokes.push({
  //     sessionId: socketId,
  //     data: strokes
  //   })
  //   console.log(bottomStrokes[0]);
  // }
  // else {
  //   console.log('ID invalid, strokes could not be pushed back in array.');
  // }
  // combineDrawing(topStrokes[0], midStrokes[0], bottomStrokes[0]);
// }


// Verify if top/mid/bottom stroke arrays hold at least one stroke array each to combine drawing
// Combines each 1st slots from top/mid/bottom stroke arrays
// function combineDrawing(){
//   // if(topStrokes.length > 0 && midStrokes.length > 0 && bottomStrokes.length > 0){
//
//
//   if(topStrokes.length>0){
//     console.log('One entry each');
//
//     const canvas = createCanvas(500, 768);
//     const context = canvas.getContext('2d');
//
//
//   /// code found online
//
//
//     // loadImage('TryingOut.png').then(image => {
//     //   // context.drawImage(image, 50, 0, 70, 70);
//     //   console.log('success');
//     // })
//
//     const image = loadImage('TryingOut.png');
//     context.drawImage(image, 0, 0, 500, 256);
//     context.drawImage(image, 0, 256, 500, 256);
//     context.drawImage(image, 0, 512, 500, 256);
//
//     loadImage('TryingOut.png').catch((err) => console.log(err));
//
//     const buffer = canvas.toBuffer('image/png');
//     fs.writeFileSync('./imageComplete1.png', buffer);
//     console.log('Final image');
//
//
// }
//
//   // }
// }

// async function combineTest(){



  /// code found online

//   var ReadableData = require('stream').Readable;
// const imageBufferData = Buffer.from(base64, 'base64');
// var streamObj = new ReadableData();
// streamObj.push(imageBufferData);
// streamObj.push(null);
// streamObj.pipe(fs.createWriteStream('testImage2.jpg'));

  // let base64String = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA';
  // let base64Image = base64.split(';base64,').pop();
  //
  // const canvasImg = await fs.writeFile('image.png', base64Image, {encoding: 'base64'}, function(err) {
  //     console.log('File created');
  //   });

  // combineTestSecond();

//   const canvas = createCanvas(500, 768);
//   const context = canvas.getContext('2d');
//
//
// /// code found online
//
//
//   loadImage('image.png').then((image) => {
//     context.drawImage(image, 50, 0, 70, 70);
//     console.log('success');
//   })
//
//   loadImage('image.png').catch((err) => console.log(err));





  // const buffer = canvas.toBuffer('image/png');
  // fs.writeFileSync('./imageComplete.png', buffer);
  // console.log('Final image');



  // var example = imageUrl;
  //
  // decode(image, {
  //   fname: 'example',
  //   ext: 'png'
  // });

//   console.log('Canvas was created');
// }

// function combineTestSecond(){


//   const canvas = createCanvas(500, 768);
//   const context = canvas.getContext('2d');
//
// /// code found online
//
//
//   loadImage('image.png').then((image) => {
//     context.drawImage(image, 50, 0, 70, 70);
//     console.log('success');
//   })
//
//   loadImage('image.png').catch((err) => console.log(err))

// }


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
