$(document).on('ready', function() {
  $('.slider-center').slick({
    centerMode: true,
    centerPadding: '0',
    slidesToShow: 5,
    variableWidth: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
  });

  $('.slider-center').on('click', '.slick-slide', function (e) {
    e.stopPropagation();
    var index = $(this).data("slick-index");
    if ($('.slick-slider').slick('slickCurrentSlide') !== index) {
      $('.slick-slider').slick('slickGoTo', index);
    }
  });

  // $('.slider-center').on('afterChange', function(event, slick, currentSlide, nextSlide){
  //   $('.slick-slide').css("width", "325px");
  //   $('.slick-center').css("width", "500px");

  // });
});