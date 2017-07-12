<?php

/**
 * @license MIT
 * @license http://opensource.org/licenses/MIT
 */

namespace PuyoSim\PDO\Statement;

/**
 * Class DeleteStatement.
 *
 * @author Fabian de Laender <fabian@faapz.nl>
 */
class DeleteStatement extends \Slim\PDO\Statement\DeleteStatement
{
    /**
     * @param $table
     *
     * @return $this
     */
    public function from($table)
    {
        return parent::from($this->dbh->getTablePrefix() . $table);
    }
}
