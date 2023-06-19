-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE =
        'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema AmazonPlusPlus
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `AmazonPlusPlus`;

-- -----------------------------------------------------
-- Schema AmazonPlusPlus
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `AmazonPlusPlus` DEFAULT CHARACTER SET utf8;
USE `AmazonPlusPlus`;

-- -----------------------------------------------------
-- Table `AmazonPlusPlus`.`city`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `AmazonPlusPlus`.`city`;

CREATE TABLE IF NOT EXISTS `AmazonPlusPlus`.`city`
(
    `id`   INT         NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `plz`  INT         NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `plz_UNIQUE` (`plz` ASC) VISIBLE
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AmazonPlusPlus`.`street`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `AmazonPlusPlus`.`street`;

CREATE TABLE IF NOT EXISTS `AmazonPlusPlus`.`street`
(
    `id`   INT         NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AmazonPlusPlus`.`address`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `AmazonPlusPlus`.`address`;

CREATE TABLE IF NOT EXISTS `AmazonPlusPlus`.`address`
(
    `id`        INT         NOT NULL AUTO_INCREMENT,
    `street_nr` VARCHAR(45) NOT NULL,
    `city_id`   INT         NOT NULL,
    `street_id` INT         NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_address_city1_idx` (`city_id` ASC) VISIBLE,
    INDEX `fk_address_street1_idx` (`street_id` ASC) VISIBLE,
    CONSTRAINT `fk_address_city1`
        FOREIGN KEY (`city_id`)
            REFERENCES `AmazonPlusPlus`.`city` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT `fk_address_street1`
        FOREIGN KEY (`street_id`)
            REFERENCES `AmazonPlusPlus`.`street` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AmazonPlusPlus`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `AmazonPlusPlus`.`user`;

CREATE TABLE IF NOT EXISTS `AmazonPlusPlus`.`user`
(
    `id`         INT         NOT NULL AUTO_INCREMENT,
    `status`     TINYINT     NOT NULL DEFAULT 1,
    `username`   VARCHAR(30) NOT NULL,
    `firstname`  VARCHAR(50) NOT NULL,
    `lastname`   VARCHAR(50) NOT NULL,
    `email`      VARCHAR(50) NOT NULL,
    `password`   TEXT        NOT NULL,
    `balance`    DOUBLE      NOT NULL DEFAULT 0,
    `address_id` INT         NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_User_address1_idx` (`address_id` ASC) VISIBLE,
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
    CONSTRAINT `fk_User_address1`
        FOREIGN KEY (`address_id`)
            REFERENCES `AmazonPlusPlus`.`address` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AmazonPlusPlus`.`article`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `AmazonPlusPlus`.`article`;

CREATE TABLE IF NOT EXISTS `AmazonPlusPlus`.`article`
(
    `id`          INT          NOT NULL AUTO_INCREMENT,
    `status`      TINYINT      NOT NULL DEFAULT 1,
    `name`        VARCHAR(150) NOT NULL,
    `description` TEXT         NOT NULL,
    `price`       DOUBLE       NOT NULL,
    `seller_id`   INT          NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_Article_User1_idx` (`seller_id` ASC) VISIBLE,
    CONSTRAINT `fk_Article_User1`
        FOREIGN KEY (`seller_id`)
            REFERENCES `AmazonPlusPlus`.`user` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AmazonPlusPlus`.`category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `AmazonPlusPlus`.`category`;

CREATE TABLE IF NOT EXISTS `AmazonPlusPlus`.`category`
(
    `id`   INT         NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AmazonPlusPlus`.`article_category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `AmazonPlusPlus`.`article_category`;

CREATE TABLE IF NOT EXISTS `AmazonPlusPlus`.`article_category`
(
    `article_id`  INT NOT NULL,
    `category_id` INT NOT NULL,
    PRIMARY KEY (`article_id`, `category_id`),
    INDEX `fk_Article_has_Category_Category1_idx` (`category_id` ASC) VISIBLE,
    INDEX `fk_Article_has_Category_Article_idx` (`article_id` ASC) VISIBLE,
    CONSTRAINT `fk_Article_has_Category_Article`
        FOREIGN KEY (`article_id`)
            REFERENCES `AmazonPlusPlus`.`article` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT `fk_Article_has_Category_Category1`
        FOREIGN KEY (`category_id`)
            REFERENCES `AmazonPlusPlus`.`category` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AmazonPlusPlus`.`transaction`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `AmazonPlusPlus`.`transaction`;

CREATE TABLE IF NOT EXISTS `AmazonPlusPlus`.`transaction`
(
    `id`         INT      NOT NULL AUTO_INCREMENT,
    `seller_id`  INT      NOT NULL,
    `buyer_id`   INT      NOT NULL,
    `article_id` INT      NOT NULL,
    `created`    DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (`id`),
    INDEX `fk_Transaction_User1_idx` (`seller_id` ASC) VISIBLE,
    INDEX `fk_Transaction_User2_idx` (`buyer_id` ASC) VISIBLE,
    INDEX `fk_Transaction_Article1_idx` (`article_id` ASC) VISIBLE,
    CONSTRAINT `fk_Transaction_User1`
        FOREIGN KEY (`seller_id`)
            REFERENCES `AmazonPlusPlus`.`user` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT `fk_Transaction_User2`
        FOREIGN KEY (`buyer_id`)
            REFERENCES `AmazonPlusPlus`.`user` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT `fk_Transaction_Article1`
        FOREIGN KEY (`article_id`)
            REFERENCES `AmazonPlusPlus`.`article` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AmazonPlusPlus`.`image`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `AmazonPlusPlus`.`image`;

CREATE TABLE IF NOT EXISTS `AmazonPlusPlus`.`image`
(
    `id`         INT  NOT NULL AUTO_INCREMENT,
    `url`        TEXT NOT NULL,
    `article_id` INT  NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_image_Article1_idx` (`article_id` ASC) VISIBLE,
    CONSTRAINT `fk_image_Article1`
        FOREIGN KEY (`article_id`)
            REFERENCES `AmazonPlusPlus`.`article` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;

SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;

INSERT INTO city (name, plz)
VALUES ('Linz', 4020);

INSERT INTO city (name, plz)
VALUES ('Wilhering', 4073);

INSERT INTO city (name, plz)
VALUES ('Steyr', 4596);

INSERT INTO street (name)
VALUES ('Wiener Straße');

INSERT INTO street (name)
VALUES ('Berggasse');

INSERT INTO street (name)
VALUES ('Gsöllhofstraße');

INSERT INTO address (city_id, street_id, street_nr)
VALUES (1, 1, 181);

INSERT INTO address (city_id, street_id, street_nr)
VALUES (2, 2, 5);

INSERT INTO address (city_id, street_id, street_nr)
VALUES (3, 3, 1);

INSERT INTO user (username, firstname, lastname, email, password, balance, address_id)
VALUES ('thistim', 'Tim', 'Hofmann', 'timhofmann01@gmail.com',
        '$2b$10$zNAGq/LGwGMBIlWoCEDxFO6E70mWQfAkgRxmC0YQXTaD9fNVVTRfe', 99999, 2);

INSERT INTO user (username, firstname, lastname, email, password, balance, address_id)
VALUES ('stiangglanda', 'Leander', 'Kieweg', 'kieweg.leander@gmail.com',
        '$2b$10$zNAGq/LGwGMBIlWoCEDxFO6E70mWQfAkgRxmC0YQXTaD9fNVVTRfe', 99999, 3);

INSERT INTO user (username, firstname, lastname, email, password, balance, address_id)
VALUES ('TimeskateHD', 'Maximilian', 'Schernhuber', 'max.schernhuber@students.bs-linz2.ac.at',
        '$2b$10$zNAGq/LGwGMBIlWoCEDxFO6E70mWQfAkgRxmC0YQXTaD9fNVVTRfe', 99999, 1);

INSERT INTO article (status, name, description, price, seller_id)
VALUES (1, 'ROG Zephyrus M16', 'Gaming Laptop', 1487.08, 1);

INSERT INTO article (status, name, description, price, seller_id)
VALUES (1, 'Lenovo Idea Pad Gaming', 'Gaming Laptop', 1000.1, 2);

INSERT INTO category (name) VALUES ('Technology');
INSERT INTO category (name) VALUES ('Gaming');
INSERT INTO category (name) VALUES ('Clothing');
INSERT INTO category (name) VALUES ('Sports');

INSERT INTO article_category (article_id, category_id)
VALUES (1, 1);

INSERT INTO article_category (article_id, category_id)
VALUES (2, 1);


INSERT INTO transaction (seller_id, buyer_id, article_id)
VALUES (2, 1, 2);


INSERT INTO image (url, article_id)
VALUES ('https://gzhls.at/i/09/62/2710962-n0.jpg', 1);

INSERT INTO image (url, article_id)
VALUES ('https://gzhls.at/i/35/48/2683548-n0.jpg', 2);