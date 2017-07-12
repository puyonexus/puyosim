<?php

/**
 * @license MIT
 * @license http://opensource.org/licenses/MIT
 */

namespace PuyoSim\PDO\Statement;

/**
 * Class InsertStatement.
 *
 * @author Fabian de Laender <fabian@faapz.nl>
 */
class InsertStatement extends \Slim\PDO\Statement\InsertStatement
{
    /**
     * @param $table
     *
     * @return $this
     */
    public function into($table)
    {
        return parent::into($this->dbh->getTablePrefix() . $table);
    }
}
