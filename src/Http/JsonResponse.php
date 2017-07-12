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
        return $response->withJson([
            'success' => true,
            'data' => $data,
        ]);
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
        return $response->withJson([
            'success' => false,
            'message' => $message,
        ], $errorCode);
    }
}