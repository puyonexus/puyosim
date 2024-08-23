<?php
namespace PuyoSim\Http;

use Psr\Http\Message\ResponseInterface as Response;

class JsonResponse
{
    /**
     * Creates a JSON success response.
     *
     * @param Response $response The response object
     * @param mixed $response The response data
     *
     * @return Response A JSON response
     */
    public static function success(Response $response, $data): Response
    {
        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => $data,
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * Creates a JSON error response.
     *
     * @param Response $response The response object
     * @param int $errorCode The HTTP error code
     * @param string $message The error message
     *
     * @return Response A JSON response
     */
    public static function error(Response $response, int $errorCode, string $message = null): Response
    {
        $response->getBody()->write(json_encode([
            'success' => false,
            'message' => $message,
        ]));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($errorCode);
    }
}
