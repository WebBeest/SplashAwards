(function ($, Drupal, window, document, once) {
  "use strict";

  // set namespace for frontend UI javascript
  if (typeof window.splashUI == 'undefined') { window.splashUI = {}; }

  const self = window.splashUI;

  Drupal.behaviors.splashUI_p007 = {
    attach: function (context, settings) {
      const uspItem = $('.paragraph--type-p-007-child', context);

      // If the image has a link, insert link in the title as well
      if (uspItem.length) self.linkTitle(uspItem, context);
    }
  };

  /**
   * If the USP item image has a link, also add it to the USP item title
   * by wrapping the content in an a-tag
   *
   */
  self.linkTitle = function(paragraph, context) {
    // find the link attributes and the title field
    $(once('js-once-usp-item-titlelink', paragraph)).each(function() {

      let myParagraph = $(this),
        linkField = myParagraph.find('.field--name-image-url-field a');

      if (linkField.length) {
        let linkUrl = linkField.attr('href'),
          titleField = myParagraph.find('.field--name-field-p-title'),
          linkTitle = linkField.attr('title'),
          linkTarget = linkField.attr('target'),
          hasHeadingTag = false;

        // check if the field contains a h2, h3, h4, h5 or h6 tag
        const titleHtml = titleField.html();

        if (titleHtml.indexOf('<h2>') !== -1 || titleHtml.indexOf('<h3>') !== -1 || titleHtml.indexOf('<h4>') !== -1 || titleHtml.indexOf('<h5>') !== -1 || titleHtml.indexOf('<h6>') !== -1) {
          hasHeadingTag = true;
        }

        // get the heading tag from the title field + the text string,
        // because we need to wrap that text in a link-tag
        const titleTag = titleField.children().first();

        // only proceed if the title field contains a heading tag

        if (typeof titleTag !== 'undefined' && titleTag.length && hasHeadingTag) {
          const titleText = titleTag.text();

          // wrap the title text in a link tag, along with copied link-attributes

          let newTitleText = '<a href="' + linkUrl + '"';

          if (typeof linkTarget !== 'undefined' && linkTarget.length) {
            newTitleText += ' target="' + linkTarget + '"';
          }

          if (typeof linkTitle !== 'undefined' && linkTitle.length) {
            newTitleText += ' title="' + linkTitle + '"';
          }

          newTitleText += '>' + titleText + '</a>';

          // replace the tag content (text & html),
          // with our wrapped text (link + original text)
          titleTag.html(newTitleText);
        }
      }
    });
  };
})(jQuery, Drupal, window, document, once);
