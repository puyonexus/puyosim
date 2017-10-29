<?php
namespace PuyoSim\Simulator;

use PuyoSim\Simulator\Puyo;
use PuyoSim\Simulator\PuyoFlags;

class Simulation
{
    const ACTION_NONE = 0;
    const ACTION_CHAIN_PUYOS = 1;
    const ACTION_DROP_PUYOS = 2;

    private $popLimit;

    private $board;

    private $action = self::ACTION_NONE;
    private $nextAction = self::ACTION_NONE;

    /**
     * Creates a new simulation.
     *
     * @param Board $board The board to use for the simulation
     * @param int $popLimit The pop limit
     */
    public function __construct(Board $board, int $popLimit = 4)
    {
        $this->board = $board;
        $this->puyoToClear = $popLimit;
    }

    /**
     * Performs the next action, and returns if the action was performed.
     *
     * @return bool True if the action was performed, false otherwise
     */
    public function performAction(): bool
    {
        $this->action = $this->nextAction;

        if ($this->action === self::ACTION_CHAIN_PUYOS)
        {
            $isActionPerformed = $this->chainPuyos();
        }
        else if ($this->action === self::ACTION_DROP_PUYOS)
        {
            // Remove cleared Puyos
            for ($x = 0; $x < $this->board->getWidth(); $x++)
            {
                for ($y = 0; $y < $this->board->getTotalHeight(); $y++)
                {
                    if (($this->board->get($x, $y) & PuyoFlags::Cleared) !== 0)
                    {
                        $this->board->set($x, $y, Puyo::None);
                    }
                }
            }

            $isActionPerformed = $this->dropPuyos();
        }
        else
        {
            // We are just starting the chain
            if ($this->dropPuyos()) {
                $this->action = self::ACTION_DROP_PUYOS;
                $isActionPerformed = true;
            } else {
                $this->action = self::ACTION_CHAIN_PUYOS;
                $isActionPerformed = $this->chainPuyos();
            }
        }

        if ($isActionPerformed) {
            // Get the next action
            if ($this->action === self::ACTION_CHAIN_PUYOS) {
                $this->nextAction = self::ACTION_DROP_PUYOS;
            } else {
                $this->nextAction = self::ACTION_CHAIN_PUYOS;
            }
        } else {
            $this->action = self::ACTION_NONE;
            $this->nextAction = self::ACTION_NONE;
        }

        return $isActionPerformed;
    }

    /**
     * Performs the chain Puyos action.
     *
     * @return bool True if a chain was performed, false otherwise
     */
    private function chainPuyos(): bool
    {
        // The total number of Puyos cleared. When this number is not 0, then it is assumed a chain was made
        $puyosCleared = 0;

        // An array contain the Puyos we have checked
        $isChecked = array_fill(0, $this->board->getSize(), false);

        // Loop through the board and see if any chains can be made
        // We don't need to check the hidden rows
        for ($y = $this->board->getHiddenRows(); $y < $this->board->getTotalHeight(); $y++)
        {
            for ($x = 0; $x < $this->board->getWidth(); $x++)
            {
                $puyo = $this->board->get($x, $y);
                $isCheckedIndex = ($y * $this->board->getWidth()) + $x;

                if (!$isChecked[$isCheckedIndex] && $puyo >= Puyo::Red && $puyo <= Puyo::Purple)
                {
                    $isChecked[$isCheckedIndex] = true;

                    // Go through all the Puyos next to this one and see if any are the same Puyo,
                    // then do the same for those Puyos, and so on...
                    $points = [
                        [
                            'x' => $x,
                            'y' => $y,
                        ]
                    ];

                    $checkPuyoAt = function ($x, $y) use (&$isChecked, $isCheckedIndex, $puyo, &$points) {
                        $isCheckedIndex = ($y * $this->board->getWidth()) + $x;

                        if (!$isChecked[$isCheckedIndex] && $this->board->get($x, $y) === $puyo)
                        {
                            $isChecked[$isCheckedIndex] = true;
                            $points[] = [
                                'x' => $x,
                                'y' => $y,
                            ];
                        }
                    };

                    for ($i = 0; $i < count($points); $i++)
                    {
                        $point = $points[$i];

                        // Check the Puyos around this one and see if any of them are the same Puyo at this one
                        // If so, add them to the coordinate list and check those as well
                        if ($point['y'] > $this->board->getHiddenRows())
                        {
                            $checkPuyoAt($point['x'], $point['y'] - 1);
                        }
                        if ($point['x'] < $this->board->getWidth() - 1)
                        {
                            $checkPuyoAt($point['x'] + 1, $point['y']);
                        }
                        if ($point['y'] < $this->board->getTotalHeight() - 1)
                        {
                            $checkPuyoAt($point['x'], $point['y'] + 1);
                        }
                        if ($point['x'] > 0)
                        {
                            $checkPuyoAt($point['x'] - 1, $point['y']);
                        }
                    }

                    if (count($points) >= $this->puyoToClear)
                    {
                        // We've made a chain!
                        $puyosCleared += count($points);
                        
                        $clearGarbageAt = function ($x, $y) {
                            $puyo = $this->board->get($x, $y);

                            switch ($puyo)
                            {
                                case Puyo::Garbage:
                                case Puyo::Point:
                                case Puyo::Sun:
                                    $this->board->set($x, $y, $puyo | PuyoFlags::Cleared);
                                    break;
                                case Puyo::Hard:
                                    $this->board->set($x, $y, Puyo::Garbage);
                                    break;
                            }
                        };

                        // Mark the Puyos in the coordinate list as cleared
                        foreach ($points as $point)
                        {
                            $this->board->set(
                                $point['x'],
                                $point['y'],
                                $this->board->get($point['x'], $point['y']) | PuyoFlags::Cleared);

                            // Check the garbage Puyos around this one and clear/adjust them
                            if ($point['y'] > $this->board->getHiddenRows())
                            {
                                $clearGarbageAt($point['x'], $point['y'] - 1);
                            }
                            if ($point['x'] < $this->board->getWidth() - 1)
                            {
                                $clearGarbageAt($point['x'] + 1, $point['y']);
                            }
                            if ($point['y'] < $this->board->getTotalHeight() - 1)
                            {
                                $clearGarbageAt($point['x'], $point['y'] + 1);
                            }
                            if ($point['x'] > 0)
                            {
                                $clearGarbageAt($point['x'] - 1, $point['y']);
                            }
                        }
                    }
                }
            }
        }

        // We don't need to calculate any score or garbage, so just return if any Puyos were cleared
        return $puyosCleared > 0;
    }

    /**
     * Performs the drop Puyos action.
     *
     * @return bool True if any Puyos were dropped, false otherwise
     */
    private function dropPuyos(): bool
    {
        $dropped = false;

        for ($x = 0; $x < $this->board->getWidth(); $x++)
        {
            for ($y = $this->board->getTotalHeight() - 2; $y >= 0; $y--) // No need to check the bottom row
            {
                $puyo = $this->board->get($x, $y);

                // Check to see if there is an empty space below this Puyo
                if ($puyo !== Puyo::None && $puyo !== Puyo::Block && $this->board->get($x, $y + 1) === Puyo::None)
                {
                    $dropped = true;

                    $y2 = $y;
                    while ($y2 < $this->board->getTotalHeight() - 1 && $this->board->get($x, $y2 + 1) === Puyo::None)
                    {
                        $y2++;
                    }

                    $this->board->set($x, $y2, $puyo);
                    $this->board->set($x, $y, Puyo::None);
                }
            }
        }

        return $dropped;
    }
}