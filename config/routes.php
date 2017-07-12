<?php
use PuyoSim\Controller\ApiController;
use PuyoSim\Controller\HomeController;

// / (Root)
$app->group('', function () {
    $this->get('/', HomeController::class . ':index');
    $this->get('/chain/{id:[a-zA-Z0-9]+}', HomeController::class . ':chain');
    $this->get('/image/{id:[a-zA-Z0-9]+}.png', HomeController::class . ':image');
    $this->get('/image/{id:[a-zA-Z0-9]+}.gif', HomeController::class . ':animatedImage');
    $this->get('/chainimage.php', HomeController::class . ':legacyImage');
});

// /api
$app->group('/api', function () {
    $this->get('/info/{id:[a-zA-Z0-9]+}', ApiController::class . ':info');
    $this->post('/save', ApiController::class . ':save');
    $this->get('/oembed', ApiController::class . ':oembed');
});