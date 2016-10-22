/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : paineladmin

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2015-05-18 06:41:16
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `chat_attaches`
-- ----------------------------
DROP TABLE IF EXISTS `chat_attaches`;
CREATE TABLE `chat_attaches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_hash` varchar(32) DEFAULT NULL,
  `chat_hash` varchar(32) DEFAULT NULL,
  `hash` varchar(32) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `message_reference` int(11) DEFAULT NULL,
  `time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of chat_attaches
-- ----------------------------

-- ----------------------------
-- Table structure for `chat_groups`
-- ----------------------------
DROP TABLE IF EXISTS `chat_groups`;
CREATE TABLE `chat_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `hash` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of chat_groups
-- ----------------------------
INSERT INTO `chat_groups` VALUES ('1', '2015-04-27 19:36:37', '684f2866f24b210efb9c7695a6668c1c');
INSERT INTO `chat_groups` VALUES ('2', '2015-04-28 12:17:10', '0538d2f832ffb3aed5b49bb9be54e789');
INSERT INTO `chat_groups` VALUES ('3', '2015-04-28 12:21:14', '5da5b1b0d3884a16638ca521358f6be9');
INSERT INTO `chat_groups` VALUES ('4', '2015-04-28 12:21:36', '5156735836ee65ea22293b3a88dc59c0');
INSERT INTO `chat_groups` VALUES ('5', '2015-04-28 12:22:58', '9959631d12c6023369d0cd1147595f48');

-- ----------------------------
-- Table structure for `chat_groups_users`
-- ----------------------------
DROP TABLE IF EXISTS `chat_groups_users`;
CREATE TABLE `chat_groups_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_hash` varchar(32) DEFAULT NULL,
  `group_hash` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of chat_groups_users
-- ----------------------------
INSERT INTO `chat_groups_users` VALUES ('1', '6a7902e2328a819db5c5dce36311dc64', '684f2866f24b210efb9c7695a6668c1c');
INSERT INTO `chat_groups_users` VALUES ('2', '7aa6ac4381fa45f99a2e672dd5346bd4', '684f2866f24b210efb9c7695a6668c1c');
INSERT INTO `chat_groups_users` VALUES ('3', '8d8dc8365532102b95949085d2c28b7f', '684f2866f24b210efb9c7695a6668c1c');
INSERT INTO `chat_groups_users` VALUES ('4', 'f6fdffe48c908deb0f4c3bd36c032e72', '684f2866f24b210efb9c7695a6668c1c');
INSERT INTO `chat_groups_users` VALUES ('5', '6a7902e2328a819db5c5dce36311dc64', '0538d2f832ffb3aed5b49bb9be54e789');
INSERT INTO `chat_groups_users` VALUES ('6', '8d8dc8365532102b95949085d2c28b7f', '0538d2f832ffb3aed5b49bb9be54e789');
INSERT INTO `chat_groups_users` VALUES ('7', 'f6fdffe48c908deb0f4c3bd36c032e72', '0538d2f832ffb3aed5b49bb9be54e789');
INSERT INTO `chat_groups_users` VALUES ('8', 'f6fdffe48c908deb0f4c3bd36c032e72', '0538d2f832ffb3aed5b49bb9be54e789');
INSERT INTO `chat_groups_users` VALUES ('9', '6a7902e2328a819db5c5dce36311dc64', '5da5b1b0d3884a16638ca521358f6be9');
INSERT INTO `chat_groups_users` VALUES ('10', '8d8dc8365532102b95949085d2c28b7f', '5da5b1b0d3884a16638ca521358f6be9');
INSERT INTO `chat_groups_users` VALUES ('11', 'f6fdffe48c908deb0f4c3bd36c032e72', '5da5b1b0d3884a16638ca521358f6be9');
INSERT INTO `chat_groups_users` VALUES ('12', '6a7902e2328a819db5c5dce36311dc64', '5156735836ee65ea22293b3a88dc59c0');
INSERT INTO `chat_groups_users` VALUES ('13', '7aa6ac4381fa45f99a2e672dd5346bd4', '5156735836ee65ea22293b3a88dc59c0');
INSERT INTO `chat_groups_users` VALUES ('14', 'f6fdffe48c908deb0f4c3bd36c032e72', '5156735836ee65ea22293b3a88dc59c0');
INSERT INTO `chat_groups_users` VALUES ('15', '7aa6ac4381fa45f99a2e672dd5346bd4', '9959631d12c6023369d0cd1147595f48');
INSERT INTO `chat_groups_users` VALUES ('16', '8d8dc8365532102b95949085d2c28b7f', '9959631d12c6023369d0cd1147595f48');
INSERT INTO `chat_groups_users` VALUES ('17', 'f6fdffe48c908deb0f4c3bd36c032e72', '9959631d12c6023369d0cd1147595f48');

