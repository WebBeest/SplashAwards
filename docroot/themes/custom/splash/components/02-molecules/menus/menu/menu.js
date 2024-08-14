(function ($, Drupal, window, document, once) {
  "use strict";

  if (typeof window.splashUI == 'undefined') { window.splashUI = {}; }

  const self = window.splashUI;

  // Mobile menu.
  Drupal.behaviors.splashUIMobileMenu = {
    attach: function (context, settings) {
      const navWrapper = $('.wrapper--navigation', context),
        hamburger = navWrapper.find('.navigation__toggle-expand', context);
      // Mobile menu
      if (hamburger.length && navWrapper.length) self.mobileMenu(hamburger, navWrapper);
    }
  };

  self.mobileMenu = function(trigger, wrapper) {
    // open/close wrapper
    const mobilemenu = once('js-once-mobilemenu', trigger);
    mobilemenu.forEach(function(item) {

      $(item).click(function(e) {
        // check for screen size bigger than phone
        if(self.screen === 'xs'/* || self.screen == 'sm'*/) {
          // add classes (css handles the animation & open/close)
          wrapper.toggleClass('js-open');
        }

        e.preventDefault();
      })
    });

    // remove the close class when switching to bigger screen
    // we don't need it there
    $(window).on('resize', function() {
      if(self.screen !== 'xs'/* && self.screen != 'sm'*/) {
        if (wrapper.hasClass('js-open')) {
          wrapper.removeClass('js-open');
        }
      }
    });
  };

  // Dropdown menu.
  Drupal.behaviors.splashUIDropdown = {
    attach: function (context, settings) {

      const navWrapper = $('.wrapper--navigation', context),
        mainNav = $('.nav--main, .nav--secondary-navigation', context);

      // Dropdown menu for navigation
      // parameters:
      // 1: navigation wrapper
      // 2: 'click' or 'hover' to open the dropdowns
      // 3: do we need a seperate icon as a trigger?
      //    If not, the highest level link itself is blocked on touch
      //    because otherwise it would click/touch through instead of opening the submenu
      if (mainNav.length) {
        const navParams = {
          nav: mainNav,
          interaction: 'hover',
          hasIcon: true
        };
        self.dropdownMenu(navParams);
      }

    }
  };

  /**
   * Open new levels op menu
   *
   * parameters:
   * nav: navigation wrapper
   * interaction: 'click' or 'hover' to open the dropdowns
   * icon: do we need a seperate icon as a trigger?
   *       If not, the link itself is blocked on touch
   *       So set to true if using first-level links
   * megamenu: boolean, fold out all submenus at once
   *
   */
  self.dropdownMenu = function(params) {
    const dropdown = once('js-once-dropdown', params.nav);
    dropdown.forEach(function(element) {
      let nav = $(element),
        interaction = params.interaction,
        hasIcon = params.hasIcon,
        menu =  nav.children('ul'),
        firstLevel = menu.children('li'),
        sum = 0;

      // find the first level children of an menu
      const firstLevelItems = once('js-once-dropdown-item', firstLevel);
      firstLevelItems.forEach(function(firstLevelElement, index) {
        let item = $(firstLevelElement),
          itemLink = item.children('a, span'),
          icon = item.find('.expand-sub'),
          touchTrigger,
          target;

        // if any item has a submenu
        if (item.hasClass('has-sub')) {

          // if there's an icon needed for opening/closing
          // use that as touchTrigger
          if (typeof icon !== 'undefined' && icon.length) {
            // icon becomes touchTrigger
            touchTrigger = icon;
          } else {
            // if no icon, the menu item itself becomes the touchTrigger
            touchTrigger = item;
          }

          // touch detection for li only
          if (touchTrigger !== item || interaction == 'click') {
            item.on('touchstart', function() {
              self.touch = true;
            });

            item.on('touchend', function() {
              // end
              setTimeout(function() {
                self.touch = false; // reset bc we might be on a device that has mouse as well as touch capability
              }, 500); // time it until after a 'click' would have fired on mobile (>300ms)
            });
          }

          // touch event to open/close
          // includes touch detection
          if (itemLink.is('span')) {
            item.on('touchstart', function(e) {
              self.touchEvent(self, target, nav, params, item);
            });

          } else {
            touchTrigger.on('touchstart', function(e) {
              self.touchEvent(self, target, nav, params, item);
              e.preventDefault();
            });
          }

          // reset the touch variable afterwards
          touchTrigger.on('touchend', function(e) {
            // end
            setTimeout(function() {
              self.touch = false; // reset bc we might be on a device that has mouse as well as touch capability
            }, 500); // time it until after a 'click' would have fired on mobile (>300ms)

            e.preventDefault();
          });

          if (interaction === 'hover') {
            // open/close on hover
            // if not in touch modus
            item.on('mouseenter', function(e) {
              target = item;

              // if no touch triggered
              if (!self.touch) {
                self.navPrimaryOpen(target);
                e.preventDefault();
              }
            });

            // close for normal menu
            // if not megamenu or small screen,
            item.on('mouseleave', function(e) {
              target = item;
              self.navPrimaryClose(target);
              e.preventDefault();
            });
          } else {
            if (itemLink.is('span')) {
              item.on('click', function(e) {
                // if no megamenu or small screen
                if ((self.screen === 'xs' || self.screen === 'sm')) {
                  target = item;

                  // if no touch triggered
                  if (!self.touch) {
                    if (target.hasClass('js-open')) {
                      self.navPrimaryClose(target);
                    } else {
                      self.navPrimaryOpen(target);
                    }
                    e.preventDefault();
                  }
                }
              });
            } else {
              touchTrigger.on('click', function(e) {
                // if no megamenu or small screen
                if ((self.screen === 'xs' || self.screen === 'sm')) {
                  target = item;

                  // if no touch triggered
                  if (!self.touch) {
                    if (target.hasClass('js-open')) {
                      self.navPrimaryClose(target);
                    } else {
                      self.navPrimaryOpen(target);
                    }
                    e.preventDefault();
                  }
                }
              });
            }

            // click outside to close

            $(document).mouseup(function (e) {
              target = item;
              if (item.hasClass('expanded')) {
                if (target.hasClass('js-open')) {
                  // if the target of the click isn't the container...
                  // ... nor a descendant of the container
                  if (!item.is(e.target) && item.has(e.target).length === 0)
                  {
                    self.navPrimaryClose(target);
                  }
                }
              }
            });
          }
        }

      });

      // on window resize, reset the menu to closed state
      const updateLayout = function(e) {
        // reset on item
        firstLevel.each(function() {
          const firstLevel = $(this);
          self.navPrimaryClose(firstLevel);
        });
      };

      window.addEventListener('resize', updateLayout, false);
    });
  };

  self.touchEvent = function(self, target, nav, params, item) {
    self.touch = true;

    // if megamenu & wide enough screen,
    // we don't open the individual submenu, but all of them
    if (params.megamenu && (self.screen !== 'xs' && self.screen !== 'sm')) {
      target = nav;
    } else {
      target = item;
    }

    if (target.hasClass('js-open')) {
      self.navPrimaryClose(target);
    } else {
      self.navPrimaryOpen(target);
    }
  }

  self.navHeight = function(nav) {
    let items = nav.find('li.expanded'),
      height = 0;

    for (let i=0; i < items.length; ++i) {
      let iHeight = items.eq(i).find('ul').outerHeight(true);
      if (iHeight > height) {
        height += iHeight;
      }
    }

    return height;
  };

  self.navPrimaryOpen = function(target){
    target.addClass('js-open');
  };

  self.navPrimaryClose = function(target){
    target.removeClass('js-open');
  };
})(jQuery, Drupal, window, document, once);
