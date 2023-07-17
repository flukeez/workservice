/*
Navicat MySQL Data Transfer

Source Server         : db
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : dbworkspace

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2023-07-17 16:07:31
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tbtypemanages
-- ----------------------------
DROP TABLE IF EXISTS `tbtypemanages`;
CREATE TABLE `tbtypemanages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `manage_type` varchar(256) NOT NULL,
  `durable_goods` int(11) NOT NULL,
  `building` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tbtypemanages
-- ----------------------------
INSERT INTO `tbtypemanages` VALUES ('9', '01', 'ดำเนินการเอง', '0', '0');
INSERT INTO `tbtypemanages` VALUES ('10', '02', 'จ้างเหมา', '0', '0');
INSERT INTO `tbtypemanages` VALUES ('11', '03', 'ดำเนินการเองบางส่วน', '0', '0');
INSERT INTO `tbtypemanages` VALUES ('12', '05', 'รับโอน', '10', '0');

-- ----------------------------
-- Table structure for tbtypemoneys
-- ----------------------------
DROP TABLE IF EXISTS `tbtypemoneys`;
CREATE TABLE `tbtypemoneys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `money_type` varchar(256) NOT NULL,
  `durable_goods` int(11) NOT NULL,
  `building` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tbtypemoneys
-- ----------------------------
INSERT INTO `tbtypemoneys` VALUES ('13', '01', 'เงินงบประมาณ', '0', '0');
INSERT INTO `tbtypemoneys` VALUES ('14', '02', 'เงินทุนหมุนเวียนเพื่อการชลประทาน', '0', '0');
INSERT INTO `tbtypemoneys` VALUES ('15', '03', 'เงินกู้', '1', '1');
INSERT INTO `tbtypemoneys` VALUES ('16', '04', 'เงินบริจาค', '0', '0');
