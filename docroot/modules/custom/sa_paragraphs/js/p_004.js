(function ($, Drupal, window, document, once) {

  "use strict";

  // set namespace for frontend UI javascript
  if (typeof window.splashUI == 'undefined') { window.splashUI = {}; }

  const self = window.splashUI;

  Drupal.behaviors.splashUI_p004 = {
    attach: function (context, settings) {
      const faq = $('.field__item--name-field-p-004-item', context);
      if (faq.length) self.faqCollapsable(faq);
    }
  };

  /**
   * Open/close FAQ items
   */
  self.faqCollapsable = function (faq) {
    $(once('js-once-faq-collapsable', faq)).each(function () {
      let faqItem = $(this),
        trigger = faqItem.find('.tab-item__title'),
        target = faqItem.find('.tab-item__content');

      // alternative field names for faq title
      if (typeof trigger == 'undefined' || trigger.length < 1) {
        trigger = faqItem.find('h2:first-child, h3:first-child');
      }

      trigger.on('click', function () {

        // close item
        if (faqItem.hasClass('js-open')) {
          faqItem.removeClass('js-open');
          target.stop( true, true ).slideUp(250, function () {
            //callback
          });
          // open item
        }
        else {
          faqItem.addClass('js-open');
          target.stop( true, true ).slideDown(250, function () {
            //callback
          });

          // close all siblings
          faqItem.siblings().each(function () {
            const sibling = $(this);

            if (sibling.hasClass('js-open')) {
              sibling.removeClass('js-open');
              sibling.find('.tab-item__content').stop( true, true ).slideUp(250, function () {
                //callback
              });
            }
          });
        }
      });
    });
  };
})(jQuery, Drupal, window, document, once);
