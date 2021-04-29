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


// Assign variables to node modules
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Arrays which will hold image file names
const topImage = [];
const midImage = [];
const bottomImage = [];
let count = 0;

const imgPathSep = 'public/seperateImg/';
const imagPathComb = 'public/combinedImg/';
let combinedImgCount = 0;




// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/static', express.static(path.join(__dirname, 'public')))


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

  var imgName = imgPathSep + 'image' + uID + '.png';
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

      console.log('pushed image into array');
      secondFunction();
    });

}



async function secondFunction() {
   // await firstFunction(b64);

   if(topImage.length>0 && midImage.length > 0 && bottomImage.length > 0){
     console.log('One entry each');

     // Copy paths over so the array space can be freed avoiding duplicate calls of the same function
     const image1Path = topImage[0];
     const image2Path = midImage[0];
     const image3Path = bottomImage[0];

     // Remove image file reference from arrays
     topImage.shift();
     midImage.shift();
     bottomImage.shift();

     // Creating canvas with canvas module, setting dimensions and loading image to set as background
     const canvas = createCanvas(615, 843);
     const context = canvas.getContext('2d');
     const backgroundImg = await loadImage('public/css/ImgFiles/combinedImageCanvasBg.png');
     loadImage(backgroundImg).catch((err) => console.log(err));
     context.drawImage(backgroundImg, 0, 0, 615, 843);


     const image1 = await loadImage(image1Path);
     loadImage(image1).catch((err) => console.log(err));

     const image2 = await loadImage(image2Path);
     loadImage(image2).catch((err) => console.log(err));

     const image3 = await loadImage(image3Path);
     loadImage(image3).catch((err) => console.log(err));

       context.drawImage(image1, 57.5, 0, 500, 281);
       context.drawImage(image2, 57.5, 281, 500, 281);
       context.drawImage(image3, 57.5, 562, 500, 281);
       const buffer = canvas.toBuffer('image/png');
       const imageCombinedPath = imagPathComb + 'combinedImg' + combinedImgCount + '.png';
       fs.writeFileSync(imageCombinedPath, buffer);
       console.log('Final image');
       combinedImgCount++;



     // Delete seperate image files from Folder
     // fs.unlinkSync(image1Path, function(err) {
     //   if (err) {
     //     throw err
     //   } else {
     //     console.log("Another error occured deleting image1.")
     //   }
     // })
     // fs.unlinkSync(image2Path, function(err) {
     //   if (err) {
     //     throw err
     //   } else {
     //     console.log("Another error occured deleting image2.")
     //   }
     // })
     // fs.unlinkSync(image3Path, function(err) {
     //   if (err) {
     //     throw err
     //   } else {
     //     console.log("Another error occured deleting image3.")
     //   }
     // })

   } // end if checking if image url is in array

}



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