-- ----------------------------
-- Table structure for `chat_messages`
-- ----------------------------
DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_hash` varchar(32) DEFAULT NULL,
  `message` text,
  `sender` varchar(32) DEFAULT NULL,
  `receiver` varchar(32) DEFAULT NULL,
  `time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `has_attach` int(11) DEFAULT NULL,
  `attach_reference` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of chat_messages
-- ----------------------------
INSERT INTO `chat_messages` VALUES ('1', '684f2866f24b210efb9c7695a6668c1c', 'Oi', '7aa6ac4381fa45f99a2e672dd5346bd4', null, '2015-04-27 19:38:12', null, null);
INSERT INTO `chat_messages` VALUES ('2', '684f2866f24b210efb9c7695a6668c1c', 'Oiii', 'f6fdffe48c908deb0f4c3bd36c032e72', null, '2015-04-27 19:38:14', null, null);
INSERT INTO `chat_messages` VALUES ('3', '684f2866f24b210efb9c7695a6668c1c', 'Tchau', '7aa6ac4381fa45f99a2e672dd5346bd4', null, '2015-04-27 19:38:19', null, null);
INSERT INTO `chat_messages` VALUES ('4', '', 'oi', '7aa6ac4381fa45f99a2e672dd5346bd4', 'f6fdffe48c908deb0f4c3bd36c032e72', '2015-04-28 11:04:18', null, null);
INSERT INTO `chat_messages` VALUES ('5', '', 'oi', 'f6fdffe48c908deb0f4c3bd36c032e72', '6a7902e2328a819db5c5dce36311dc64', '2015-04-28 12:30:56', null, null);

-- ----------------------------
-- Table structure for `chat_users`
-- ----------------------------
DROP TABLE IF EXISTS `chat_users`;
CREATE TABLE `chat_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_reference` varchar(32) DEFAULT NULL,
  `group_reference` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of chat_users
-- ----------------------------
INSERT INTO `chat_users` VALUES ('1', '', '2ec8b7810f8ddccbe94ca8a3e1bdb3c1');

