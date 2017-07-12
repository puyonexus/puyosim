<?php

/**
 * @license MIT
 * @license http://opensource.org/licenses/MIT
 */

namespace PuyoSim\PDO\Statement;

/**
 * Class SelectStatement.
 *
 * @author Fabian de Laender <fabian@faapz.nl>
 */
class SelectStatement extends \Slim\PDO\Statement\SelectStatement
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

    /**
     * @param $table
     * @param $first
     * @param null   $operator
     * @param null   $second
     * @param string $joinType
     *
     * @return $this
     */
    public function join($table, $first, $operator = null, $second = null, $joinType = 'INNER')
    {
        return parent::join($this->dbh->getTablePrefix() . $table, $first, $operator, $second, $joinType);
    }

    /**
     * @param $table
     * @param $first
     * @param null $operator
     * @param null $second
     *
     * @return $this
     */
    public function leftJoin($table, $first, $operator = null, $second = null)
    {
        return parent::leftJoin($this->dbh->getTablePrefix() . $table, $first, $operator, $second);
    }

    /**
     * @param $table
     * @param $first
     * @param null $operator
     * @param null $second
     *
     * @return $this
     */
    public function rightJoin($table, $first, $operator = null, $second = null)
    {
        return parent::rightJoin($this->dbh->getTablePrefix() . $table, $first, $operator, $second);
    }

    /**
     * @param $table
     * @param $first
     * @param null $operator
     * @param null $second
     *
     * @return $this
     */
    public function fullJoin($table, $first, $operator = null, $second = null)
    {
        return parent::fullJoin($this->dbh->getTablePrefix() . $table, $first, $operator, $second);
    }
}
