<?php
namespace PuyoSim\Entity;

class Chain
{
    /**
     * @var int The primary key ID. This variable is set when inserting into the database.
     */
    public $id;

    /**
     * @var string The URL. This variable is set when inserting into the database.
     */
    public $url;

    /**
     * @var string Title of the chain.
     */
    public $title;

    /**
     * @var string String representation of the chain.
     */
    public $chain;

    /**
     * @var int Width of the board associated with this chain.
     */
    public $width;

    /**
     * @var int Height of the board associated with this chain.
     */
    public $height;

    /**
     * @var int Number of hidden rows above the board associated with this chain.
     */
    public $hidden_rows;

    /**
     * @var int Number of connected Puyos needed to make a chain.
     */
    public $pop_limit;

    /**
     * @var string The hash. This variable is set when inserting into the database.
     */
    public $hash;

    public $created_at;

    public $updated_at;
}
