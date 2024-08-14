<?php

namespace Drupal\sa\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;
use Drupal\Core\Template\Attribute;

class BemExtension extends AbstractExtension {
  public function getName() {
    return 'sa_bem';
  }

  /**
   * {@inheritDoc}
   */
  public function getFunctions() {
    return [
      new TwigFunction('bem', [$this, 'bem']),
    ];
  }

  /**
   * Block Element Modifier.
   *
   * @param string $block
   *   Block.
   * @param string|null $element
   * *   Element.
   * @param array $modifiers
   *   Modifiers.
   * @param mixed $extra
   *   Extra.
   *
   * @return \Drupal\Core\Template\Attribute|string
   *   Attributes.
   */
  public function bem(string $block = '', string|null $element = '', array $modifiers = [], mixed $extra = []) {
    $classes = [];

    // If using a blockname to override default class.
    if ($block) {
      // Set blockname class.

      if ($element) {
        $classes[] = $block . '__' . $element;
      } else {
        $classes[] = $block;
      }

      // Set blockname--modifier classes for each modifier.
      if (isset($modifiers) && is_array($modifiers)) {
        foreach ($modifiers as $modifier) {
          if ($element) {
            $classes[] = $block . '__' . $element . '--' . $modifier;
          } else {
            $classes[] = $block . '--' . $modifier;
          }

        };
      }
    }
    // If not overriding base class.
    else {
      // Set base class.
      $classes[] = $element;
      // Set base--modifier class for each modifier.
      if (isset($modifiers) && is_array($modifiers)) {
        foreach ($modifiers as $modifier) {
          $classes[] = $element . '--' . $modifier;
        };
      }
    }

    // If extra non-BEM classes are added.
    if (isset($extra) && is_array($extra)) {
      foreach ($extra as $extra_class) {
        $classes[] = $extra_class;
      };
    }

    $attributes = new Attribute();
    if (!empty($classes)) {
      $attributes->setAttribute('class', $classes);
    }
    return $attributes;
  }
}
