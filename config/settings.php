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
                'cacheDir' => __DIR__ . '/../../temp/cache',
            ],

            // View settings for PhpRenderer
            'views' => [
                'path' => __DIR__ . '/../views/',
            ],

            // Database settings
            'database' => [
                'dsn' => 'sqlite:' . __DIR__ . '/../db.sqlite3',
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
