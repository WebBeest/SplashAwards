<?php

namespace Drupal\sa\Plugin\Block;

use Drupal\Component\Render\FormattableMarkup;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Link;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Render\RendererInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'CopyrightBlock' block.
 *
 * @Block(
 *  id = "sa_copyright_block",
 *  admin_label = @Translation("Copyright block"),
 * )
 */
class CopyrightBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * Drupal\Core\Config\ConfigFactoryInterface definition.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected ConfigFactoryInterface $configFactory;

  /**
   * Drupal\Core\Entity\EntityTypeManager definition.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * Drupal\Core\Render\RendererInterface definition.
   *
   * @var \Drupal\Core\Render\RendererInterface
   */
  protected RendererInterface $renderer;

  /**
   * CopyrightBlock constructor.
   *
   * @param array $configuration
   *   The configuration.
   * @param string $plugin_id
   *   The plugin ID.
   * @param string $plugin_definition
   *   The plugin definition.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   Config factory service.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   Entity type manager service.
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   Renderer service.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    ConfigFactoryInterface $config_factory,
    EntityTypeManagerInterface $entity_type_manager,
    RendererInterface $renderer
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->configFactory = $config_factory;
    $this->entityTypeManager = $entity_type_manager;
    $this->renderer = $renderer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('config.factory'),
      $container->get('entity_type.manager'),
      $container->get('renderer')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'terms_of_use' => NULL,
      'privacy_policy' => NULL,
      'company' => '',
    ] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['terms_of_use'] = [
      '#title' => $this->t('Terms of use'),
      '#description' => $this->t('Leave blank to not show a link to the terms of use'),
      '#weight' => 99,
      '#type' => 'entity_autocomplete',
      '#default_value' => !empty($this->configuration['terms_of_use']) ? $this->entityTypeManager->getStorage('node')
        ->load($this->configuration['terms_of_use']) : NULL,
      '#target_type' => 'node',
    ];
    $form['privacy_policy'] = [
      '#title' => $this->t('Privacy policy'),
      '#description' => $this->t('Leave blank to not show a link to the privacy policy'),
      '#weight' => 100,
      '#type' => 'entity_autocomplete',
      '#default_value' => !empty($this->configuration['privacy_policy']) ? $this->entityTypeManager->getStorage('node')
        ->load($this->configuration['privacy_policy']) : NULL,
      '#target_type' => 'node',
    ];
    $form['company'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Company name'),
      '#default_value' => $this->configuration['company'],
      '#weight' => 101,
      '#required' => TRUE,
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['terms_of_use'] = $form_state->getValue('terms_of_use');
    $this->configuration['privacy_policy'] = $form_state->getValue('privacy_policy');
    $this->configuration['company'] = $form_state->getValue('company');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];

    $build['#cache']['contexts'] = [
      'languages',
    ];

    $terms_of_use = '';
    if ($this->configuration['terms_of_use']) {
      /** @var \Drupal\node\NodeInterface $node */
      $node = $this->entityTypeManager->getStorage('node')
        ->load($this->configuration['terms_of_use']);
      if ($node) {
        $terms_of_use = ' - ' .
          Link::fromTextAndUrl($this->t('Terms of use'), $node->toUrl())
            ->toString();
        $this->renderer->addCacheableDependency($build, $node);
      }
    }
    $privacy_policy = '';
    if ($this->configuration['privacy_policy']) {
      /** @var \Drupal\node\NodeInterface $node */
      $node = $this->entityTypeManager->getStorage('node')
        ->load($this->configuration['privacy_policy']);
      if ($node) {
        $privacy_policy = ' - ' .
          Link::fromTextAndUrl($this->t('Privacy policy'), $node->toUrl())
            ->toString();
      }
      $this->renderer->addCacheableDependency($build, $node);
    }

    // @todo: theme function this shiz so it's easy for frontend to
    // do as they please
    $build['left'] = [
      '#markup' => $this->t('© @company @year@terms@privacy', [
        '@terms' => new FormattableMarkup($terms_of_use, []),
        '@privacy' => new FormattableMarkup($privacy_policy, []),
        '@company' => $this->configuration['company'],
        '@year' => date('Y'),
      ]),
    ];

    return $build;
  }

}
