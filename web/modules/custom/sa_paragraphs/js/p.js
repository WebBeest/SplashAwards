(function ($, Drupal, window, document, once) {
  "use strict";

  // set namespace for frontend UI javascript
  if (typeof window.splashUI === 'undefined') { window.splashUI = {}; }

  const self = window.splashUI;

  Drupal.behaviors.splashUI_p = {
    attach: function (context, settings) {
      const groupedParagraphs = $('.group--paragraphs__item', context);

      // add class for paragraphs that border each other and have same bg
      if (groupedParagraphs.length) {
        self.group(groupedParagraphs);
      }
    }
  };

  /**
   * Make sure that paragraphs with the same bg-color
   * don't have too much space, by adding a class we can use for styling overrides/exceptions
   *
   */
  self.group = function(paragraphItems) {
    $(once('js-once-paragraphsGroup', paragraphItems)).each(function() {

      const paragraphItem = $(this);

      $(once('js-once-groupedParagraph', paragraphItem)).each(function() {
        let pIt = $(this),
          p = pIt.find('.paragraph').first(),
          pItNext = pIt.next(),
          pNext = pItNext.find('.paragraph').first();

        const paragraphsHandler = function() {

          // when 2 paragraphs following each other have the same BG color,
          // add classes to reset paddings to avoid 'double padding' perception
          // under specific circumstances
          //
          if (pNext.length && typeof pNext[0] !== 'undefined' && typeof pNext[0].classList !== 'undefined' && pNext[0].classList.length) {

            const pMarginTop = parseInt(p.css('marginTop').replace('px', ''), 10);

            // ONLY IF:
            // - both have same BG color
            // - && neither has a BG image
            // - && both paragraphs do or do not have bg images
            // - && first p has no stretched image/video (this behaves a bit like BG image)
            // - && first p has no bottom margin
            if (!p.hasClass('p--layout--image_stretched') && !p.hasClass('p--layout--video_stretched') && (!p.hasClass('has-bg-image') && !pNext.hasClass('has-bg-image')) && (p.hasClass('has-bg') && pNext.hasClass('has-bg') || !p.hasClass('has-bg') && !pNext.hasClass('has-bg')) && (pMarginTop < 1)) {

              // get classes of both
              const pClassList = p[0].className.split(/\s+/);
              const pNextClassList = pNext[0].className.split(/\s+/);

              // no bg class, so both transparent
              if (!p.hasClass('has-bg') && !pNext.hasClass('has-bg')) {

                pIt.addClass('has-matching-bg').addClass('has-matching-bg-first');
                pItNext.addClass('has-matching-bg').addClass('has-matching-bg-last');

                // if both have a bg color, check that it's the same bg color
              }
              else {
                // look for any item that contains 'bg--' and is same in both paragraphs
                for (let i = 0; i < pClassList.length; ++i) {
                  for (let j = 0; j < pNextClassList.length; ++j) {
                    if (pClassList[i] === pNextClassList[j]) {
                      if (pClassList[i].indexOf('bg--') !== -1) {
                        pIt.addClass('has-matching-bg').addClass('has-matching-bg-first');
                        pItNext.addClass('has-matching-bg').addClass('has-matching-bg-last');
                      }
                    }
                  }
                }
              }
            }
          }
        };

        paragraphsHandler();

        splashUI.optimizedResize().add(function() {
          paragraphsHandler();
        });
      });
    });
  };

  /**
   * Detect if all the images withing your object are loaded
   *
   * No longer needs imagesLoaded plugin to work
   */
  self.imgLoaded = function (el, callback)
  {
    let img = el.find('img'),
      iLength = img.length,
      iCount = 0;

    if (iLength) {
      img.each(function() {

        const img = $(this);
        // fires after images are loaded (if not cached)
        img.on('load', function(){
          iCount = iCount + 1;
          if (iCount === iLength) {
            // all images loaded so proceed
            callback();
          }
        }).each(function() {
          // in case images are cached
          // re-enter the load function in order to get to the callback
          if (this.complete) {
            const url = img.attr('src');
            $(this).load(url);
            iCount = iCount + 1;

            if (iCount === iLength) {
              // all images loaded so proceed
              callback();
            }
          }
        });
      });
    }
    else {
      // no images, so we can proceed
      return callback();
    }
  };

})(jQuery, Drupal, window, document, once);
