(function ($, Drupal, window, document, once) {

  "use strict";

  // set namespace for frontend UI javascript
  if (typeof window.splashAdminUI === 'undefined') { window.splashAdminUI = {}; }

  const self = window.splashAdminUI;

  Drupal.behaviors.SplashParagraphsAdminLayouts = {
    attach: function (context, settings) {

      // find the layout pickers:
      // - 001: image and order of the image vs. text
      // - 002: image
      // - 003: alignment of the text
      // - 007: layout of the usp items (columns)
      // - 006: video stretch
      // - TBD: 009: grid vs mozaic
      const group = $('.field--name-field-p-001-layout-image.field--widget-options-buttons, .field--name-field-p-002-layout-image.field--widget-options-buttons, .field--name-field-video-layout.field--widget-options-buttons, .field--name-field-p-001-layout.field--widget-options-buttons, .field--name-field-p-003-view-mode.field--widget-options-buttons, .field--name-field-p-007-view-mode.field--widget-options-buttons, .field--name-field-p-009-view-mode.field--widget-options-buttons');

      // find the paragraphs that have a text layout option
      const groupTextAlignment = $('.field--name-field-p-003-view-mode');

      // do stuff with it if they exist
      if (group.length) {
        self.layoutPicker(group);
      }


      // Now we can do stuff to override the CKE text alignment buttons
      if (groupTextAlignment.length) {
        self.CKEOverride(groupTextAlignment);
      }

    }
  };

  ///////////////////////////////////////////////////////////////////////
  // Behavior for Tabs: functions
  ///////////////////////////////////////////////////////////////////////

  /**
   * Replace the radiobuttons with images
   * Along with adding and classes to make styling easier
   *
   */
  self.layoutPicker = function(group) {
    $(once('js-once-p-layoutPicker', group)).each(function() {
      let group = $(this)
      group.addClass('p-field-layouts');
      $(once('js-once-p-layoutPicker-radio', group.find('input:radio'))).each(function () {
        const optionLabel = $(this).next('label');
        const layout = $(this).val();

        // wrap the text in a div & put under the radio
        optionLabel.parent().append('<div class="text">' + optionLabel.text() + '</div>');

        // add a class for styling
        let optionClass = layout.replace('_', '-');

        optionLabel.addClass('layout-' + optionClass);
      });
    });
  };

  /**
   * find the paragraphs that have a text layout option
   * so we can do stuff to override the CKE text alignment buttons
   *
   * @param paragraph
   * @constructor
   */
  self.CKEOverride = function(layout) {
    $(once('js-once-p-CKEOverride', layout)).each(function() {
      const layout = $(this);
      const textareaField = layout.parent().find('.js-form-type-textarea');

      // handler for the layout changes
      const layoutHandler = function(value) {

        // -- if active layout is 'centered'
        //    wrap the cke content in a 'centered' class, to mimic the CKE text-alignment functionality
        //    also disable the default cke text align buttons to avoid conflicts with our layout setting

        // find the textareas
        textareaField.each(function() {
          let field = $(this);
          let textarea = field.find('textarea');
          let areaId = textarea.attr('id');
          let text;

          // manipulate the CKE buttons via a class
          // this is bc we want to be able to disable it for new paragraphs with 'centered' layout by default

          if (value === 'centered') {

            // add a class to parent so we can
            // hide the cke text alignment buttons
            // to prevent conflicts between our custom layout and cke's own text alignment buttons

            if (!layout.parent().hasClass('override-cke-text-alignment')) {
              layout.parent().addClass('override-cke-text-alignment');
            }

          } else {

            // only do stuff if it was manipulated in the past
            if (layout.parent().hasClass('override-cke-text-alignment')) {
              // remove the class we used to hide the cke buttons
              layout.parent().removeClass('override-cke-text-alignment');
            }
          }

          // detect if has CKE
          //  only works if cke has already loaded, so if content is being edited or about to be edited
          //  so we add a timeOut to gain some time
          //  it's not perfect but the other solution is working with Promises, which is unsupported in IE11

          let hasCKE = false;

          let ckeTimer = setTimeout(function(){
            clearTimeout(ckeTimer);

            if (typeof CKEDITOR !== 'undefined' && Object.keys(CKEDITOR.instances).length && typeof CKEDITOR.instances[areaId] !== 'undefined') {
              hasCKE = true;
              text = CKEDITOR.instances[areaId].getData();
            }

            // if has CKE
            // wrap text in 'centered' classes for CKE to be able to preview centered text

            if (hasCKE) {
              if (value === 'centered') {

                // wrap content in cke's 'center' class
                // so the cke preview matches our custom centered layout

                const newText = '<div class="text-align-center">' + text + '</div>';

                // textarea.text(newText);
                CKEDITOR.instances[areaId].setData(newText);

                // add a flag to know if it has been changed
                CKEDITOR.instances[areaId]['hasRSAlignmentChanges'] = true;

                // otherwise
              } else {

                // only do stuff if it was manipulated in the past
                if ( typeof CKEDITOR.instances[areaId]['hasRSAlignmentChanges'] !== 'undefined' ) {

                  // remove the alignment class we set to override the preview

                  // remove first instance of our div with alignment class
                  var newTextStart = text.replace('<div class="text-align-center">', '');

                  // remove last closing div
                  var newText = newTextStart.replace(new RegExp("<\/div>([^<\/div>]*)$"), '');

                  // replace text in textarea
                  // textarea.text(newText);
                  CKEDITOR.instances[areaId].setData(newText);

                  // add a flag to know if it has been changed
                  CKEDITOR.instances[areaId]['hasRSAlignmentChanges'] = false;

                }
              }
            }

          }, 500);

        });

      };

      // find the active layout on load, and pass to the layout handler
      layout.find('input:radio:checked').once('js-once-p-CKEOverride-radio').each(function () {
        const value = $(this).val();

        layoutHandler(value);

      });

      // change of layout should also call the layoutHandler
      layout.find('input:radio').once('js-once-p-CKEOverride-radio-change').change(function () {
          const value = $(this).val();

          layoutHandler(value);


      });

    });

  }

})(jQuery, Drupal, window, document, once);
