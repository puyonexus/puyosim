<?php

/**
 * @license MIT
 * @license http://opensource.org/licenses/MIT
 */

namespace PuyoSim\PDO\Statement;

/**
 * Class UpdateStatement.
 *
 * @author Fabian de Laender <fabian@faapz.nl>
 */
class UpdateStatement extends \Slim\PDO\Statement\UpdateStatement
{
    /**
     * @param $table
     *
     * @return $this
     */
    public function table($table)
    {
        return parent::table($this->dbh->getTablePrefix() . $table);
    }
}
