<?php
declare(strict_types=1);

use DI\ContainerBuilder;
use Psr\Container\ContainerInterface;
use PuyoSim\Controller\ApiController;
use PuyoSim\Controller\HomeController;
use FaaPz\PDO\Database;
use PuyoSim\Repository\ChainRepository;
use Slim\Handlers\Strategies\RequestResponseArgs;
use Slim\Views\PhpRenderer;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        'view' => function (ContainerInterface $c) {
            $settings = $c->get('settings')['views'];
            return new PhpRenderer($settings['path']);
        },

        // Allows arguments to be passed to the route action as seperate parameters
        'foundHandler' => function () {
            return new RequestResponseArgs();
        },

        'database' => function (ContainerInterface $c) {
            $db = $c->get('settings')['database'];
            return new Database($db['dsn'], $db['username'], $db['password']);
        },

        HomeController::class => function (ContainerInterface $c) {
            $view = $c->get('view');
            $chainRepository = $c->get(ChainRepository::class);
            $siteSettings = $c->get('settings')['site'];
            return new HomeController($view, $chainRepository, $siteSettings);
        },

        ApiController::class => function (ContainerInterface $c) {
            $chainRepository = $c->get(ChainRepository::class);
            $siteSettings = $c->get('settings')['site'];
            return new ApiController($chainRepository, $siteSettings);
        },

        ChainRepository::class => function (ContainerInterface $c) {
            $database = $c->get('database');
            return new ChainRepository($database);
        },
    ]);
};
