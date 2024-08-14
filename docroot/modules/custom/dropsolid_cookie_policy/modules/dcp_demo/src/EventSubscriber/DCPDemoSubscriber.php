<?php

namespace Drupal\dcp_demo\EventSubscriber;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\migrate\Event\MigrateEvents;
use Drupal\migrate\Event\MigratePostRowSaveEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Class DropsolidCookiePolicySubscriber.
 */
class DCPDemoSubscriber implements EventSubscriberInterface {

  /**
   * The config factory service.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * DropsolidCookiePolicySubscriber constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory service.
   */
  public function __construct(ConfigFactoryInterface $config_factory) {
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[MigrateEvents::POST_ROW_SAVE] = ['onMigratePostRowSaveEvent'];

    return $events;
  }

  /**
   * Event handler callback.
   *
   * This does assume there's only one node being migrated. If there are
   * multiple then the last one will stick, as this is executed for every row.
   *
   * @param \Drupal\migrate\Event\MigratePostRowSaveEvent $event
   *   The event to work with.
   */
  public function onMigratePostRowSaveEvent(MigratePostRowSaveEvent $event) {
    $migration = $event->getMigration();
    if ($migration->id() === 'dcp_page') {
      // Update cookie policy settings, set new page and company name.
      $vals = $event->getDestinationIdValues();
      $nid = reset($vals);
      $config = $this->configFactory->getEditable('dropsolid_cookie_policy.cookiepolicyconfig');
      $config->set('more_info_page', $nid);
      $config->set('company_name', $this->configFactory->get('system.site')
        ->get('name'));
      $config->save();
    }
  }

}