-- ----------------------------
-- Table structure for `files`
-- ----------------------------
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_hash` varchar(32) NOT NULL,
  `parent` int(11) DEFAULT NULL,
  `is_root` int(11) DEFAULT '0',
  `is_folder` int(11) DEFAULT '0',
  `file_name` varchar(50) NOT NULL,
  `file_type` varchar(80) DEFAULT NULL,
  `file_hash` varchar(32) DEFAULT NULL,
  `deleted` int(1) DEFAULT '0',
  `file_info` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of files
-- ----------------------------
INSERT INTO `files` VALUES ('1', '8d8dc8365532102b95949085d2c28b7f', '0', '1', '0', 'circular263.png', 'image/png', 'e619ba79d3738a7584e51c07e37c3f3e', '1', '{\"size\":85051,\"c_time\":\"17/05/2015 06:28:44\",\"m_time\":\"17/05/2015 06:28:44\",\"a_time\":\"17/05/2015 06:28:44\",\"perms\":[\"abrir\",\"mover\",\"renomear\",\"compartilhar\",\"remover\",\"download\",\"detalhes\"],\"type\":\".png (image/png)\"}');
INSERT INTO `files` VALUES ('2', '8d8dc8365532102b95949085d2c28b7f', '5', '0', '0', 'cards.psd', 'application/octet-stream', 'f487cf33974850b1c6b4a0a014b42629', '0', '{\"size\":12956752,\"c_time\":\"17/05/2015 06:28:49\",\"m_time\":\"17/05/2015 06:28:50\",\"a_time\":\"17/05/2015 06:28:49\",\"perms\":[\"abrir\",\"mover\",\"renomear\",\"compartilhar\",\"remover\",\"download\",\"detalhes\"],\"type\":\".psd (application/octet-stream)\"}');
INSERT INTO `files` VALUES ('3', '8d8dc8365532102b95949085d2c28b7f', '0', '1', '0', 'icons_public.psd', 'application/octet-stream', '69bd07007dcb58ea1e348e741288a277', '1', '{\"size\":3553244,\"c_time\":\"17/05/2015 06:28:56\",\"m_time\":\"17/05/2015 06:28:56\",\"a_time\":\"17/05/2015 06:28:56\",\"perms\":[\"abrir\",\"mover\",\"renomear\",\"compartilhar\",\"remover\",\"download\",\"detalhes\"],\"type\":\".psd (application/octet-stream)\"}');
INSERT INTO `files` VALUES ('4', '8d8dc8365532102b95949085d2c28b7f', '0', '1', '0', 'animate.css', 'text/css', '1d7c5ebc0b23aa45bf341a9c6fb600cb', '1', '{\"size\":68796,\"c_time\":\"17/05/2015 06:29:07\",\"m_time\":\"17/05/2015 06:29:07\",\"a_time\":\"17/05/2015 06:29:07\",\"perms\":[\"abrir\",\"mover\",\"renomear\",\"compartilhar\",\"remover\",\"download\",\"detalhes\"],\"type\":\".css (text/css)\"}');
INSERT INTO `files` VALUES ('5', '8d8dc8365532102b95949085d2c28b7f', null, '1', '1', 'Icones', null, null, '0', null);
INSERT INTO `files` VALUES ('6', '8d8dc8365532102b95949085d2c28b7f', '0', '1', '0', 'info.txt', 'text/plain', '58f40734d10ab34cca179bddf85229d6', '0', '{\"size\":25,\"c_time\":\"17/05/2015 07:03:26\",\"m_time\":\"17/05/2015 07:03:26\",\"a_time\":\"17/05/2015 07:03:26\",\"perms\":[\"abrir\",\"mover\",\"renomear\",\"compartilhar\",\"remover\",\"link\",\"download\",\"detalhes\"],\"type\":\".txt (text/plain)\"}');
INSERT INTO `files` VALUES ('7', '8d8dc8365532102b95949085d2c28b7f', '0', '1', '0', 'natacao_das_teta_reg_66283.3gp', 'video/3gpp', '28ae20d9789c4db4c8f7129fe1e081b0', '1', '{\"size\":2494529,\"c_time\":\"17/05/2015 07:13:08\",\"m_time\":\"17/05/2015 07:13:08\",\"a_time\":\"17/05/2015 07:13:08\",\"perms\":[\"abrir\",\"renomear\",\"mover\",\"compartilhar\",\"download\",\"link\",\"favoritar\",\"detalhes\",\"remover\"],\"type\":\".3gp (video/3gpp)\"}');
INSERT INTO `files` VALUES ('8', '8d8dc8365532102b95949085d2c28b7f', '0', '1', '0', '15396468256_14b27f7d23_o.jpg', 'image/jpeg', 'f39e41d7cb2a99eac5f84fd1f819df59', '0', '{\"size\":2124415,\"c_time\":\"18/05/2015 03:36:40\",\"m_time\":\"18/05/2015 03:36:40\",\"a_time\":\"18/05/2015 03:36:40\",\"perms\":[\"abrir\",\"renomear\",\"mover\",\"compartilhar\",\"download\",\"link\",\"favoritar\",\"detalhes\",\"remover\"],\"type\":\".jpg (image/jpeg)\"}');
INSERT INTO `files` VALUES ('9', '7aa6ac4381fa45f99a2e672dd5346bd4', '0', '1', '0', 'palmeiras_wallpaper_02.jpg', 'image/jpeg', '3642e35e7913548e017917da2f3915eb', '0', '{\"size\":147987,\"c_time\":\"18/05/2015 04:23:46\",\"m_time\":\"18/05/2015 04:24:12\",\"a_time\":\"18/05/2015 04:23:46\",\"perms\":[\"abrir\",\"renomear\",\"mover\",\"compartilhar\",\"download\",\"link\",\"favoritar\",\"detalhes\",\"remover\"],\"type\":\".jpg (image/jpeg)\"}');

-- ----------------------------
-- Table structure for `files_meta`
-- ----------------------------
DROP TABLE IF EXISTS `files_meta`;
CREATE TABLE `files_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` varchar(255) DEFAULT NULL,
  `file_id` int(32) DEFAULT NULL,
  `user_hash` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of files_meta
-- ----------------------------
INSERT INTO `files_meta` VALUES ('1', 'perms', 'abrir,renomear', '1', '8d8dc8365532102b95949085d2c28b7f');
INSERT INTO `files_meta` VALUES ('3', 'perms', 'abrir,renomear', '6', '7aa6ac4381fa45f99a2e672dd5346bd4');

-- ----------------------------
-- Table structure for `global_config`
-- ----------------------------
DROP TABLE IF EXISTS `global_config`;
CREATE TABLE `global_config` (
  `name` varchar(255) DEFAULT NULL,
  `logo` text,
  `menuToggle` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of global_config
-- ----------------------------
INSERT INTO `global_config` VALUES ('ADA', null, '1');

-- ----------------------------
-- Table structure for `mail`
-- ----------------------------
DROP TABLE IF EXISTS `mail`;
CREATE TABLE `mail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from` varchar(255) DEFAULT NULL,
  `to` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text,
  `date` datetime DEFAULT NULL,
  `read` int(11) DEFAULT NULL,
  `folder` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of mail
-- ----------------------------
INSERT INTO `mail` VALUES ('1', 'hacebe@gmail.com', 'rhas@gmail.com', 'Teste', 'Mensagem de Teste', '2015-04-11 17:31:50', '0', '1');
INSERT INTO `mail` VALUES ('2', 'rhas@gmail.com', 'hacebe@gmail.com', 'Teste 2', 'Outra Mensagem', '2015-04-11 17:32:20', '0', '1');

-- ----------------------------
-- Table structure for `menus`
-- ----------------------------
DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu` varchar(100) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `key` varchar(50) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `divider` int(11) DEFAULT '0',
  `parameters` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of menus
