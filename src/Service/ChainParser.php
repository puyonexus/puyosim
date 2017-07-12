<?php
namespace PuyoSim\Service;

use PuyoSim\Entity\Chain;
use PuyoSim\Exception\InvalidChainException;

class ChainParser
{
    protected $chain;
    protected $width;
    protected $height;
    protected $hiddenRows;
    protected $popLimit;

    /**
     * Parses a chain.
     *
     * @param string $chain A string representation of the chain
     * @param int $width The width of the board associated with the chain
     * @param int $height The height of the board associated with the chain
     * @param int $hiddenRows The number of hidden rows above the board associated with the chain
     * @param int $popLimit The pop limit
     *
     * @throws InvalidChainException if the chain is not valid
     */
    public function __construct(string $chain, $width = 6, $height = 12, $hiddenRows = 1, $popLimit = 4)
    {
        // Validate the chain
        if (preg_match('/[^0123456789AB]/', $chain) !== 0)
        {
            throw new InvalidChainException("The chain contains invalid characters.");
        }

        // Validate the width, height, and hidden rows.
        // If any of them are invalid or are not set, set them to their default values
        $width = filter_var($width, FILTER_VALIDATE_INT, [
            'options' => [
                'default' => 6,
                'min_range' => 3,
                'max_range' => 16,
            ],
        ]);
        $height = filter_var($height, FILTER_VALIDATE_INT, [
            'options' => [
                'default' => 12,
                'min_range' => 6,
                'max_range' => 26,
            ],
        ]);
        $hiddenRows = filter_var($hiddenRows, FILTER_VALIDATE_INT, [
            'options' => [
                'default' => 1,
                'min_range' => 1,
                'max_range' => 2,
            ],
        ]);
        $popLimit = filter_var($popLimit, FILTER_VALIDATE_INT, [
            'options' => [
                'default' => 4,
                'min_range' => 2,
                'max_range' => 6,
            ],
        ]);

        // Now that we know the width, height, and number of hidden rows, make sure the chain length isn't longer than the board size
        if (strlen($chain) > $width * ($height + $hiddenRows))
        {
            throw new InvalidChainException("The chain exceeds the amount of characters allowed for the specified board size.");
        }

        // Trim leading zeros from the chain
        // If this causes the chain to end up being an empty string, set the chain to contain one empty Puyo
        $chain = ltrim($chain, '0');
        if ($chain === '')
        {
            $chain = '0';
        }

        // Set class properties
        $this->chain = $chain;
        $this->width = $width;
        $this->height = $height;
        $this->hiddenRows = $hiddenRows;
        $this->popLimit = $popLimit;
    }

    /**
     * Gets the chain.
     *
     * @return string The chain
     */
    public function getChain(): string
    {
        return $this->chain;
    }

    /**
     * Gets the width of the board associated with the chain.
     *
     * @return int The width
     */
    public function getWidth(): int
    {
        return $this->width;
    }

    /**
     * Gets the height of the board associated with the chain.
     *
     * @return int The height
     */
    public function getHeight(): int
    {
        return $this->height;
    }

    /**
     * Gets the number of hidden rows above the board associated with the chain.
     *
     * @return int The number of hidden rows
     */
    public function getHiddenRows(): int
    {
        return $this->hiddenRows;
    }

    /**
     * Gets the pop limit.
     *
     * @return int The pop limit
     */
    public function getPopLimit(): int
    {
        return $this->popLimit;
    }

    /**
     * Gets an entity representation of the chain.
     *
     * @return Chain An entity representation
     */
    public function toEntity(): Chain
    {
        $entity = new Chain();
        $entity->chain = $this->chain;
        $entity->width = $this->width;
        $entity->height = $this->height;
        $entity->hidden_rows = $this->hiddenRows;
        $entity->pop_limit = $this->popLimit;

        return $entity;
    }
}