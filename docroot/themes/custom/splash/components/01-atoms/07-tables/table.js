(function ($, Drupal, window, document, once) {

  "use strict";

  // set namespace for frontend UI javascript
  if (typeof window.splashUI == 'undefined') { window.splashUI = {}; }

  const self = window.splashUI;

  Drupal.behaviors.splashUITables = {
    attach: function (context, settings) {
      const tables = $('table', context);

      // Make responsive tables
      // in the Sass: choose between 2 types: 'reformatted' or 'scroll'
      if (tables.length) self.setResponsiveTables(tables);
    }
  };

  /**
   * Make tables responsive
   *
   */

  self.setResponsiveTables = function(tables) {

    // Add responsive functionality to tables added via WYSIWYG
    // or otherwise inserted in the page (eg. from Commerce)

    // if coming from CKE
    const ckeClass = '.cke_show_borders, .text-long';

    $(once('js-once-set-responsive-tables', tables)).each(function() {
      const table = $(this);

      if(table.closest('.page').length ) {

        // if already has a responsive class, define the type
        // based on if it's coming from CKE or not

        // if table in CKE, we need to take into account
        // the style that the user has set on it:
        if (table.closest(ckeClass).length) {

          // user has set to be reformatted
          // so wrap in a div with the right classes
          // and fire function
          if (table.hasClass('table--reformatted')) {
            if(!table.closest('div').hasClass('table-responsive')) {
              table.wrap('<div class="table-responsive is-reformatted"></div>');
            }
            self.responsiveTables(table);
          // no class, or scroll class, set that wrapper
          } else {
            if(!table.closest('div').hasClass('table-responsive')) {
              table.wrap('<div class="table-responsive has-scroll"></div>');
            }
          }

        // not coming from CKE,
        // we can't give the user a choice and just do the default:
        // check for a wrapper and add one if there isn't one
        // set class to reformat on mobile
        }
        else {
          self.responsiveTables(table);
        }
      }
    });
  };

  self.responsiveTables = function(table) {
    // make data-attributes for CSS to use as headings
    // if th's in thead
    if(table.find('thead').length) {
      let headings = [];
      table.find('th').each(function(){
        headings.push($(this).text());
      });
      console.log(headings);
      let count = 0;
      table.find('tr').each(function(){
        // table.find('td').attr('data-title', headings[count-1]);
        // ++count;
        count = 0;
        $(this).find('td').each(function() {
          $(this).attr('data-title', headings[count]);
          ++count;
        });
      });
    } else {
      // if th's in tbody
      if(table.find('th').length) {
        table.find('tr').each(function(){
          const heading = $(this).find('th').text();
          table.find('td').each(function(){
            table.attr('data-title', heading);
          });
        });
      // if no th's at all, don't need certain styling on mobile
      } else {
        table.addClass('no-th');
      }
    }
  };


})(jQuery, Drupal, window, document, once);

