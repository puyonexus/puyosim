<?php

/**
 * @license MIT
 * @license http://opensource.org/licenses/MIT
 */

namespace PuyoSim\PDO;

use PuyoSim\PDO\Statement\SelectStatement;
use PuyoSim\PDO\Statement\InsertStatement;
use PuyoSim\PDO\Statement\UpdateStatement;
use PuyoSim\PDO\Statement\DeleteStatement;

/**
 * Class Database.
 *
 * @author Fabian de Laender <fabian@faapz.nl>
 */
class Database extends \Slim\PDO\Database
{
    private $tablePrefix;

    /**
     * Constructor.
     *
     * @param $dsn
     * @param null  $usr
     * @param null  $pwd
     * @param array $options
     */
    public function __construct($dsn, $usr = null, $pwd = null, array $options = array(), string $tablePrefix = '')
    {
        parent::__construct($dsn, $usr, $pwd, $options);
        $this->tablePrefix = $tablePrefix;
    }

    /**
     * @param array $columns
     *
     * @return SelectStatement
     */
    public function select(array $columns = array('*'))
    {
        return new SelectStatement($this, $columns);
    }

    /**
     * @param array $columnsOrPairs
     *
     * @return InsertStatement
     */
    public function insert(array $columnsOrPairs = array())
    {
        return new InsertStatement($this, $columnsOrPairs);
    }

    /**
     * @param array $pairs
     *
     * @return UpdateStatement
     */
    public function update(array $pairs = array())
    {
        return new UpdateStatement($this, $pairs);
    }

    /**
     * @param null $table
     *
     * @return DeleteStatement
     */
    public function delete($table = null)
    {
        return new DeleteStatement($this, $table);
    }

    public function getTablePrefix()
    {
        return $this->tablePrefix;
    }
}
