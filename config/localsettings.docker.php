<?php
$localSettings = [
    'settings' => [
        'site' => [
            'name' => 'PuyoSimLocal',
            'description' => 'Create and share Puyo Puyo chains (Local)',
            'titledChainDescription' => 'Create and share Puyo Puyo chains with the Puyo Nexus Chain Simulator (Local)',
            'twitter' => '@EngPuyoDiscord',
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