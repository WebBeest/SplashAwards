(function ($, Drupal, window, document, once) {
  "use strict";
  // set namespace for frontend UI javascript
  if (typeof window.splashUI == 'undefined') { window.splashUI = {}; }

  const self = window.splashUI;

  Drupal.behaviors.splashUIStatus = {
    attach: function (context, settings) {
      let message = $('.messages--drupal', context);
      self.drupalMessages(message);
    }
  };

  /**
   * Click away Drupal messages
   *
   */
  self.drupalMessages = function (message) {
    $(once('js-once-status', message)).each(function() {
      const myMessage = $(this);

      myMessage.find('.js-close').on('click', function (e) {
        myMessage.addClass('js-closing');
        e.preventDefault();
      });

      myMessage.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
        if (myMessage.hasClass('js-closing')) {
          myMessage.addClass('js-closed');
        }
      });
    });
  };

})(jQuery, Drupal, window, document, once);
