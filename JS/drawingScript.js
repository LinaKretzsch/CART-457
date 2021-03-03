// Konva --> For canvas
// Cursor brush --> https://codepen.io/designcourse/pen/GzJKOE



window.onload = function()
{
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
    var mode = 'brush';
    var radius = 1.5;


    var context = canvas.getContext('2d');

    // context.strokeStyle = '#3F4650';
    context.strokeStyle = color;
    context.lineJoin = 'round';
    context.lineWidth = radius;

    // Change cursor appearance once mouse is over canvas
    // document.getElementById(theCanvas).style.cursor = function()
    // {
    //
    // }


    // now we need to bind some events
    // we need to start drawing on mousedown
    // and stop drawing on mouseup
    image.on('mousedown touchstart', function()
    {
      isPaint = true;
      lastPointerPosition = stage.getPointerPosition();


      // Stop drawing if cursor is leaves canvas to avoid jagged line
      // when cursor returns to canvas
      window.addEventListener ("mouseout", function()
      {
        isPaint = false;

      });
    });

    // will it be better to listen move/end events on the window?
    stage.on('mouseup touchend', function()
    {
      isPaint = false;

    });

    // and core function - drawing
    stage.on('mousemove touchmove', function()
    {
      if (!isPaint) {
        return;
    }

      // context.globalCompositeOperation = 'source-over';

// Disabled tools for now
      // if (mode === 'brush') {
      //   context.globalCompositeOperation = 'source-over';
      // }
      // if (mode === 'eraser') {
      //   context.globalCompositeOperation = 'destination-out';
      // }

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
      context.lineTo(localPos.x, localPos.y);
      context.closePath();
      context.stroke();
      lastPointerPosition = pos;
      layer.batchDraw();
    });



      const cursor = document.querySelector('.cursor');




        // cursor.setAttribute("style", "top: "+(context.posY - 5)+"px; left: "+(context.posX - 5)+"px;")




        // document.addEventListener('mousemove', e => {
        //   cursor.style.top = e.pageY - 5+"px";
        //   cursor.style.left = e.pageX - 5+"px";
        //
        //     // cursor.setAttribute("style", "top: "+(e.pageY - 5)+"px; left: "+(e.pageX - 5)+"px;")
        // })

        window.addEventListener('mousemove', e => {
          cursor.setAttribute("style", "top: "+(e.pageY - 5)+"px; left: "+(e.pageX - 5)+"px;")
          cursor.style.backgroundColor = "none";

            // cursor.setAttribute("style", "top: "+(e.pageY - 5)+"px; left: "+(e.pageX - 5)+"px;")
        })

        window.addEventListener('mouseup touchend', e => {
          // document.removeEventListener('mousemove', e);
          // cursor.setAttribute("style", "top: "+(e.pageY - 5)+"px; left: "+(e.pageX - 5)+"px;")
          cursor.style.backgroundColor = "grey";

          console.log('set grey');
            // cursor.setAttribute("style", "top: "+(e.pageY - 5)+"px; left: "+(e.pageX - 5)+"px;")
        })


        //
        document.addEventListener('scroll', () => {
          // cursor.style.borderRadius
          console.log('scroll');

        });

        // context.onmousedown = function(){
        //   cursor.style.backgroundColor = "grey";
        //   console.log("EYO");
        // }

        // document.addEventListener('mousedown', () => {
        //   cursor.style.backgroundColor = "grey";
        // });

        //mouse moves and not clicked --> grey outline
        //mouse moves and clicked and on canvas --> smaller, grey
        //
        //
        // document.addEventListener('click', () => {
        //     cursor.style.backgroundColor = "grey";
        //     console.log('down');
        //
        //     // setTimeout(() => {
        //     //     cursor.classList.remove("expand");
        //     // }, 500)
        // });


        // document.addEventListener('onmouseup', () => {
        //   cursor.style.backgroundColor = "none";
        //   cursor.style.border = "2px";
        // });

        // document.addEventListener('click', () e => {
        //     cursor.setAttribute("style", "top: "+(e.pageY - 5)+"px; left: "+(e.pageX - 5)+"px;");
        // })

            // setTimeout(() => {
            //     cursor.classList.remove("expand");
            // }, 500)




  } // CANVAS FUNCTION END




}
