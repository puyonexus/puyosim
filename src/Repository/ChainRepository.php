<?php
namespace PuyoSim\Repository;

use PuyoSim\Common\NumberBase;
use PuyoSim\Common\StringUtils;
use PuyoSim\Entity\Chain;
use PuyoSim\PDO\Database;

class ChainRepository
{
    protected $db;
    protected $tablePrefix;

    public function __construct(Database $db)
    {
        $this->db = $db;
    }

    /**
     * Finds a Chain entity by its primary key ID
     *
     * @param int $id The primary key ID
     *
     * @return Chain The chain entity, or null if it does not exist
     */
    public function find(int $id)
    {
        $statement = $this->db
            ->select()
            ->from('chain')
            ->where('id', '=', $id)
            ->limit(1, 0);
        
        $rows = $statement->execute()->fetchAll(\PDO::FETCH_CLASS, Chain::class);
        if (count($rows) === 0)
        {
            return null;
        }

        return $rows[0];
    }

    /**
     * Finds a Chain entity by its URL
     *
     * @param string $url The URL
     *
     * @return Chain The chain entity, or null if it does not exist
     */
    public function findByUrl(string $url)
    {
        $statement = $this->db
            ->select()
            ->from('chain')
            ->where('url', '=', $url)
            ->limit(1, 0);

        $rows = $statement->execute()->fetchAll(\PDO::FETCH_CLASS, Chain::class);
        if (count($rows) === 0)
        {
            return null;
        }

        return $rows[0];
    }

    /**
     * Finds a Chain entity by its hash
     *
     * @param string $hash The hash
     *
     * @return Chain The chain entity, or null if it does not exist
     */
    public function findByHash(string $hash)
    {
        $statement = $this->db
            ->select()
            ->from('chain')
            ->where('hash', '=', $hash)
            ->limit(1, 0);
        
        $rows = $statement->execute()->fetchAll(\PDO::FETCH_CLASS, Chain::class);
        if (count($rows) === 0)
        {
            return null;
        }

        return $rows[0];
    }

    /**
     * Inserts a Chain entity
     *
     * @param Chain $entity The entity
     *
     * @return Chain The entity that was inserted
     */
    public function insert(Chain $entity): Chain
    {
        // Generate the hash
        $hash = hash('sha256', "{$entity->title},{$entity->chain},{$entity->width},{$entity->height},{$entity->hidden_rows},{$entity->pop_limit}", true);

        // Check to see if a chain with the specified hash already exists
        // If so, just assume that row was inserted
        $existingEntity = $this->findByHash($hash);
        if ($existingEntity !== null)
        {
            return $existingEntity;
        }

        // Generate a url, and keep on generating one until it's unique
        // If we fail to generate one after 5 tries, just give up.
        $i = 5;
        while ($i > 0)
        {
            $url = StringUtils::random(6, NumberBase::BASE58_ALPHABET);
            $i--;

            if (!$this->urlExists($url))
            {
                break;
            }

            if ($i === 0)
            {
                throw new \Exception();
                break;
            }
        }

        $statement = $this->db
            ->insert()
            ->into('chain')
            ->columns([
                'url',
                'title',
                'chain',
                'width',
                'height',
                'hidden_rows',
                'pop_limit',
                'hash',
            ])
            ->values([
                $url,
                $entity->title,
                $entity->chain,
                $entity->width,
                $entity->height,
                $entity->hidden_rows,
                $entity->pop_limit,
                $hash,
            ]);
        
        $insertId = $statement->execute(true);

        $entity->id = $insertId;
        $entity->url = $url;
        $entity->hash = $hash;

        return $entity;
    }

    /**
     * Gets if the URL is already used by another chain.
     *
     * @param string $url The URL
     *
     * @return bool True if the URL is used, false otherwise
     */
    public function urlExists(string $url): bool
    {
        $statement = $this->db
            ->select()
            ->count()
            ->from('chain')
            ->where('url', '=', $url)
            ->limit(1, 0);
        
        $count = $statement->execute()->fetchColumn();
        return $count > 0;
    }
}