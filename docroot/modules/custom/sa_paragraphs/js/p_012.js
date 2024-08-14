(function ($, Drupal, window, document, once) {
  "use strict";

  // set namespace for frontend UI javascript
  if (typeof window.splashUI == 'undefined') { window.splashUI = {}; }

  const self = window.splashUI;

  Drupal.behaviors.splashUI_p012 = {
    attach: function (context, settings) {
      const guidanceBox = $('.paragraph--type-p-012-child', context);
      if (guidanceBox.length) self.guidanceBoxAnimate(guidanceBox);
    }
  };

  /*
   *
   * Open/close guide box text
   * but only if teaser or teaser-image view modes
   */
  self.guidanceBoxAnimate = function(box) {
    $(once('js-once-faq-collapsable', box)).each(function () {
      const box = $(this);

      // check for view mode classes
      // if guidance mode 1 (title visible only)
      if (box.hasClass('p__child--view-mode--title') || box.hasClass('p__child--view-mode--image')) {
        let overlay = box.find('.p-012-child--text'),
            paddingTop = parseInt(overlay.css('paddingTop')),
            title = box.find('.field--name-field-p-title'),
            titleHeight = title.outerHeight(true);

        // make the overlay stick out by height of title
        self.guidanceBoxPosition(overlay, title);

        // recalculate on window resize
        // check if our helperfunction for an optimized resize exists
        if (typeof self.optimizedResize === "function") {
          self.optimizedResize().add(function() {
            self.guidanceBoxPosition(overlay, title);
          });
        // otherwise fall back on the normal window resize
        }
        else {
          $(window).on('resize', function() {
            self.guidanceBoxPosition(overlay, title);
          });
        }

        // change happens on hover
        // no need to bother with touch-specific events,
        // because that opens a link so they won't see the overlay effect anyway
        box.on('mouseenter', function(e) {
          overlay.css({top: '0'});
        });

        box.on('mouseleave', function(e) {
          self.guidanceBoxPosition(overlay, title);
        });
      }
    });
  };

  // make the overlay stick out by height of title
  self.guidanceBoxPosition = function(overlay, title) {
    let paddingTop = parseInt(overlay.css('paddingTop')),
        titleHeight = title.outerHeight(true),
        newPosition = titleHeight + paddingTop;

    overlay.css({top: 'calc(100% - ' + newPosition + 'px)'});
  }

})(jQuery, Drupal, window, document, once);
