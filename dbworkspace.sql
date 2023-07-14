/*
Navicat MySQL Data Transfer

Source Server         : db
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : dbworkspace

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2023-07-14 16:16:15
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tbtypemanages
-- ----------------------------
DROP TABLE IF EXISTS `tbtypemanages`;
CREATE TABLE `tbtypemanages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_manage` varchar(256) NOT NULL,
  `durable_goods` int(11) NOT NULL,
  `building` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tbtypemanages
-- ----------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tbtypemoneys
-- ----------------------------
INSERT INTO `tbtypemoneys` VALUES ('8', 'abc', '1', '2');
