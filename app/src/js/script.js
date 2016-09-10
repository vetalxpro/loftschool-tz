$(document).ready(function () {
  // var $courses = $('.courses__list-item');
  $('.courses__list').on('click','li', function () {
    var curElement = $(this);
    curElement.addClass('selected');
    $('.fa.fa-square-o', this)          //change font-awesome icon
        .removeClass('fa-square-o')
        .addClass('fa-check-square');


    $('<div />').css({       //create green overlay
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: '0',
      top: '0',
      zIndex: '100',
      background: '#8cc34b',
      opacity: '0.2'
    }).appendTo(curElement.css('position', 'relative'));      //append  overlay to courses__list-item


    curElement.delay(1000).fadeOut(400);

    setTimeout(function () {
      curElement.remove();

      if (!$('.courses__list li:visible').length) {
        $('.courses-title, .courses-subtitle').css({visibility: 'hidden'});
        $('.complete').fadeIn(800);
      }
    }, 1405);

  });
});