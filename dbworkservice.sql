/*
Navicat MySQL Data Transfer

Source Server         : db
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : dbworkservice

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2024-05-28 17:18:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tb_amphure
-- ----------------------------
DROP TABLE IF EXISTS `tb_amphure`;
CREATE TABLE `tb_amphure` (
  `id` int(10) NOT NULL DEFAULT 0,
  `amphure_name` varchar(100) NOT NULL DEFAULT '',
  `province_id` int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`,`province_id`),
  KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=tis620 COLLATE=tis620_thai_ci;

-- ----------------------------
-- Records of tb_amphure
-- ----------------------------

-- ----------------------------
-- Table structure for tb_equip
-- ----------------------------
DROP TABLE IF EXISTS `tb_equip`;
CREATE TABLE `tb_equip` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `serail` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL,
  `waranty` varchar(255) NOT NULL,
  `waranty_start` date NOT NULL,
  `waranty_end` date NOT NULL,
  `details` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `equip_status_id` int(11) NOT NULL,
  `equip_show` int(11) NOT NULL,
  `shared` varchar(255) NOT NULL,
  `equip_type_id` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_equip_status` (`equip_status_id`),
  KEY `fk_equip_type` (`equip_type_id`),
  KEY `fk_equip_dep` (`faculty_id`),
  KEY ` fk_equip_user` (`user_id`),
  CONSTRAINT ` fk_equip_user` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`),
  CONSTRAINT `fk_equip_fac` FOREIGN KEY (`faculty_id`) REFERENCES `tb_faculty` (`id`),
  CONSTRAINT `fk_equip_status` FOREIGN KEY (`equip_status_id`) REFERENCES `tb_equip_status` (`id`),
  CONSTRAINT `fk_equip_type` FOREIGN KEY (`equip_type_id`) REFERENCES `tb_equip_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_equip
-- ----------------------------

-- ----------------------------
-- Table structure for tb_equip_status
-- ----------------------------
DROP TABLE IF EXISTS `tb_equip_status`;
CREATE TABLE `tb_equip_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_equip_status
-- ----------------------------

-- ----------------------------
-- Table structure for tb_equip_type
-- ----------------------------
DROP TABLE IF EXISTS `tb_equip_type`;
CREATE TABLE `tb_equip_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_equip_type
-- ----------------------------

-- ----------------------------
-- Table structure for tb_faculty
-- ----------------------------
DROP TABLE IF EXISTS `tb_faculty`;
CREATE TABLE `tb_faculty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `faculty_id` int(255) DEFAULT NULL,
  `faculty_show` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_faculty
-- ----------------------------
INSERT INTO `tb_faculty` VALUES ('7', 'IIT-dsdasdas', null, '1');
INSERT INTO `tb_faculty` VALUES ('8', 'IIT-D', '7', '0');
INSERT INTO `tb_faculty` VALUES ('9', 'test', '8', '0');
INSERT INTO `tb_faculty` VALUES ('10', 'test', '8', '0');
INSERT INTO `tb_faculty` VALUES ('11', 'test1', '8', '1');
INSERT INTO `tb_faculty` VALUES ('12', 'test', '8', '0');
INSERT INTO `tb_faculty` VALUES ('13', 'test', '8', '0');
INSERT INTO `tb_faculty` VALUES ('14', 'test', '8', '0');
INSERT INTO `tb_faculty` VALUES ('15', 'test', '8', '0');
INSERT INTO `tb_faculty` VALUES ('16', 'test', '8', '0');
INSERT INTO `tb_faculty` VALUES ('17', 'test', '8', '0');
INSERT INTO `tb_faculty` VALUES ('18', 'test', '8', '0');
INSERT INTO `tb_faculty` VALUES ('19', 'test', '8', '0');
INSERT INTO `tb_faculty` VALUES ('20', 'test1112', '8', '0');

-- ----------------------------
-- Table structure for tb_faculty_type
-- ----------------------------
DROP TABLE IF EXISTS `tb_faculty_type`;
CREATE TABLE `tb_faculty_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_faculty_type
-- ----------------------------

-- ----------------------------
-- Table structure for tb_issue
-- ----------------------------
DROP TABLE IF EXISTS `tb_issue`;
CREATE TABLE `tb_issue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `issue_type` int(255) NOT NULL COMMENT '0=ปัญหาหลัก\r\n1=ปัญหาย่อย',
  `issue_id` varchar(11) DEFAULT '',
  `issue_show` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_issue_issue` (`issue_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_issue
-- ----------------------------
INSERT INTO `tb_issue` VALUES ('1', 'test3', '1', '3', '0');
INSERT INTO `tb_issue` VALUES ('2', 'test1', '1', '3', '1');
INSERT INTO `tb_issue` VALUES ('3', 'sdfsdfsdfsd', '0', null, '0');
INSERT INTO `tb_issue` VALUES ('4', 'test9', '0', null, '0');
INSERT INTO `tb_issue` VALUES ('5', 'tsttestsdtws', '1', '3', '0');
INSERT INTO `tb_issue` VALUES ('6', 'test3sdf', '0', null, '0');
INSERT INTO `tb_issue` VALUES ('7', 'sdfsdfsd', '1', '3', '0');

-- ----------------------------
-- Table structure for tb_module
-- ----------------------------
DROP TABLE IF EXISTS `tb_module`;
CREATE TABLE `tb_module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_module
-- ----------------------------

-- ----------------------------
-- Table structure for tb_module_con
-- ----------------------------
DROP TABLE IF EXISTS `tb_module_con`;
CREATE TABLE `tb_module_con` (
  `module_id` int(2) NOT NULL,
  `pos_role_id` int(2) NOT NULL,
  PRIMARY KEY (`module_id`,`pos_role_id`),
  KEY `fk_moudle_pos` (`pos_role_id`),
  CONSTRAINT `fk_module` FOREIGN KEY (`module_id`) REFERENCES `tb_module` (`id`),
  CONSTRAINT `fk_moudle_pos` FOREIGN KEY (`pos_role_id`) REFERENCES `tb_position` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_module_con
-- ----------------------------

-- ----------------------------
-- Table structure for tb_position
-- ----------------------------
DROP TABLE IF EXISTS `tb_position`;
CREATE TABLE `tb_position` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `super_admin` tinyint(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pos_fac` (`faculty_id`),
  CONSTRAINT `fk_pos_fac` FOREIGN KEY (`faculty_id`) REFERENCES `tb_faculty` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_position
-- ----------------------------
INSERT INTO `tb_position` VALUES ('2', 'test481', '9', '1');
INSERT INTO `tb_position` VALUES ('3', 'test1112', '8', '0');
INSERT INTO `tb_position` VALUES ('5', 'บุคคลทั่วไป', '9', '1');
INSERT INTO `tb_position` VALUES ('6', 'test1112546', '8', '0');
INSERT INTO `tb_position` VALUES ('7', '12345', '19', '0');

-- ----------------------------
-- Table structure for tb_priority
-- ----------------------------
DROP TABLE IF EXISTS `tb_priority`;
CREATE TABLE `tb_priority` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `priority_show` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_priority
-- ----------------------------
INSERT INTO `tb_priority` VALUES ('1', 'test1', '1');
INSERT INTO `tb_priority` VALUES ('2', 'ด่วนมาก', '0');
INSERT INTO `tb_priority` VALUES ('3', 'ด่วนที่สุด', '0');
INSERT INTO `tb_priority` VALUES ('4', 'ด่วนนิดหน่อย', '1');
INSERT INTO `tb_priority` VALUES ('5', 'ด่วน', '1');
INSERT INTO `tb_priority` VALUES ('6', 'ด่วน', '0');

-- ----------------------------
-- Table structure for tb_province
-- ----------------------------
DROP TABLE IF EXISTS `tb_province`;
CREATE TABLE `tb_province` (
  `province_no` int(2) NOT NULL DEFAULT 0,
  `id` int(10) NOT NULL DEFAULT 0,
  `province_name` varchar(100) NOT NULL DEFAULT '',
  `region` int(2) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=tis620 COLLATE=tis620_thai_ci;

-- ----------------------------
-- Records of tb_province
-- ----------------------------

-- ----------------------------
-- Table structure for tb_request
-- ----------------------------
DROP TABLE IF EXISTS `tb_request`;
CREATE TABLE `tb_request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL,
  `notify` tinyint(1) NOT NULL,
  `issue_id` int(11) NOT NULL,
  `sub_issue_id` int(11) NOT NULL,
  `priority_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_req_issue` (`issue_id`),
  KEY `fk_req_sub_issue` (`sub_issue_id`),
  KEY `fk_req_priority` (`priority_id`),
  KEY `fk_req_provi` (`provider_id`),
  KEY `fk_req_status` (`status_id`),
  KEY `fk_req_fac` (`faculty_id`),
  KEY `fk_req_user` (`user_id`),
  CONSTRAINT `fk_req_fac` FOREIGN KEY (`faculty_id`) REFERENCES `tb_faculty` (`id`),
  CONSTRAINT `fk_req_issue` FOREIGN KEY (`issue_id`) REFERENCES `tb_issue` (`id`),
  CONSTRAINT `fk_req_priority` FOREIGN KEY (`priority_id`) REFERENCES `tb_priority` (`id`),
  CONSTRAINT `fk_req_provi` FOREIGN KEY (`provider_id`) REFERENCES `tb_user` (`id`),
  CONSTRAINT `fk_req_status` FOREIGN KEY (`status_id`) REFERENCES `tb_status` (`id`),
  CONSTRAINT `fk_req_sub_issue` FOREIGN KEY (`sub_issue_id`) REFERENCES `tb_issue` (`id`),
  CONSTRAINT `fk_req_user` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_request
-- ----------------------------

-- ----------------------------
-- Table structure for tb_request_details
-- ----------------------------
DROP TABLE IF EXISTS `tb_request_details`;
CREATE TABLE `tb_request_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `details` varchar(255) NOT NULL,
  `resolution` varchar(255) NOT NULL,
  `request_cost` decimal(10,0) NOT NULL,
  `parts_cost` decimal(10,0) NOT NULL,
  `other_cost` decimal(10,0) NOT NULL,
  `vat` decimal(10,0) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT '',
  `request_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_req_detail_req` (`request_id`),
  CONSTRAINT `fk_req_detail_req` FOREIGN KEY (`request_id`) REFERENCES `tb_request` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_request_details
-- ----------------------------

-- ----------------------------
-- Table structure for tb_request_equip_list
-- ----------------------------
DROP TABLE IF EXISTS `tb_request_equip_list`;
CREATE TABLE `tb_request_equip_list` (
  `equip_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  PRIMARY KEY (`equip_id`,`request_id`),
  KEY `fk_req_equip_req` (`request_id`),
  CONSTRAINT `fk_req_equip_equip` FOREIGN KEY (`equip_id`) REFERENCES `tb_equip` (`id`),
  CONSTRAINT `fk_req_equip_req` FOREIGN KEY (`request_id`) REFERENCES `tb_request` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_request_equip_list
-- ----------------------------

-- ----------------------------
-- Table structure for tb_request_history
-- ----------------------------
DROP TABLE IF EXISTS `tb_request_history`;
CREATE TABLE `tb_request_history` (
  `request_id` int(11) NOT NULL,
  `details` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `status_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`request_id`,`timestamp`),
  KEY `fk_req_his_status` (`status_id`),
  CONSTRAINT `fk_req_his_req` FOREIGN KEY (`request_id`) REFERENCES `tb_request` (`id`),
  CONSTRAINT `fk_req_his_status` FOREIGN KEY (`status_id`) REFERENCES `tb_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_request_history
-- ----------------------------

-- ----------------------------
-- Table structure for tb_status
-- ----------------------------
DROP TABLE IF EXISTS `tb_status`;
CREATE TABLE `tb_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `status_show` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_status
-- ----------------------------
INSERT INTO `tb_status` VALUES ('1', 'test1', '1');
INSERT INTO `tb_status` VALUES ('2', 'ดำเนินการสำเร็จ', '0');
INSERT INTO `tb_status` VALUES ('3', 'กำลังปรับปรุง', '0');
INSERT INTO `tb_status` VALUES ('4', 'ปกติ1', '1');
INSERT INTO `tb_status` VALUES ('5', 'ปกติ1', '0');

-- ----------------------------
-- Table structure for tb_tumbol
-- ----------------------------
DROP TABLE IF EXISTS `tb_tumbol`;
CREATE TABLE `tb_tumbol` (
  `id` int(11) NOT NULL DEFAULT 0,
  `tumbol_name` varchar(100) NOT NULL,
  `post` int(5) NOT NULL DEFAULT 0,
  `amphure_id` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `amphur_id` (`amphure_id`)
) ENGINE=MyISAM DEFAULT CHARSET=tis620 COLLATE=tis620_thai_ci;

-- ----------------------------
-- Records of tb_tumbol
-- ----------------------------

-- ----------------------------
-- Table structure for tb_user
-- ----------------------------
DROP TABLE IF EXISTS `tb_user`;
CREATE TABLE `tb_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_card` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `line` varchar(255) NOT NULL,
  `line_token` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `image` varchar(255) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `tumbol_id` int(11) NOT NULL DEFAULT 0,
  `amphure_id` int(11) NOT NULL,
  `provicne_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT '',
  `create_date` datetime NOT NULL,
  `last_login` datetime NOT NULL,
  `user_show` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_user
-- ----------------------------
INSERT INTO `tb_user` VALUES ('1', '1234567891012', 'admin', 'no', 'one', 'test1', 'test2', 'test3@hotmail.com', '0800000000', '0000-00-00', 'test3', '1', 'test4', '1', '1', '1', 'test5', 'test6', '0000-00-00 00:00:00', '2024-05-08 00:00:00', '');
INSERT INTO `tb_user` VALUES ('2', '1234567891012', 'admin1', 'no', '', 'test1', 'test2', 'test3@hotmail.com', '0800000000', '0000-00-00', 'test3', '1', 'test4', '1', '1', '1', 'test5', 'test6', '0000-00-00 00:00:00', '2024-05-28 00:00:00', '');
INSERT INTO `tb_user` VALUES ('3', '1234567891012', 'admin2', 'no', 'one', 'test1', 'test2', 'test3@hotmail.com', '0800000000', '0000-00-00', '', '1', 'test4', '1', '1', '1', 'test5', 'test6', '0000-00-00 00:00:00', '2023-06-28 00:00:00', '');

-- ----------------------------
-- Table structure for tb_user_position
-- ----------------------------
DROP TABLE IF EXISTS `tb_user_position`;
CREATE TABLE `tb_user_position` (
  `user_id` int(11) NOT NULL,
  `pos_id` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`pos_id`,`faculty_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Records of tb_user_position
-- ----------------------------
