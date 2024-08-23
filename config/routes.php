<?php
declare(strict_types=1);

use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use PuyoSim\Controller\ApiController;
use PuyoSim\Controller\HomeController;
use PuyoSim\Exception\ErrorHandler;

return function (App $app) {
    $app->addRoutingMiddleware();
    $errorMiddleware = $app->addErrorMiddleware(PHP_SAPI == 'cli-server', true, true);
    $errorHandler = $errorMiddleware->getDefaultErrorHandler();
    $errorMiddleware->setDefaultErrorHandler(ErrorHandler::class);

    // / (Root)
    $app->group('', function (RouteCollectorProxy $group) {
        $group->get('/', HomeController::class . ':index');
        $group->get('/chain/{id:[a-zA-Z0-9]+}', HomeController::class . ':chain');
        $group->get('/image/{id:[a-zA-Z0-9]+}.png', HomeController::class . ':image');
        $group->get('/image/{id:[a-zA-Z0-9]+}.gif', HomeController::class . ':animatedImage');
        $group->get('/chainimage.php', HomeController::class . ':legacyImage');
    });

    // /api
    $app->group('/api', function (RouteCollectorProxy $group) {
        $group->get('/info/{id:[a-zA-Z0-9]+}', ApiController::class . ':info');
        $group->post('/save', ApiController::class . ':save');
        $group->get('/oembed', ApiController::class . ':oembed');
    });
};