-- ----------------------------
INSERT INTO `menus` VALUES ('1', 'Usuarios', '12', '#/users', 'md md-group', '4', '0', null);
INSERT INTO `menus` VALUES ('4', 'Páginas', '12', '', 'md md-content-copy', '3', '0', null);
INSERT INTO `menus` VALUES ('5', 'Listar Páginas', '4', '#/pages/list', '', null, '0', null);
INSERT INTO `menus` VALUES ('6', 'Nova Página', '4', '#/pages/add', '', null, '0', null);
INSERT INTO `menus` VALUES ('7', 'Emails', '13', '', 'md md-mail', '2', '0', null);
INSERT INTO `menus` VALUES ('8', 'Caixa de Entrada', '7', '#/email/inbox', null, null, '0', null);
INSERT INTO `menus` VALUES ('9', 'Escrever', '7', '#/email/new', null, null, '0', null);
INSERT INTO `menus` VALUES ('10', 'Dashboard', '12', '#/dashboard', 'md md-dashboard', '1', '0', null);
INSERT INTO `menus` VALUES ('11', 'Chat', '13', '#/chat', 'md md-chat', '1', '0', null);
INSERT INTO `menus` VALUES ('12', 'CMS', '0', null, null, null, '1', null);
INSERT INTO `menus` VALUES ('13', 'Menu', '0', null, null, null, '1', null);
INSERT INTO `menus` VALUES ('14', 'Configuracoes do Sistema', '13', '.preventClick', 'md md-settings', '9', '0', 'data-toggle=\"modal\"');
INSERT INTO `menus` VALUES ('15', 'Relatórios', '12', '#/reports', 'md md-description', '4', '0', null);
INSERT INTO `menus` VALUES ('16', 'Chat', '15', '#/reports/chat', null, '1', '0', null);
INSERT INTO `menus` VALUES ('17', 'Diretório', '13', '#/', 'md md-public', '5', '0', null);

