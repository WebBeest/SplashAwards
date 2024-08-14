(function ($, Drupal, window, document, once) {
  "use strict";

  // set namespace for frontend UI javascript
  if (typeof window.splashUI == 'undefined') { window.splashUI = {}; }

  const self = window.splashUI;

  Drupal.behaviors.splashUIBase = {
    attach: function (context, settings) {
      const tabs = $('.tabs__nav', context).first();
      // var iFrames = $('iframe');
      // var teasers = $('.view-mode--teaser');

      // add a class to body to indicate the page has edit tabs
      // so we can set it fixed if needed
      if (tabs.length) self.body.addClass('has-tabs');

      // smooth scrolling to anchors
      // true if fixed header, false for regular header
      self.scrollToAnchor(0);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // Functions
  ///////////////////////////////////////////////////////////////////////

  /*
   * make entire div clickable, if no link around them but has a 'read more' link
   * vars: elements (jquery object) and a linkSelector (string)
   */
  self.teaserLink = function(elements, linkSelector) {
    let newTab = false;

    // default link selector
    if (typeof linkSelector == 'undefined') {
      linkSelector = '[class*="field--name-field-link-"] a, .field--name-node-link a';
    }

    // detect ctrl or command key pressed in
    // because that means opening link in new tab
    let windowItems = once('js-once-teaserlink-keydown', $(window));
    windowItems.forEach(function(element, index) {
      $(element).on('keydown', function (e){
        if (e.ctrlKey || e.metaKey) {
          newTab = true;
        }
      });
    })

    windowItems = once('js-once-teaserlink-keydown', $(window));
    windowItems.forEach(function(element, index) {
      $(element).on('keyup', function (e){
        newTab = false;
      });
    });

    const elementList = once('js-once-teaserlink', elements);
    elementList.forEach(function(element, index) {
      let el = $(element),
        // look for 'read more' link and target attr
        link = el.find(linkSelector).last(),
        hrefProp = link.attr('href'),
        targetProp = link.attr('target');

      // if there is a 'read more' link in the item
      // make the div clickable
      // (ignore if a child link is clicked, so be sure to check target!)

      el.on('click', function(e) {
        const myEl = $(this);

        // if the target of the click is the el...
        // ... or a descendant of the el
        if (!myEl.is(e.target) || myEl.has(e.target).length === 0) {

          // if it's a link tag,
          if( $(e.target).is('a, a *') ){
            // do nothing
            // else, trigger the read-more link
          } else{
            // if new tab key is pressed
            // open in new tab
            if (newTab) {
              window.open(hrefProp, '_blank');

            } else {
              // if target defined, open in target
              if (typeof targetProp !== 'undefined') {
                window.open(hrefProp, targetProp);
              } else {
                window.location.href = hrefProp;
              }
            }
          }
        }
      });
    });
  };

  /**
   * Scroll to anchor in page
   *
   * offset: number to offset when scrolling to destination
   */
  self.scrollToAnchor = function(offset) {
    // on page load, check if hash in the url matches with an anchor on page
    // and scroll to it
    let newOffset,
      tabs = $('.tabs'),
      tabsHeight = 0,
      adminHeight = 0,
      header = $('.sticky-top'); // use whatever wrapper you need

    // check for fixed elements on top of site
    // to compensate offset of the anchor when scrolling
    if ( $('body').hasClass('toolbar-fixed') ) {
      adminHeight = $('#toolbar-bar').outerHeight();

      if (tabs.length) {
        tabsHeight = tabs.outerHeight();
      }
    }

    // only add offset if fixed header and/or value passed in function
    if (typeof offset == 'undefined') offset = 0;

    // function to calculate the offset, in case of fixed header or not
    const calcOffset = function() {
      if (header.css('position') === 'fixed') {
        offset = header.outerHeight() + offset + adminHeight + tabsHeight; // compensate for fixed header height

        // compare offset to height of header to see if it's smaller
        // must at least use the header height as offset or we'll get a gap
        newOffset = header.outerHeight();
        if (newOffset > offset) offset = newOffset;
      }
      else {
        // calculate offset for a normal page (no fixed header)
        offset = 15 + offset + adminHeight + tabsHeight; // compensate with bit of space above the element with the anchor
      }

      // need negative value for the scroll calculations
      offset = -(offset);

      return offset;
    };

    // get hash from page url
    const urlHash = window.location.hash;

    if ($(urlHash).length) {
      // recalculate offset if fixed header
      offset = calcOffset();

      // el, offset, speed, callback
      let scrollParams = {
        el: $(urlHash),
        offset: offset,
        speed: 1000
      }

      self.scrollTo(scrollParams);

      // set an active class
      const myAnchorLink = $( 'a[href$="' + urlHash + '"]' );
      myAnchorLink.addClass('js-active-anchor');
    }

    // when clicking an anchor, animate scroll to that anchor and add to history
    const anchors = once('js-once-scrollable-anchors', $('a[href*="#"]').not('a[href="#"]'));
    $(anchors).each(function() {
      // remove active classes on anchor links
      $(this).removeClass('active').removeClass('active-trail');

      // click anchor link and animate scroll to it
      $(this).on('click', function (e) {
        const path = this.href;

        // get ID/hash from url
        let id = e.target.href.substring(e.target.href.indexOf("#")+1),
          hash = '#' + id,
          target = $(hash);

        // recalculate offset if fixed header
        offset = calcOffset();

        if (target.length) {
          // set an active class
          $(this).addClass('js-active-anchor');

          // el, offset, speed, callback
          let scrollParams = {
            el: target,
            offset: offset,
            speed: 1000,
            callback: function () {

              // change url without refresh
              document.location.hash = hash;
            }
          }

          self.scrollTo(scrollParams);

          // If supported by the browser we can also update the URL
          if (window.history && window.history.pushState) {
            history.pushState("", document.title, hash);
          }

          // if no anchor with id matchin href
          // check for anchor with a name matching the href
        }
        else {
          const newTarget = $('a[name="' + id + '"]');

          if (newTarget.length) {
            // set an active class
            $(this).addClass('js-active-anchor');

            let scrollParams = {
              el: newTarget,
              offset: offset,
              speed: 1000,
              callback: function () {
                // change url without refresh
                document.location.hash = hash;
              }
            }

            // el, offset, speed, callback
            self.scrollTo(scrollParams);
          }
        }

        // the url, minus stuff after hash or parameters
        const currentUrl = window.location.href.split(/[?#]/)[0];
        // the path, minus stuff after hash or parameters
        const pathBase = path.split(/[?#]/)[0];

        // if path points to current page, prevent reload.
        // meaning, if the url's (stripped of hashes and parameters) match up,
        // we're on the same page and don't need a page reload
        // if (currentUrl.indexOf(pathBase) !== -1) {
        if (currentUrl.replace(/\/$/, "") === pathBase.replace(/\/$/, "")) {
          e.preventDefault();
        }
      });
    });

    // when going back/forward in history
    // make sure the events associated with the anchor animations are fired
    window.onpopstate = function(event) {
      $('a[href*="#"]').not('a[href="#"]').each(function() {
        const path = this.href;
        const Current = window.location.pathname;
        // get hash from page url
        const urlHash = window.location.hash;
        // get hash & ID from href
        const linkHash = path.substring(path.indexOf("#"));

        // recalculate offset if fixed header
        offset = calcOffset();

        if ($(linkHash).length) {
          // if hash of current path matches hash of the url
          // scroll to it
          if (urlHash === linkHash) {
            $(this).addClass('js-active-anchor');

            let scrollParams = {
              el: $(linkHash),
              offset: offset,
              speed: 1000
            };

            // el, offset, speed, callback
            self.scrollTo(scrollParams);
          }
        }
      });
    };
  };
})(jQuery, Drupal, window, document, once);

