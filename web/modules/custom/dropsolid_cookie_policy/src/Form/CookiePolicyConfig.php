<?php

namespace Drupal\dropsolid_cookie_policy\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityTypeManager;

/**
 * Class CookiePolicyConfig.
 *
 * @package Drupal\dropsolid_cookie_policy\Form
 */
class CookiePolicyConfig extends ConfigFormBase {

  /**
   * Drupal\Core\Entity\EntityTypeManager definition.
   *
   * @var \Drupal\Core\Entity\EntityTypeManager
   */
  protected $entityTypeManager;

  /**
   * CookiePolicyConfig constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   Config factory service.
   * @param \Drupal\Core\Entity\EntityTypeManager $entity_type_manager
   *   Entity type manager.
   */
  public function __construct(
    ConfigFactoryInterface $config_factory,
    EntityTypeManager $entity_type_manager
  ) {
    parent::__construct($config_factory);
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'dropsolid_cookie_policy.cookiepolicyconfig',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'cookie_policy_config';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('dropsolid_cookie_policy.cookiepolicyconfig');
    $form['more_info_page'] = [
      '#type' => 'entity_autocomplete',
      '#title' => $this->t('More info page'),
      '#description' => $this->t('Choose the page containing the legal disclaimer information. There will be a link to this page on the cookie popup'),
      '#default_value' => !empty($config->get('more_info_page')) ? $this->entityTypeManager->getStorage('node')
        ->load($config->get('more_info_page')) : NULL,
      '#target_type' => 'node',
      '#selection_settings' => [
        'target_bundles' => ['page'],
      ],
    ];
    $form['company_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Company name'),
      '#description' => $this->t('"Example: [company_name] uses cookies to improve your online experience"'),
      '#maxlength' => 64,
      '#size' => 64,
      '#default_value' => !empty($config->get('company_name')) ? $config->get('company_name') : $this->config('system.site')
        ->get('name'),
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('dropsolid_cookie_policy.cookiepolicyconfig')
      ->set('more_info_page', $form_state->getValue('more_info_page'))
      ->set('company_name', $form_state->getValue('company_name'))
      ->save();
  }

}
