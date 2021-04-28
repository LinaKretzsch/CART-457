// Reference for loadImages function --> https://stackoverflow.com/questions/11144261/javascript-how-to-load-all-images-in-a-folder

var bCheckEnabled = true;
var bFinishCheck = false;
let img;
let imgArray = new Array();
let galleryPageCount = 0;
let imageCount = 0;


 function loadImage() {
    if (bFinishCheck) {
      clearInterval(myInterval);
      // alert('Loaded ' + imageCount + ' image(s)!)');
      return imgArray;
    }

    if (bCheckEnabled) {
      bCheckEnabled = false;

      img = new Image();
      img.onload = fExists;
      img.onerror = fDoesntExist;
      img.src = '/images/combinedImg/combinedImg' + imageCount + '.png';
    }

  }

  function fExists() {
    imgArray.push(img);
    $($('<img>', {id: 'galleryImg', class:'image' + imageCount, src: img.src})).appendTo('.galleryContainer');

    $('.image'+ imageCount).on('click', function () {
      $('#close').fadeIn(400);
      $('#backLink').fadeOut(200);
      $('.galleryContainer').fadeOut(200);
      $('.singleImageContainer').show();
      $('.singleImageContainer').append(this).show('slow');
      $(this).removeClass('hover');
      // jQuery('.singleImageContainer').css({height: '800px', width: '600px', border: 'none'})
      $(this).css({height: '700px', width: '500px', scroll: 'auto'});
      console.log('img clicked');

      $(this).hover( () => {
        $(this).css({transform: 'translateY(0%)', filter: 'none'});
        }
      );

    })
    // galleryPageCount = galleryPageCount + 1;
    imageCount = imageCount + 1;
    bCheckEnabled = true;
  }

  function fDoesntExist() {
    bFinishCheck = true;
  }

  var myInterval = setInterval(loadImage, 1);

  // document.getElementsById('galleryImg').addEventListener('click', function() {
  //   console.log('clicked');
  // })
