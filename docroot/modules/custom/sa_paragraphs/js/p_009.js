(function ($, Drupal, window, document, once) {
  "use strict";

  // set namespace for frontend UI javascript
  if (typeof window.splashUI == 'undefined') { window.splashUI = {}; }

  const self = window.splashUI;

  // set up an array to save listeners for masonry grid for each instance
  self.magicGrids = [];

  Drupal.behaviors.splashUI_p009 = {
    attach: function (context, settings) {

      let paragraph = $('.paragraph--type-p-009'),
        loadMoreParagraph = $('.paragraph.has--load-more'),
        paragraphMasonry = $('.paragraph--view-mode-p-009-masonry');

      // check for masonry layout
      if (paragraph.length) self.masonry(paragraph, context);

      // add load more functionality
      if (paragraph.length) self.loadMoreFieldItems(paragraph, context);
    }
  };

  /**
   * Make a horizontal Masonry layout
   *
   * Uses a library 'Magic Grid', accessed via a CDN
   * https://github.com/e-oj/Magic-Grid
   *
   * @param paragraph
   * @param loadMore
   * @param context
   */
  self.masonry = function(paragraph, context) {
    let index = 0;

    // check all photogallery paragraphs to see if they are in masonry view mode
    $(once('js-p009-masonryCheck', paragraph)).each(function (i) {
      const paragraph = $(this),
        id = 'p-photogallery-' + i;

      paragraph.attr('id', id);
      index = i;

      // set and save the listener in an array
      if (paragraph.hasClass('paragraph--view-mode-p-009-masonry')) {

        // wait for images to load
        self.imgLoaded(paragraph, function() {
          self.magicGrids[index] = new MagicGrid({
            container: '#p-photogallery-' + i + ' .field--name-field-p-images-unlimited .field__items',
            animate: true,
            gutter: 0,
            static: true
          });

          self.magicGrids[index].listen();
        });
      }
      else {
        self.magicGrids[index] = null;
      }
    });
  };

  /**
   * Hide everything but the limited amount of field items
   * show/hide on click of a 'load more' field
   *
   * NOTE: we reload the masonry items when showing more items
   *
   */
  self.loadMoreFieldItems = function(paragraph, context) {

    // by default, all field items > the limit should by hidden using CSS
    // when there is a load-more button

    $(once('js-p009-loadMoreCheck', paragraph)).each(function (i) {
      const paragraph = $(this);
      const loadMoreButton = paragraph.find('.field--name-field-p-load-more', context);

      if (loadMoreButton.length && paragraph.hasClass('has--load-more')) {
        $(once('js-load-more', loadMoreButton)).on('click', function (e) {
          const itemLimit = paragraph.data('limit');

          // loop the field items
          //
          // remove visibility class if they have one
          // add class if they don't

          paragraph.toggleClass('has--visible-items');

          $('.field__item', paragraph).each(function (index) {
            const item = $(this);

            // remove the classes
            if (index > parseInt(itemLimit - 1)) {
              $(item).toggleClass('is--visible');
            }
          });

          // if in Masonry mode, retrigger the magic so the images reflow with the newly visible images in it
          if (paragraph.hasClass('paragraph--view-mode-p-009-masonry')) {
            // reposition items
            self.magicGrids[i].positionItems();
          }

          e.preventDefault();
        });
      }
    });
  };
})(jQuery, Drupal, window, document, once);
