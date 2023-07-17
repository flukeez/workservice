/*
Navicat MySQL Data Transfer

Source Server         : db
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : dbworkspace

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2023-07-17 10:01:52
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tbtypemanages
-- ----------------------------
DROP TABLE IF EXISTS `tbtypemanages`;
CREATE TABLE `tbtypemanages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manage_type` varchar(256) NOT NULL,
  `durable_goods` int(11) NOT NULL,
  `building` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Table structure for tbtypemoneys
-- ----------------------------
DROP TABLE IF EXISTS `tbtypemoneys`;
CREATE TABLE `tbtypemoneys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `money_type` varchar(256) NOT NULL,
  `durable_goods` int(11) NOT NULL,
  `building` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
