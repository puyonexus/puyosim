<?php
namespace PuyoSim\Controller;

use GifCreator\AnimGif;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use PuyoSim\Common\ImageUtils;
use PuyoSim\Common\StringUtils;
use PuyoSim\Exception\InvalidChainException;
use PuyoSim\Repository\ChainRepository;
use PuyoSim\Service\LegacyChainParser;
use PuyoSim\Simulator\Board;
use PuyoSim\Simulator\Simulation;
use Slim\Views\PhpRenderer;

class HomeController
{
    protected $view;
    protected $chainRepository;
    protected $siteSettings;

    public function __construct(
        PhpRenderer $view,
        ChainRepository $chainRepository,
        array $siteSettings)
    {
        $this->view = $view;
        $this->chainRepository = $chainRepository;
        $this->siteSettings = $siteSettings;
    }

    public function index(Request $request, Response $response)
    {
        $baseUrl = $request->getUri()->getBaseUrl();

        // Check to see if we are handling a legacy chain format
        $isLegacy = false;

        // Type 1 - ??(<width>,<height>,<hiddenRows>)chain
        $queryString = $request->getUri()->getQuery();
        if (preg_match('/\?(?:\((?<width>\d+),(?<height>\d+)(?:,(?<hiddenRows>\d+))?\))?(?<chain>\w+)/', $queryString, $matches) === 1)
        {
            $isLegacy = true;

            try
            {
                $chainParser = new LegacyChainParser($matches['chain'], $matches['width'], $matches['height'], $matches['hiddenRows']);
            }
            catch (InvalidChainException $e)
            {
                return $response->withStatus(400);
            }
        }

        // Type 2 - ?w=<width>&h=<height>&hr=<hiddenRows>&chain=<chain>
        $chain = $request->getQueryParam('chain');
        if ($chain !== null)
        {
            $isLegacy = true;

            try
            {
                $chainParser = new LegacyChainParser($chain, $request->getQueryParam('w'), $request->getQueryParam('h'), $request->getQueryParam('hr'));
            }
            catch (InvalidChainException $e)
            {
                return $response->withStatus(400);
            }
        }

        // If this was a legacy chain, process it
        if ($isLegacy)
        {
            $queryString = $chainParser->getQueryString();
            $pageUrl = "{$baseUrl}/?{$queryString}";

            // Set the view arguments
            // basePath, assetsPath, and pageUrl are set by viewResponse.
            $viewArgs = [
                'pageUrl' => $pageUrl,
                'embedImage' => "{$baseUrl}/chainimage.php?{$queryString}",
                'ogEmbedImage' => "{$baseUrl}/chainimage.php?{$queryString}&for=og",
                'oembedUrl' => "{$baseUrl}/api/oembed?url=" . rawurlencode($pageUrl),
                'chainData' => [
                    'legacyQueryString' => $queryString,
                ],
            ];

            return $this->chainResponse($request, $response, $viewArgs, $chainParser->getChain(), $chainParser->getWidth(), $chainParser->getHeight(), $chainParser->getHiddenRows());
        }

        $basePath = $request->getUri()->getBasePath();

        // This is not a legacy chain, so just show the page with an empty chain
        return $this->view->render($response, 'home/index.php', [
            'site' => $this->siteSettings,
            'basePath' => $basePath,
            'assetsPath' => "{$basePath}/assets",
            'pageUrl' => "{$baseUrl}/",
            'embedImage' => "{$baseUrl}/assets/images/logo.png",
            'ogEmbedImage' => "{$baseUrl}/assets/images/logo.png",
        ]);
    }

    public function chain(Request $request, Response $response, string $id)
    {
        $entity = $this->chainRepository->findByUrl($id);
        if ($entity === null)
        {
            return $response->withStatus(404);
        }

        $baseUrl = $request->getUri()->getBaseUrl();
        $pageUrl = "{$baseUrl}/chain/{$entity->url}";

        // Set the view arguments
        // basePath and assetsPath are set by viewResponse.
        $viewArgs = [
            'pageUrl' => $pageUrl,
            'embedImage' => "{$baseUrl}/image/{$entity->url}.png",
            'ogEmbedImage' => "{$baseUrl}/image/{$entity->url}.png?for=og",
            'oEmbedUrl' => "{$baseUrl}/api/oembed?url=" . rawurlencode($pageUrl),
            'chainData' => [
                'id' => $entity->url,
            ],
        ];

        if ($entity->title !== null)
        {
            $viewArgs['title'] = $entity->title;
            $viewArgs['chainData']['title'] = $entity->title;
        }

        return $this->chainResponse($request, $response, $viewArgs, $entity->chain, $entity->width, $entity->height, $entity->hidden_rows, $entity->pop_limit);
    }

    public function image(Request $request, Response $response, string $id)
    {
        $entity = $this->chainRepository->findByUrl($id);
        if ($entity === null)
        {
            return $response->withStatus(404);
        }

        return $this->imageResponse($request, $response, $entity->chain, $entity->width, $entity->height, $entity->hidden_rows);
    }

    public function animatedImage(Request $request, Response $response, string $id)
    {
        $entity = $this->chainRepository->findByUrl($id);
        if ($entity === null)
        {
            return $response->withStatus(404);
        }

        return $this->animatedImageResponse($request, $response, $entity->chain, $entity->width, $entity->height, $entity->hidden_rows, $entity->pop_limit);
    }

