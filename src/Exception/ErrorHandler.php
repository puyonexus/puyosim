<?php
namespace PuyoSim\Exception;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpMethodNotAllowedException;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpNotImplementedException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Factory\AppFactory;
use Slim\Interfaces\ErrorHandlerInterface;
use Slim\Views\PhpRenderer;
use Throwable;

class ErrorHandler implements ErrorHandlerInterface
{
    protected ResponseFactoryInterface $responseFactory;
    protected $view;
    protected $siteSettings;

    public function __construct(
        PhpRenderer $view,
        array $siteSettings)
    {
        $this->responseFactory = AppFactory::determineResponseFactory();
        $this->view = $view;
        $this->siteSettings = $siteSettings;
    }

    public function __invoke(
        Request $request,
        Throwable $exception,
        bool $displayErrorDetails,
        bool $logErrors,
        bool $logErrorDetails
    ): ResponseInterface {
        $statusCode = 500;
        $description = 'An internal error has occurred while processing your request.';

        if ($exception instanceof HttpException) {
            $statusCode = $exception->getCode();
            $description = $exception->getMessage();
        }

        $response = $this->responseFactory->createResponse($statusCode);
        if ($statusCode == 404) {
            return $this->view->render($response, '404.php', []);
        } else {
            return $this->view->render($response, '500.php', [
                'description' => $description
            ]);
        }
    }
}
