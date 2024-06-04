/**
 * @file
 * Behaviors of the background color field.
 */
(function ($, _, Drupal, drupalSettings) {
    "use strict";
    Drupal.behaviors.SplashParagraphsAdminColors = {
        attach: function (context) {

          const group = $('.field--name-field-p-bg-color.field--widget-options-buttons, .field--name-field-p-content-bg-color.field--widget-options-buttons');
          console.log(group);
          group.addClass('p-field-bg-color');

          group.find('input:radio').each(function() {
            console.log('test');
            var optionLabel = $(this).next('label');
            var colors = $(this).val().split('/');

            if (colors[0] === '_none') {
              optionLabel.addClass(colors[0]);

            } else {

              var name = colors[0];
              var foreground = colors[1];
              var background = colors[2];

              optionLabel.addClass(name);
              optionLabel.css({'background-color': '#' + background, 'color': '#' + foreground});

            }

          });
        }
    };

})(window.jQuery, window._, window.Drupal, window.drupalSettings);
