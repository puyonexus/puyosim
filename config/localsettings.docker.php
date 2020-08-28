<?php
$localSettings = [
    'settings' => [
        'site' => [
            'name' => 'Puyo Nexus Chain Simulator (Local)',
            'description' => 'Create and share Puyo Puyo chains (Local)',
            'titledChainDescription' => 'Create and share Puyo Puyo chains with the Puyo Nexus Chain Simulator (Local)',
            'twitter' => '@puyonexus',
        ],

        'database' => [
            'dsn' => 'mysql:host=mysql;dbname=puyosim;charset=utf8',
            'username' => 'puyosim',
            'password' => 'puyosim',
            'tablePrefix' => '',
        ],

        'displayErrorDetails' => true,
    ]
];
return $localSettings;
?>