<?php

namespace Drupal\sa\Plugin\Field\FieldFormatter;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\user\EntityOwnerInterface;

/**
 * Plugin implementation of the 'author_render' formatter.
 *
 * @FieldFormatter(
 *   id = "author_render",
 *   label = @Translation("Author render"),
 *   field_types = {
 *     "boolean"
 *   }
 * )
 */
class AuthorRender extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];

    $summary[] = t("Output the parent's author when the field value evaluates to true");
    // Implement settings summary.
    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];

    $renderer = \Drupal::service('renderer');

    foreach ($items as $delta => $item) {
      if ($item->value != TRUE) {
        continue;
      }
      $entity = $items->getEntity();
      /** @var \Drupal\Core\Entity\ContentEntityInterface $entity */
      $entity = $this->getHighestLevelParentEntity($entity);

      if (!$entity instanceof EntityOwnerInterface) {
        continue;
      }

      // Why the fuck does this not work? Well, until it does just output the
      // value
      // $build = $entity->get('uid')->view('default');.
      $build = [
        '#markup' => $entity->getOwner()->label(),
      ];

      $renderer->addCacheableDependency($build, $entity);
      $renderer->addCacheableDependency($build, $items->getEntity());
      $renderer->addCacheableDependency($build, $entity->getOwner());

      $elements[0] = $build;
      return $elements;
    }

    return $elements;
  }

  /**
   * Get highest parent.
   *
   * Recursively fetches the parent entity until top is reached and then
   * returns that one.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   Entity.
   *
   * @return \Drupal\Core\Entity\EntityInterface
   *   Parent.
   */
  protected function getHighestLevelParentEntity(EntityInterface $entity) {
    if (method_exists($entity, 'getParentEntity')) {
      $parent = $entity->getParentEntity();
      if ($parent) {
        return $this->getHighestLevelParentEntity($parent);
      }

      // Empty parent, assume this level is fine.
      return $entity;
    }

    // Already highest level as far as we can tell.
    return $entity;
  }

}
