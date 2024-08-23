<?php
declare(strict_types=1);

use DI\ContainerBuilder;
use Monolog\Logger;

return function (ContainerBuilder $containerBuilder) {
    $settings = [
        'settings' => [
            // Site settings
            'site' => [
                'name' => 'Puyo Nexus Chain Simulator',
                'description' => 'Create and share Puyo Puyo chains.',
                'titledChainDescription' => 'Create and share Puyo Puyo chains with the Puyo Nexus Chain Simulator.',
                'twitter' => '@puyonexus',
                'baseUrl' => 'http://localhost:8080',
                'basePath' => '',
            ],

            // View settings for PhpRenderer
            'views' => [
                'path' => __DIR__ . '/../views/',
            ],

            // Router cache
            'routerCacheFile' => __DIR__ . '/../temp/cache/routes.php',

            // Database settings
            'database' => [
                'dsn' => '',
                'username' => '',
                'password' => '',
            ],
        ]
    ];

    // Load local settings and merge them into $settings
    if (file_exists(__DIR__ . '/localsettings.php'))
    {
        $localSettings = require __DIR__ . '/localsettings.php';
        $settings = array_replace_recursive($settings, $localSettings);
    }

    $containerBuilder->addDefinitions($settings);
};
