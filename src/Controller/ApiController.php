<?php
namespace PuyoSim\Controller;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use PuyoSim\Exception\InvalidChainException;
use PuyoSim\Http\JsonResponse;
use PuyoSim\Repository\ChainRepository;
use PuyoSim\Service\ChainParser;
use PuyoSim\Service\LegacyChainParser;
use PuyoSim\Simulator\Board;

class ApiController
{
    protected $chainRepository;
    protected $siteSettings;

    public function __construct(
        ChainRepository $chainRepository,
        array $siteSettings)
    {
        $this->chainRepository = $chainRepository;
        $this->siteSettings = $siteSettings;
    }

    public function info(Request $request, Response $response, string $id)
    {
        $entity = $this->chainRepository->findByUrl($id);
        if ($entity === null)
        {
            return JsonResponse::error($response, 404, 'The specified chain does not exist.');
        }

        return JsonResponse::success($response, [
            'id' => $entity->url,
            'title' => $entity->title,
            'chain' => $entity->chain,
            'width' => $entity->width,
            'height' => $entity->height,
            'hiddenRows' => $entity->hidden_rows,
            'popLimit' => $entity->pop_limit,
        ]);
    }

    public function save(Request $request, Response $response)
    {
        $body = $request->getParsedBody();

        // If a title was set, make sure it does not exceed 128 characters.
        if (isset($body['title']) && strlen($body['title']) > 128)
        {
            return JsonResponse::error($response, 400, 'The chain title cannot exceed 128 characters.');
        }

        // Parse the chain, or return an error if there was an issue with it.
        try
        {
            $chainParser = new ChainParser($body['chain'], $body['width'], $body['height'], $body['hiddenRows'], $body['popLimit']);
        }
        catch (InvalidChainException $e)
        {
            return JsonResponse::error($response, 400, $e.getMessage());
        }

        // Convert the ChainParser object to a Chain entity and set the chain title
        $entity = $chainParser->toEntity();
        if (isset($body['title']))
        {
            $title = trim($body['title']);
            $entity->title = strlen($title) !== 0
                ? $title
                : null;
        }
        $entity = $this->chainRepository->insert($entity);

        return JsonResponse::success($response, [
            'id' => $entity->url,
        ]);
    }

    public function oembed(Request $request, Response $response)
    {
        $baseUrl = $request->getUri()->getBaseUrl();

        $oembed = [
            'version' => '1.0',
            'type' => 'photo',
            'provider_name' => $this->siteSettings['name'],
            'provider_url' => $baseUrl . '/',
        ];

        // Get the response format, and make sure it's either json or xml.
        // If none was supplied, assume json.
        // If an invalid one was supplied, return a 501 Not Implemented error per the spec.
        $format = $request->getQueryParam('format', 'json');
        if ($format !== 'json' && $format !== 'xml')
        {
            return $response->withStatus(501);
        }

        // Make sure the beginning of the URL parameter that was passed matches the base URL
        // If it matches, then we can trim out the base url
        $url = $request->getQueryParam('url');
        if (strpos($url, $baseUrl) !== 0)
        {
            return $response->withStatus(404);
        }

        // Parse the URL and determine it's format
        $parsedUrl = parse_url(substr($url, strlen($baseUrl)));

        // Current format - /chain/id
        if (preg_match('/^\/chain\/(?<id>[a-zA-Z0-9]+)$/', $parsedUrl['path'], $matches) === 1)
        {
            $id = $matches['id'];
            $entity = $this->chainRepository->findByUrl($id);
            if ($entity === null)
            {
                return $response->withStatus(404);
            }

            // As images are a fixed size depending on the board size, we'll just generate the size manually
            $oembed['url'] = "{$baseUrl}/image/{$id}.png";
            $oembed['width'] = ($entity->width + 2) * Board::PUYO_SIZE_PX;
            $oembed['height'] = ($entity->height + $entity->hidden_rows + 1) * Board::PUYO_SIZE_PX;

            if ($entity->title !== null)
            {
                $oembed['title'] = $entity->title;
            }
        }

        // The URL may contain a legacy chain format
        else if (isset($parsedUrl['query']))
        {
            // Get the query string parameters
            parse_str($parsedUrl['query'], $queryParameters);

            // Type #1 - ??(<width>,<height>,<hiddenRows>)chain
            if (preg_match('/\?(?:\((?<width>\d+),(?<height>\d+)(?:,(?<hiddenRows>\d+))?\))?(?<chain>\w+)/', $parsedUrl['query'], $matches) === 1)
            {
                try
                {
                    $chainParser = new LegacyChainParser($matches['chain'], $matches['width'], $matches['height'], $matches['hiddenRows']);
                }
                catch (InvalidChainException $e)
                {
                    // The oEmbed specification dictates we should return a 404 Not Found error
                    // when the URL doesn't point to a valid resource
                    return $response->withStatus(404);
                }
            }

            // Type #2 - ?w=<width>&h=<height>&hr=<hiddenRows>&chain=<chain>
            else if (isset($queryParameters['chain']))
            {
                try
                {
                    $chainParser = new LegacyChainParser($queryParameters['chain'], $queryParameters['w'] ?? null, $queryParameters['h'] ?? null, $queryParameters['hr'] ?? null);
                }
                catch (InvalidChainException $e)
                {
                    // The oEmbed specification dictates we should return a 404 Not Found error
                    // when the URL doesn't point to a valid resource
                    return $response->withStatus(404);
                }
            }

            else
            {
                return $response->withStatus(404);
            }

            // As images are a fixed size depending on the board size, we'll just generate the size manually
            $queryString = $chainParser->getQueryString();
            $oembed['url'] = "{$baseUrl}/chainimage.php?{$queryString}";
            $oembed['width'] = ($chainParser->width + 2) * Board::PUYO_SIZE_PX;
            $oembed['height'] = ($chainParser->height + $chainParser->hiddenRows + 1) * Board::PUYO_SIZE_PX;
        }

        // If it's not in the current chain format and no query string was passed,
        // assume it's not a valid chain
        else
        {
            return $response->withStatus(404);
        }

        // If we want to return XML, then return XML data (obviously!)
        // Otherwise, return JSON data
        if ($format === 'xml')
        {
            $document = new \DOMDocument('1.0', 'utf-8');
            $root = $document->appendChild($document->createElement('oembed'));
            foreach ($oembed as $key => $value)
            {
                $root->appendChild($document->createElement($key, $value));
            }

            $response->getBody()->write($document->saveXML());

            return $response->withHeader('Content-Type', 'text/xml');
        }

        return $response->withJson($oembed);
    }
}