    public function legacyImage(Request $request, Response $response)
    {
        $chain = $request->getQueryParam('chain');
        if ($chain === null)
        {
            return $response->withStatus(400);
        }

        // Check to see if the width, height, and hidden rows are embedded in the chain parameter
        if (preg_match('/(?:\((?<width>\d+),(?<height>\d+)(?:,(?<hiddenRows>\d+))?\))(?<chain>\w*)/', $chain, $matches) === 1)
        {
            try
            {
                $chainParser = new LegacyChainParser($matches['chain'], $matches['width'], $matches['height'], $matches['hiddenRows']);
            }
            catch (InvalidChainException $e)
            {
                return $response->withStatus(400);
            }
        }
        else
        {
            try
            {
                $chainParser = new LegacyChainParser($chain, $request->getQueryParam('w'), $request->getQueryParam('h'), $request->getQueryParam('hr'));
            }
            catch (InvalidChainException $e)
            {
                return $response->withStatus(400);
            }
        }

        return $this->imageResponse($request, $response, $chainParser->getChain(), $chainParser->getWidth(), $chainParser->getHeight(), $chainParser->getHiddenRows());
    }

    private function chainResponse(Request $request, Response $response, array $viewArgs, string $chain, int $width = 6, int $height = 12, int $hiddenRows = 1, int $popLimit = 4)
    {
        $basePath = $request->getUri()->getBasePath();

        // Merge the provided view arguments with the view arguments we should be using
        // Override arguments with ones passed by viewArgs.
        $viewArgs = array_replace_recursive([
            'site' => $this->siteSettings,
            'basePath' => $basePath,
            'assetsPath' => "{$basePath}/assets",
            'chainData' => [
                'chain' => $chain,
                'width' => $width,
                'height' => $height,
                'hiddenRows' => $hiddenRows,
                'popLimit' => $popLimit,
            ]
        ], $viewArgs);

        return $this->view->render($response, 'home/index.php', $viewArgs);
    }

    private function imageResponse(Request $request, Response $response, string $chain, int $width = 6, int $height = 12, int $hiddenRows = 1)
    {
        $hash = substr(hash('sha256', "png,{$chain},{$width},{$height},{$hiddenRows}"), 0, 32);
        $cacheDir = __DIR__ . '/../../temp/cache/images/' . substr($hash, 0, 1) . '/' . substr($hash, 0, 2);

        // Set the response headers
        $response = $response
            ->withHeader('Content-Disposition', 'inline')
            ->withHeader('Content-Type', 'image/png');

        // Load the image from the cache, if it exists
        // Otherwise, generate the image and save it to the cache
        if (file_exists($cacheDir . '/' . $hash))
        {
            $outputImage = file_get_contents($cacheDir . '/' . $hash);
        }
        else
        {
            $board = new Board($chain, $width, $height, $hiddenRows);
            $image = $board->toImage();
            imagetruecolortopalette($image, false, 256);

            $outputImage = ImageUtils::toPng($image);

            // Save the image to the cache
            if (!is_dir($cacheDir))
            {
                mkdir($cacheDir, 0777, true);
            }

            file_put_contents($cacheDir . '/' . $hash, $outputImage);
        }

        // Get the for parameter and the user agent
        $imageIsFor = $request->getQueryParam('for');
        $userAgent = $request->getHeaderLine('User-Agent');

        // If Facebook is requesting the OpenGraph image, then resize it to at least 200x200.
        if ($imageIsFor === 'og' && strpos($userAgent, 'facebookexternalhit/') === 0)
        {
            $outputImage = ImageUtils::toPng(ImageUtils::enlarge(imagecreatefromstring($outputImage), 200, 200));
        }

        $response->getBody()->write($outputImage);
        return $response;
    }

    private function animatedImageResponse(Request $request, Response $response, string $chain, int $width = 6, int $height = 12, int $hiddenRows = 1, int $popLimit = 4)
    {
        $hash = substr(hash('sha256', "gif,{$chain},{$width},{$height},{$hiddenRows},{$popLimit}"), 32);
        $cacheDir = __DIR__ . '/../../temp/cache/images/' . substr($hash, 0, 1) . '/' . substr($hash, 0, 2);

        // Set the response headers
        $response = $response
            ->withHeader('Content-Disposition', 'inline')
            ->withHeader('Content-Type', 'image/gif');

        // Load the image from the cache, if it exists
        if (file_exists($cacheDir . '/' . $hash))
        {
            $outputImage = file_get_contents($cacheDir . '/' . $hash);

            $response->getBody()->write($outputImage);
            return $response;
        }

        // Animated images can consume a bit of memory, so we'll increase the memory limit
        ini_set('memory_limit', '256M');

        $frames = [];
        $durations = [50];

        $board = new Board($chain, $width, $height, $hiddenRows);
        $simulation = new Simulation($board, $popLimit);

        $image = $board->toImage();
        imagetruecolortopalette($image, false, 256);
        $frames[] = $image;

        if ($simulation->performAction())
        {
            do
            {
                $image = $board->toImage();
                imagetruecolortopalette($image, false, 256);
                $frames[] = $image;
            }
            while ($isActionPerformed = $simulation->performAction());

            $image = $board->toImage();
            imagetruecolortopalette($image, false, 256);
            $frames[] = $image;
        }

        // AnimGif needs at least 2 frames to work.
        // If we have less than 2 frames, then we will manually create a gif ourselves based on the first frame.
        if (count($frames) > 1)
        {
            $anim = new AnimGif();
            $anim->create($frames, $durations);
            $outputImage = $anim->get();
        }
        else
        {
            $outputImage = ImageUtils::toGif($frames[0]);
        }

        // Save the image to the cache
        if (!is_dir($cacheDir))
        {
            mkdir($cacheDir, 0777, true);
        }

        file_put_contents($cacheDir . '/' . $hash, $outputImage);

        $response->getBody()->write($outputImage);
        return $response;
    }
}