// Konva --> For canvas
// Cursor brush --> https://codepen.io/designcourse/pen/GzJKOE



window.onload = function() {
  console.log('Script loaded');

  let cvs1 = CustomCanvas('canvas1');
  let cvs2 = CustomCanvas('canvas2');
  let cvs3 = CustomCanvas('canvas3');

  // Function creates a canvas with custom size to draw on
  function CustomCanvas(theCanvas) {

    var width = 500; //resize here for format
    var height = 256 - 25; //dont touch minus 25

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



    // created canvas we can add to layer as "Konva.Image" element
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

    var points = [];

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
      points.push('start');

      // Stop drawing if cursor is leaves canvas to avoid jagged line
      // when cursor returns to canvas
      stage.addEventListener('mouseout', function() {
        if(isPaint){
          points.push('end');
        }
        isPaint = false;
      });
    });

    // will it be better to listen move/end events on the window?
    stage.on('mouseup touchend', function() {
      isPaint = false;
      // console.log('end');
      // strokeType = 'end';
      points.push('end');
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

      var pencil = document.getElementById("pencil");
      var eraser = document.getElementById("eraser");
      var reverse = document.getElementById("reverse");

      pencil.addEventListener("click", () => {
        mode = 'pencil';
        cursor.style.borderRadius = '50%';
        selectedTool(pencil, true);
        selectedTool(eraser, false);
      })

      eraser.addEventListener("click", () => {
        mode = 'eraser';
        cursor.style.borderRadius = '10%';
        selectedTool(eraser, true);
        selectedTool(pencil, false);
      })

      reverse.onclick = function() {
        undoLast();
        console.log(points);
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
      // console.log("Pushed points X:" + pos.x + " and Y: " + pos.y);
      console.log(points);
      points.push({
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
      // cursor.setAttribute("style", "top: "+(e.pageY - 5)+"px; left: "+(e.pageX - 5)+"px;")
      cursor.style.top = (e.pageY - context.lineWidth - 1) + "px";
      cursor.style.left = (e.pageX - context.lineWidth - 1) + "px";
      cursor.style.backgroundColor = "none";
      // cursor.setAttribute("style", "top: "+(e.pageY - 5)+"px; left: "+(e.pageX - 5)+"px;")
    })

    window.addEventListener('mouseup touchend', e => {
      cursor.style.backgroundColor = "grey";

      console.log('set grey');

      // cursor.setAttribute("style", "top: "+(e.pageY - 5)+"px; left: "+(e.pageX - 5)+"px;")
    })

    //Increase and decrease pencil and eraser radius on scroll
    document.addEventListener("wheel", function(e) {
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
      for (var i = points.length - 1; i >= 0 && points[i] !== 'start'; i--) {
          points.pop();
      }
      //Pop start
      if (points[points.length - 1] === 'start') {
        points.pop();
      }

      var currentRadius = context.lineWidth;
      redrawAll();
      context.lineWidth = currentRadius;
    }

    function redrawAll() {

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (points.length === 0) {
        console.log('0 in array');
        return;
      }


      for (var i = 0; i < points.length; i++) {

        context.lineWidth = points[i].size;

        if (points[i].mode === 'pencil') {
          context.globalCompositeOperation = 'source-over';

        } else if (points[i].mode === 'eraser') {
          context.globalCompositeOperation = 'destination-out';
        }

        if (points[i] === 'start') {
          context.beginPath();
          context.moveTo(points[i].x, points[i].y);
        }

        context.lineTo(points[i].x, points[i].y);
        context.closePath();
        lastPointerPosition.x = points[i].x;
        lastPointerPosition.y = points[i].y;
        context.moveTo(lastPointerPosition.x, lastPointerPosition.y);


        if (points[i] === 'end' || i == points.length - 1) {
          context.stroke();
          layer.batchDraw();
        }
      }
      context.stroke();
    }




  } // CANVAS FUNCTION END

  function selectedTool(tool, state) {
    if (state === true) {
      tool.style.border = "none";
      tool.style.opacity = "100%";
      tool.style.filter = "drop-shadow(0px 0px 5px #b0f1ff)";
    } else if (state === false) {
      tool.style.border = "none";
      tool.style.opacity = "50%";
      tool.style.filter = "sepia(1.0) invert(.5) brightness(1.5)";
    }

  }



}
