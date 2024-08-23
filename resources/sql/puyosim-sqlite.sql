CREATE TABLE `chain` (
  `id` INTEGER PRIMARY KEY,
  `url` varchar(5) NOT NULL UNIQUE,
  `title` varchar(128) DEFAULT NULL,
  `chain` varchar(448) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `hidden_rows` int(11) NOT NULL,
  `pop_limit` int(11) NOT NULL,
  `hash` binary(32) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER `chain_update_timestamp`
  UPDATE OF
    `title`,
    `chain`,
    `width`,
    `height`,
    `hidden_rows`,
    `pop_limit`,
    `hash`
  ON `chain`
  BEGIN
    UPDATE `chain`
    SET `updated_at`=CURRENT_TIMESTAMP
    WHERE `ActionId`=NEW.`ActionId`;
  END;
