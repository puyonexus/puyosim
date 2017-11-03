<?php
namespace PuyoSim\Service;

use PuyoSim\Exception\InvalidChainException;
use PuyoSim\Service\ChainParser;

class LegacyChainParser extends ChainParser
{
    protected $legacyChain;

    /**
     * Parses a legacy chain.
     *
     * @param string $chain A string representation of the chain
     * @param int $width The width of the board associated with the chain
     * @param int $height The height of the board associated with the chain
     * @param int $hiddenRows The number of hidden rows above the board associated with the chain
     * @param int $popLimit The pop limit
     *
     * @throws InvalidChainException if the chain is not valid.
     */
    public function __construct(string $chain, $width = 6, $height = 12, $hiddenRows = 1)
    {
        // Validate the chain
        if (preg_match('/[^012345678ABC]/', $chain) !== 0)
        {
            throw new InvalidChainException('The chain contains invalid characters.');
        }

        // Convert the legacy chain to the new chain format
        // We'll directly set the chain property
        $oldChars = '0475681BCA32';

        $convertedChain = '';
        foreach (str_split($chain) as $char)
        {
            $index = strpos($oldChars, $char);
            $convertedChain .= $index !== false
                ? base_convert($index, 10, 36)
                : '0';
        }

        // Continue with the parent's constructor
        parent::__construct($convertedChain, $width, $height, $hiddenRows);

        // Set class properties
        $this->legacyChain = $chain;
    }

    /**
     * Gets the legacy chain.
     *
     * @return string The legacy chain
     */
    public function getLegacyChain(): string
    {
        return $this->legacyChain;
    }

    /**
     * Gets a query string representation of the chain.
     * The query string will be in the format of w=<width>&h=<height>&hr=<hiddenRows>&chain=<chain>.
     * The w, h, and/or hr parameters will not be present if they are set to their default value.
     *
     * @return string The query string
     */
    public function getQueryString(): string
    {
        $parameters = [
            'chain' => $this->legacyChain,
        ];

        if ($this->width !== 6)
        {
            $parameters['w'] = $this->width;
        }
        if ($this->height !== 12)
        {
            $parameters['h'] = $this->height;
        }
        if ($this->hiddenRows !== 1)
        {
            $parameters['hr'] = $this->hiddenRows;
        }

        return http_build_query($parameters);
    }
}