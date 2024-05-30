(function ($, Drupal, window, document, once) {
  "use strict";

  // set namespace for frontend UI javascript
  if (typeof window.splashUI == 'undefined') { window.splashUI = {}; }

  const self = window.splashUI;

  Drupal.behaviors.splashUI_p010 = {
    attach: function (context, settings) {
      $(document).ready(function(){
        $(once('js-once-p010Children', '.field--name-field-p-010-children .field__items')).each(function() {
          const slider = $(this);

          // Init slick
          slider.slick({
            slide: '.field__item',
            infinite: true,
            speed: 300,
            slidesToShow: 5,
            slidesToScroll: 1,
            adaptiveHeight: true,
            prevArrow: '<span class="slick-prev">Previous</span>',
            nextArrow: '<span class="slick-next">Previous</button>',
            responsive: [
              {
                breakpoint: 1200,
                settings: {
                  slidesToShow: 5,
                }
              },
              {
                breakpoint: 940,
                settings: {
                  slidesToShow: 4,
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 3,
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 2,
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                }
              },
            ]
          });

          // Enable autoplay if needed
          if (slider.parent('.field--name-field-p-010-children').hasClass('autoplay')) {
            setTimeout(function () {
              slider.slick('slickPlay');
            }, 5000);
          }
        });
      });

    }
  };

})(jQuery, Drupal, window, document, once);
