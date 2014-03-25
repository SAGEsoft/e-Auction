-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 25, 2014 at 03:37 AM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sagesoft`
--
CREATE DATABASE IF NOT EXISTS `sagesoft` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `sagesoft`;

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE IF NOT EXISTS `address` (
  `address_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `street` varchar(50) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `lives_in` char(1) DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  KEY `user_ind` (`username`),
  KEY `zip_ind` (`zip`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE IF NOT EXISTS `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `auction_item`
--

CREATE TABLE IF NOT EXISTS `auction_item` (
  `item_id` int(11) NOT NULL DEFAULT '0',
  `current_bid` double DEFAULT NULL,
  `buy_it_now` double DEFAULT NULL,
  `reserve_price` double DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `auto_complete`
--

CREATE TABLE IF NOT EXISTS `auto_complete` (
  `auto_id` int(11) NOT NULL DEFAULT '0',
  `title` char(50) DEFAULT NULL,
  `url` char(200) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`auto_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `auto_complete`
--

REPLACE INTO `auto_complete` (`auto_id`, `title`, `url`, `description`) VALUES
(0, 'The Last of Us', 'http://www.thelastofus.playstation.com/', 'The Last of Us takes place in the United States, twenty years after a fungal spore-based infection rapidly spread across the globe, wiping out a vast majority of the population by warping its hosts? brains and turning them into deadly predators capable of killing with a single bite. The remnants of the world?s population has been reduced to either struggling survivors or ravenous infected mutants. The game features several locations across the United States, including Boston and Lincoln, Massachusetts, Pittsburgh, Pennsylvania, Wyoming, Colorado and Salt Lake City, Utah.'),
(1, 'Grand Theft Auto V', 'www.rockstargames.com/V', 'Grand Theft Auto V features three playable protagonists: Michael, Trevor and Franklin. Michael is a retired professional bank robber, who after making a sweetheart deal with FIB, returned to the life of crime. Trevor is the loose cannon in this story, and is also a long time best friend of Michael''s and a hothead psychopath as well. Last but certainly not least, we have Franklin, a young and grim repossession agent who has a large amount of experience behind the wheel, but no real experience with crime until he meets Michael while he was trying to hustle.');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `category_id` char(30) NOT NULL,
  `parent_category_id` char(30) NOT NULL DEFAULT 'ALL',
  `summary` text,
  PRIMARY KEY (`category_id`),
  KEY `par_ind` (`parent_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

REPLACE INTO `category` (`category_id`, `parent_category_id`, `summary`) VALUES
('ALL', 'ALL', NULL),
('PC', 'ALL', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE IF NOT EXISTS `company` (
  `username` char(20) NOT NULL,
  `company_name` char(30) NOT NULL,
  `contact` char(30) NOT NULL,
  `company_address` char(200) DEFAULT NULL,
  `company_category` char(30) DEFAULT NULL,
  `revenue` int(11) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `credit_card`
--

CREATE TABLE IF NOT EXISTS `credit_card` (
  `card_num` char(16) NOT NULL,
  `username` char(20) NOT NULL,
  `card_type` char(10) DEFAULT NULL,
  `expiration` date DEFAULT NULL,
  PRIMARY KEY (`card_num`),
  KEY `user_ind` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `delivery`
--

CREATE TABLE IF NOT EXISTS `delivery` (
  `item_id` int(11) NOT NULL,
  `void_date` date DEFAULT NULL,
  `shipped` date DEFAULT NULL,
  `received` date DEFAULT NULL,
  `auction_status` char(20) DEFAULT NULL,
  `card_num` char(16) NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `card_num` (`card_num`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `individual`
--

CREATE TABLE IF NOT EXISTS `individual` (
  `username` char(20) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` char(10) DEFAULT NULL,
  `income` int(11) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
  `item_id` int(11) NOT NULL DEFAULT '0',
  `title` char(50) DEFAULT NULL,
  `url` char(200) DEFAULT NULL,
  `description` text,
  `time_started` date DEFAULT NULL,
  `location` int(11) DEFAULT NULL,
  `owner` char(20) NOT NULL,
  `category_id` char(30) NOT NULL,
  `auto_id` int(11) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `location` (`location`),
  KEY `owner` (`owner`),
  KEY `category_id` (`category_id`),
  KEY `auto_id` (`auto_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rating`
--

CREATE TABLE IF NOT EXISTS `rating` (
  `item_id` int(11) NOT NULL,
  `rater_username` varchar(20) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `explanation` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`item_id`,`rater_username`),
  KEY `rater_username` (`rater_username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trade_item`
--

CREATE TABLE IF NOT EXISTS `trade_item` (
  `item_id` int(11) NOT NULL DEFAULT '0',
  `desired_item` char(50) DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(20) NOT NULL,
  `hashedPassword` char(255) NOT NULL,
  `name` char(255) DEFAULT NULL,
  `email` char(50) DEFAULT NULL,
  `avg_rating` double DEFAULT NULL,
  `user_type` char(20) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `openId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `users`
--

REPLACE INTO `users` (`id`, `username`, `hashedPassword`, `name`, `email`, `avg_rating`, `user_type`, `salt`, `openId`, `createdAt`, `updatedAt`) VALUES
(3, 'bagift10', '+Oa7seIqxYYB8Moi8SOg6lUZ3Sm6MpDf8QT6fdBXiW7RwS/iyoQ8HMjKVQlPCmPmqJvNmEUidQwCsRe13QPieg==', 'Brandon Gift', 'bagift10@gmail.com', NULL, 'Individual', 'hBHMSt1K2jagLaWckAIx/Q==', NULL, '2014-03-25 03:35:28', '2014-03-25 03:35:28'),
(2, 'bgiftdev', 'xbvznJRigBMRD3PL7dVbEIpM+xemNvQCeWaRLCTiywlW7evoYzMrzivYipcBD+BwN3eCq8qQXmxlUt7Og474FA==', 'Brandon Gift', 'bgift@bgiftdev.com', NULL, 'Company', 'NsxSfOPp0hLY1S7e/l2rGg==', NULL, '2014-03-25 03:34:53', '2014-03-25 03:34:53');

-- --------------------------------------------------------

--
-- Table structure for table `zip`
--

CREATE TABLE IF NOT EXISTS `zip` (
  `zip` varchar(10) NOT NULL,
  `city` varchar(20) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`zip`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`zip`) REFERENCES `zip` (`zip`),
  ADD CONSTRAINT `address_ibfk_2` FOREIGN KEY (`username`) REFERENCES `users` (`username`);

--
-- Constraints for table `auction_item`
--
ALTER TABLE `auction_item`
  ADD CONSTRAINT `auction_item_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`category_id`);

--
-- Constraints for table `company`
--
ALTER TABLE `company`
  ADD CONSTRAINT `company_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`);

--
-- Constraints for table `credit_card`
--
ALTER TABLE `credit_card`
  ADD CONSTRAINT `credit_card_ibfk_1` FOREIGN KEY (`username`) REFERENCES `individual` (`username`);

--
-- Constraints for table `delivery`
--
ALTER TABLE `delivery`
  ADD CONSTRAINT `delivery_ibfk_1` FOREIGN KEY (`card_num`) REFERENCES `credit_card` (`card_num`),
  ADD CONSTRAINT `delivery_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `trade_item` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `individual`
--
ALTER TABLE `individual`
  ADD CONSTRAINT `individual_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`);

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`location`) REFERENCES `address` (`address_id`),
  ADD CONSTRAINT `items_ibfk_2` FOREIGN KEY (`owner`) REFERENCES `users` (`username`),
  ADD CONSTRAINT `items_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  ADD CONSTRAINT `items_ibfk_4` FOREIGN KEY (`auto_id`) REFERENCES `auto_complete` (`auto_id`);

--
-- Constraints for table `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`),
  ADD CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`rater_username`) REFERENCES `users` (`username`);

--
-- Constraints for table `trade_item`
--
ALTER TABLE `trade_item`
  ADD CONSTRAINT `trade_item_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
