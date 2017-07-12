<?php
use PuyoSim\Controller\ApiController;
use PuyoSim\Controller\HomeController;
use PuyoSim\PDO\Database;
use PuyoSim\Repository\ChainRepository;
use Slim\Handlers\Strategies\RequestResponseArgs;
use Slim\Views\PhpRenderer;

$container = $app->getContainer();

// View renderer
$container['view'] = function ($c) {
    $settings = $c->get('settings')['views'];
    return new PhpRenderer($settings['path']);
};

// Allows arguments to be passed to the route action as seperate parameters
$container['foundHandler'] = function () {
    return new RequestResponseArgs();
};

$container['database'] = function ($c) {
    $settings = $c->get('settings')['database'];
    return new Database($settings['dsn'], $settings['username'], $settings['password'], [], $settings['tablePrefix']);
};

$container[HomeController::class] = function ($c) {
    $view = $c->get('view');
    $chainRepository = $c->get(ChainRepository::class);
    $siteSettings = $c->get('settings')['site'];
    return new HomeController($view, $chainRepository, $siteSettings);
};

$container[ApiController::class] = function ($c) {
    $chainRepository = $c->get(ChainRepository::class);
    $siteSettings = $c->get('settings')['site'];
    return new ApiController($chainRepository, $siteSettings);
};

$container[ChainRepository::class] = function ($c) {
    $database = $c->get('database');
    return new ChainRepository($database);
};