// Konva --> For canvas
// Cursor brush --> https://codepen.io/designcourse/pen/GzJKOE



window.onload = function() {

  const socket = io();
  let socketId =-1;//-1 is not valid id, good way to check if id is valid


  socket.on('message', message => {
    console.log(message);
  });

  socket.on('connect', function(data) {
       console.log("connected");
       // put code here that should only execute once the client is connected
       socket.emit('join', 'msg:: client joined');
       // handler for receiving client id

       socket.on("joinedClientId", function(data){
         socketId = data;
         console.log("myId "+socketId);

         // //Show canvas 1, 2 or 3 to user 1, 2 or 3
          visibleToUser(socketId);
       });
   });//clientSocket END

  console.log('Script loaded');


  let canvas1Div = document.getElementById('canvas1Wrapper');
  let canvas2Div = document.getElementById('canvas2Wrapper');
  let canvas3Div = document.getElementById('canvas3Wrapper');
  let tools = document.getElementById('tools');



  //depending on user, show either cvs 1, 2 or three and inialize it that way
  function visibleToUser(sID){
    // If first user to join session make first canvas visible
    if(sID%3 === 1){
      let cvs1 = new CustomCanvas('canvas1');
      canvas1Div.style.visibility = 'visible';

      canvas2Div.style.visibility = 'visible';
      canvas2Div.style.opacity = '0.5';

      canvas3Div.style.visibility = 'visible';
      canvas3Div.style.opacity = '0.5';

    }
    if(sID%3 === 2){
      let cvs2 = new CustomCanvas('canvas2');
      tools.style.transform = 'translateY(256px)'

      canvas1Div.style.visibility = 'visible';
      canvas1Div.style.opacity = '0.5';

      canvas2Div.style.visibility = 'visible';

      canvas3Div.style.visibility = 'visible';
      canvas3Div.style.opacity = '0.5';

    }
    if(sID%3 === 0){
      let cvs3 = new CustomCanvas('canvas3');
      tools.style.transform = 'translateY(512px)'


      canvas1Div.style.visibility = 'visible';
      canvas1Div.style.opacity = '0.5';

      canvas2Div.style.visibility = 'visible';
      canvas2Div.style.opacity = '0.5';

      canvas3Div.style.visibility = 'visible';


    }
  }





  // array saving each brush stroke and then
  let strokes = [];

  // Function creates a canvas with custom size to draw on
  function CustomCanvas(theCanvas) {

    var width = 500; //resize here for format
    var height = 281 - 25; //dont touch minus 25

    // first we need Konva core things: stage and layer
    var stage = new Konva.Stage({
      container: theCanvas,
      width: width,
      height: height
    });

    var layer = new Konva.Layer();
    stage.add(layer);

    // then we are going to draw into special canvas element
    var canvas = document.createElement('canvas');
    canvas.width = stage.width();
    canvas.height = stage.height();



    // created canvas we can add to layer as 'Konva.Image' element
    var image = new Konva.Image({
      image: canvas,
      x: 0,
      y: 0
    });
    layer.add(image);
    stage.draw();

    // Good. Now we need to get access to context element

    var color = '#00000';
    var isPaint = false;
    var lastPointerPosition;
    var mode = 'pencil';
    var radius = 1.5;


    selectedTool(pencil, true);

    var context = canvas.getContext('2d');

    // context.strokeStyle = '#3F4650';
    context.strokeStyle = color;
    context.lineJoin = 'round';
    context.lineWidth = radius;



    // now we need to bind some events
    // we need to start drawing on mousedown
    // and stop drawing on mouseup
    image.on('mousedown touchstart', function() {
      isPaint = true;
      lastPointerPosition = stage.getPointerPosition();
      console.log('start');
      strokes.push('start');

      // Stop drawing if cursor is leaves canvas to avoid jagged line
      // when cursor returns to canvas
      stage.addEventListener('mouseout', function() {
        if(isPaint){
          strokes.push('end');
        }
        isPaint = false;
      });
    });

    // will it be better to listen move/end events on the window?
    stage.on('mouseup touchend', function() {
      isPaint = false;
      // console.log('end');
      // strokeType = 'end';
      strokes.push('end');
    });

    // and core function - drawing
    stage.on('mousemove touchmove', function() {
      if (!isPaint) {
        return;
      }

      // context.globalCompositeOperation = 'source-over';

      if (mode === 'pencil') {
        context.globalCompositeOperation = 'source-over';
      }
      if (mode === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
      }

      var pencil = document.getElementById('pencil');
      var eraser = document.getElementById('eraser');
      var reverse = document.getElementById('reverse');
      var submit = document.getElementById('submit');

      pencil.addEventListener('click', () => {
        mode = 'pencil';
        cursor.style.borderRadius = '50%';
        selectedTool(pencil, true);
        selectedTool(eraser, false);
      })

      eraser.addEventListener('click', () => {
        mode = 'eraser';
        cursor.style.borderRadius = '10%';
        selectedTool(eraser, true);
        selectedTool(pencil, false);
      })

      reverse.onclick = () => {
        undoLast();
        console.log(strokes);
      };

      // On submit, current point[] array is sent to the server
      submit.onclick = (e) => {
        e.preventDefault(); //Will prevent default behaviour of automatically submitting to file

        let theContext = context;
        let strokesArray = strokes;
        console.log('clicked submit');

        const dataURL = canvas.toDataURL();

        let base64Image = dataURL.split(';base64,').pop();


        // const canvasImg = fs.writeFile('test1.png', base64Image, {encoding: 'base64'}, function(err) {
        //     console.log('File created');
          // });

        // console.log(dataURI);

        // Emit brush strokes arrray to the server
        socket.emit('urlAndId', base64Image, socketId);
      };


      context.beginPath();

      var localPos = {
        x: lastPointerPosition.x - image.x(),
        y: lastPointerPosition.y - image.y()
      };
      context.moveTo(localPos.x, localPos.y);
      var pos = stage.getPointerPosition();
      localPos = {
        x: pos.x - image.x(),
        y: pos.y - image.y()
      };
      // console.log('Pushed strokes X:' + pos.x + ' and Y: ' + pos.y);
      // console.log(strokes);
      strokes.push({
        x: pos.x,
        y: pos.y,
        size: context.lineWidth,
        mode: mode,
      });

      context.lineTo(localPos.x, localPos.y);
      context.closePath();
      context.stroke();
      lastPointerPosition = pos;
      layer.batchDraw();
    });


    const cursor = document.querySelector('.cursor');

    window.addEventListener('mousemove', e => {
      // cursor.setAttribute('style', 'top: '+(e.pageY - 5)+'px; left: '+(e.pageX - 5)+'px;')
      cursor.style.top = (e.pageY - context.lineWidth - 1) + 'px';
      cursor.style.left = (e.pageX - context.lineWidth - 1) + 'px';
      cursor.style.backgroundColor = 'none';
      // cursor.setAttribute('style', 'top: '+(e.pageY - 5)+'px; left: '+(e.pageX - 5)+'px;')
    })

    window.addEventListener('mouseup touchend', e => {
      cursor.style.backgroundColor = 'grey';

      console.log('set grey');

      // cursor.setAttribute('style', 'top: '+(e.pageY - 5)+'px; left: '+(e.pageX - 5)+'px;')
    })

    //Increase and decrease pencil and eraser radius on scroll
    document.addEventListener('wheel', function(e) {
      if (e.deltaY < 0) {
        if (context.lineWidth !== 0) {
          context.lineWidth -= 0.2;
          cursor.style.width = context.lineWidth + 2.5;
          cursor.style.height = context.lineWidth + 2.5;
        }
      } else if (e.deltaY > 0) {
        if (context.lineWidth < 20) {
          context.lineWidth += 0.2;
          cursor.style.width = context.lineWidth + 2.5;
          cursor.style.height = context.lineWidth + 2.5;
        }
      }
    });


    // Function pops last strokes from the array and then redraws the previous brush strokes
    function undoLast() {
      //popping everyting off the stack until the next
      for (var i = strokes.length - 1; i >= 0 && strokes[i] !== 'start'; i--) {
          strokes.pop();
      }
      //Pop start
      if (strokes[strokes.length - 1] === 'start') {
        strokes.pop();
      }

      var currentRadius = context.lineWidth;
      redrawAll();
      context.lineWidth = currentRadius;
    }

    function redrawAll() {

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (strokes.length === 0) {
        console.log('0 in array');
        return;
      }


      for (var i = 0; i < strokes.length; i++) {

        context.lineWidth = strokes[i].size;

        if (strokes[i].mode === 'pencil') {
          context.globalCompositeOperation = 'source-over';

        } else if (strokes[i].mode === 'eraser') {
          context.globalCompositeOperation = 'destination-out';
        }

        if (strokes[i] === 'start') {
          context.beginPath();
          context.moveTo(strokes[i].x, strokes[i].y);
        }

        context.lineTo(strokes[i].x, strokes[i].y);
        context.closePath();
        lastPointerPosition.x = strokes[i].x;
        lastPointerPosition.y = strokes[i].y;
        context.moveTo(lastPointerPosition.x, lastPointerPosition.y);


        if (strokes[i] === 'end' || i == strokes.length - 1) {
          context.stroke();
          layer.batchDraw();
        }
      }
      return;
      // context.stroke();
    }


    return canvas;

  } // CANVAS FUNCTION END

  function selectedTool(tool, state) {
    if (state === true) {
      tool.style.border = 'none';
      tool.style.opacity = '100%';
      tool.style.filter = 'drop-shadow(0px 0px 5px #b0f1ff)';
    } else if (state === false) {
      tool.style.border = 'none';
      tool.style.opacity = '50%';
      tool.style.filter = 'sepia(1.0) invert(.5) brightness(1.5)';
    }

  }




}