-- ----------------------------
-- Table structure for `priorities`
-- ----------------------------
DROP TABLE IF EXISTS `priorities`;
CREATE TABLE `priorities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of priorities
-- ----------------------------
INSERT INTO `priorities` VALUES ('1', 'Nivel 1');
INSERT INTO `priorities` VALUES ('2', 'Nivel 2');
INSERT INTO `priorities` VALUES ('3', 'Nivel 3');
INSERT INTO `priorities` VALUES ('4', 'Nivel 4');
INSERT INTO `priorities` VALUES ('5', 'Nivel 5');
INSERT INTO `priorities` VALUES ('6', 'Nivel 6');
INSERT INTO `priorities` VALUES ('7', 'Nivel 7');

-- ----------------------------
-- Table structure for `priority_meta`
-- ----------------------------
DROP TABLE IF EXISTS `priority_meta`;
CREATE TABLE `priority_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `priority_id` int(11) DEFAULT NULL,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of priority_meta
-- ----------------------------
INSERT INTO `priority_meta` VALUES ('1', '7', 'allow_menu', '1');
INSERT INTO `priority_meta` VALUES ('2', '7', 'allow_menu', '2');
INSERT INTO `priority_meta` VALUES ('3', '7', 'allow_menu', '3');
INSERT INTO `priority_meta` VALUES ('4', '7', 'allow_menu', '4');
INSERT INTO `priority_meta` VALUES ('5', '7', 'allow_menu', '5');
INSERT INTO `priority_meta` VALUES ('6', '7', 'allow_menu', '6');
INSERT INTO `priority_meta` VALUES ('7', '6', 'allow_menu', '1');
INSERT INTO `priority_meta` VALUES ('8', '6', 'allow_menu', '2');
INSERT INTO `priority_meta` VALUES ('9', '6', 'allow_menu', '4');
INSERT INTO `priority_meta` VALUES ('10', '6', 'allow_menu', '5');
INSERT INTO `priority_meta` VALUES ('11', '7', 'allow_menu', '7');
INSERT INTO `priority_meta` VALUES ('12', '7', 'allow_menu', '8');
INSERT INTO `priority_meta` VALUES ('13', '7', 'allow_menu', '9');
INSERT INTO `priority_meta` VALUES ('14', '7', 'allow_menu', '10');
INSERT INTO `priority_meta` VALUES ('15', '7', 'allow_menu', '11');
INSERT INTO `priority_meta` VALUES ('16', '7', 'allow_menu', '12');
INSERT INTO `priority_meta` VALUES ('17', '7', 'allow_menu', '13');
INSERT INTO `priority_meta` VALUES ('18', '6', 'allow_menu', '12');
INSERT INTO `priority_meta` VALUES ('19', '6', 'allow_menu', '13');
INSERT INTO `priority_meta` VALUES ('20', '7', 'allow_menu', '14');
INSERT INTO `priority_meta` VALUES ('21', '7', 'allow_menu', '15');
INSERT INTO `priority_meta` VALUES ('22', '7', 'allow_menu', '16');
INSERT INTO `priority_meta` VALUES ('23', '7', 'allow_menu', '17');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `username` varchar(32) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `hash` varchar(32) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `priority` int(11) DEFAULT NULL,
  `lastlogin` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `user_img` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'Administrador', 'admin', '21232f297a57a5a743894a0e4a801fc3', 'f6fdffe48c908deb0f4c3bd36c032e72', '1', '7', '2015-05-11 13:28:55', 'https://s3.amazonaws.com/uifaces/faces/twitter/gerrenlamson/128.jpg');
INSERT INTO `users` VALUES ('2', 'Rodrigo', 'rodrigo', '21232f297a57a5a743894a0e4a801fc3', '8d8dc8365532102b95949085d2c28b7f', '1', '7', '2015-05-11 13:29:11', 'https://s3.amazonaws.com/uifaces/faces/twitter/jsa/128.jpg');
INSERT INTO `users` VALUES ('3', 'Vinicius Hacebe', 'hacebe', '4badaee57fed5610012a296273158f5f', '7aa6ac4381fa45f99a2e672dd5346bd4', '1', '7', '2015-05-11 13:29:14', 'https://s3.amazonaws.com/uifaces/faces/twitter/mlane/128.jpg');
INSERT INTO `users` VALUES ('4', 'Alan Dutra', 'alan', '349e772ae1fae0c0db7edca5e1fdae1d', '6a7902e2328a819db5c5dce36311dc64', '1', '7', '2015-05-11 13:29:16', 'https://s3.amazonaws.com/uifaces/faces/twitter/rem/128.jpg');
