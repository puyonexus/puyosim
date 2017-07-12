<?php
namespace PuyoSim\Simulator;

use PuyoSim\Simulator\Puyo;
use PuyoSim\Simulator\PuyoFlags;

class Board
{
    const PUYO_SIZE_PX = 16;

    private $chain;
    private $width;
    private $height;
    private $hiddenRows;

    private $puyos;

    private $borderImage;
    private $puyoSkinImage;

    /**
     * Creates a new board.
     *
     * @param string $chain A string representation of the chain
     * @param int $width The board width
     * @param int $height The board height
     * @param int $hiddenRows The number of hidden rows at the top of the board
     */
    public function __construct(string $chain, int $width = 6, int $height = 12, int $hiddenRows = 1)
    {
        $this->width = $width;
        $this->height = $height;
        $this->hiddenRows = $hiddenRows;

        $this->puyos = [];

        $i = ($width * ($height + $hiddenRows)) - 1;
        $strPos = strlen($chain) - 1;
        for (; $i >= 0 && $strPos >= 0; $i--, $strPos--)
        {
            $this->puyos[$i] = intval($chain[$strPos], 36);
        }
        for (; $i >= 0; $i--)
        {
            $this->puyos[$i] = Puyo::None;
        }

        $this->borderImage = imagecreatefrompng(__DIR__ . "/../../public/assets/images/wood_block.png");
        $this->puyoSkinImage = imagecreatefrompng(__DIR__ . "/../../public/assets/images/puyo/16x16/puyo.png");
    }

    /**
     * Gets the width of the board.
     *
     * @return int The width
     */
    public function getWidth(): int
    {
        return $this->width;
    }

    /**
     * Gets the height of the board.
     *
     * @return int The height
     */
    public function getHeight(): int
    {
        return $this->height;
    }

    /**
     * Gets the number of hidden rows at the top of the board.
     *
     * @return int The number of hidden rows
     */
    public function getHiddenRows(): int
    {
        return $this->hiddenRows;
    }

    /**
     * Gets the total height of the board.
     * The total height is the height plus the number of hidden rows.
     *
     * @return int The total height
     */
    public function getTotalHeight(): int
    {
        return $this->height + $this->hiddenRows;
    }

    /**
     * Gets the size of the board.
     * The size of the board is the width times the total height.
     *
     * @return int The size
     */
    public function getSize(): int
    {
        return $this->width * ($this->height + $this->hiddenRows);
    }

    /**
     * Gets the Puyo at the specified point.
     *
     * @param int $x The X point
     * @param int $y The Y point
     *
     * @return int The Puyo
     */
    public function get(int $x, int $y): int
    {
        return $this->puyos[($y * $this->width) + $x];
    }

    /**
     * Sets the Puyo at the specified point.
     *
     * @param int $x The X point
     * @param int $y The Y point
     * @param int $puyo The Puyo
     */
    public function set(int $x, int $y, int $puyo)
    {
        $this->puyos[($y * $this->width) + $x] = $puyo;
    }

    /**
     * Gets the current board state as an image.
     *
     * @return resource The image
     */
    public function toImage()
    {
        $image = imagecreatetruecolor(($this->width + 2) * self::PUYO_SIZE_PX, ($this->getTotalHeight() + 1) * self::PUYO_SIZE_PX);
        imagefill($image, 0, 0, imagecolorallocate($image, 48, 48, 48));

        // Draw the border
        for ($y = $this->hiddenRows; $y < $this->getTotalHeight() + 1; $y++)
        {
			imagecopymerge($image, $this->borderImage, 0, $y * self::PUYO_SIZE_PX, 0, 0, self::PUYO_SIZE_PX, self::PUYO_SIZE_PX, 100);
			imagecopymerge($image, $this->borderImage, ($this->width + 1) * self::PUYO_SIZE_PX, $y * self::PUYO_SIZE_PX, 0, 0, self::PUYO_SIZE_PX, self::PUYO_SIZE_PX, 100);
        }
        for ($x = 0; $x < $this->width; $x++)
        {
            imagecopymerge($image, $this->borderImage, ($x + 1) * self::PUYO_SIZE_PX, $this->getTotalHeight() * self::PUYO_SIZE_PX, 0, 0, 16, 16, 100);
        }

        // Draw the Puyos
        for ($y = 0; $y < $this->getTotalHeight(); $y++)
        {
            for ($x = 0; $x < $this->width; $x++)
            {
                $puyo = $this->get($x, $y);
                if ($puyo === Puyo::None) {
                    continue;
                }

                // We're going to cheat and use the index of Puyos in getting the position
                if (($puyo & PuyoFlags::Cleared) !== 0)
                {
                    $imagePoints = [
                        'x' => ($puyo & ~PuyoFlags::Cleared) - Puyo::Red + /*3*/6,
                        'y' => /*8*/5,
                    ];
                }
                else if ($puyo >= Puyo::/*Hard*/Garbage)
                {
                    $imagePoints = [
                        'x' => $puyo - Puyo::/*Hard*/Garbage,
                        'y' => /*8*/5,
                    ];
                }
                else
                {
                    $imagePoints = [
                        'x' => 0,
                        'y' => $puyo - Puyo::Red,
                    ];

                    // Assuming it's a colored Puyo, the x position will be based off their connection to other Puyos.
                    if ($y >= $this->hiddenRows && $puyo >= Puyo::Red && $puyo <= Puyo::Purple) {
                        if ($y < $this->getTotalHeight() - 1 && $this->get($x, $y + 1) === $puyo) {
                            $imagePoints['x'] += 1;
                        }
                        if ($y > $this->hiddenRows && $this->get($x, $y - 1) === $puyo) {
                            $imagePoints['x'] += 2;
                        }
                        if ($x < $this->width - 1 && $this->get($x + 1, $y) === $puyo) {
                            $imagePoints['x'] += 4;
                        }
                        if ($x > 0 && $this->get($x - 1, $y) === $puyo) {
                            $imagePoints['x'] += 8;
                        }
                    }
                }

                $opacity = $y < $this->hiddenRows
                    ? 50
                    : 100;

                imagecopymerge(
                    $image,
                    $this->puyoSkinImage,
                    (($x + 1) * self::PUYO_SIZE_PX),
                    $y * self::PUYO_SIZE_PX,
                    $imagePoints['x'] * self::PUYO_SIZE_PX,
                    $imagePoints['y'] * self::PUYO_SIZE_PX,
                    self::PUYO_SIZE_PX,
                    self::PUYO_SIZE_PX,
                    $opacity);
            }
        }

        return $image;
    }
}