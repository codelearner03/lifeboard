CREATE DATABASE  IF NOT EXISTS `lifeboard_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `lifeboard_db`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: lifeboard_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `goals`
--

DROP TABLE IF EXISTS `goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goals` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` enum('personal','health','learning','finance','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'other',
  `due_date` date DEFAULT NULL,
  `progress` decimal(5,2) NOT NULL DEFAULT '0.00',
  `status` enum('active','completed','expired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_goals_user_id` (`user_id`),
  KEY `idx_goals_status` (`user_id`,`status`),
  CONSTRAINT `fk_goals_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goals`
--

LOCK TABLES `goals` WRITE;
/*!40000 ALTER TABLE `goals` DISABLE KEYS */;
INSERT INTO `goals` VALUES (4,2,'Read 12 Books','Read at least one book per month this year','personal','2026-12-31',25.00,'active','2026-04-26 20:04:24','2026-04-26 20:04:24'),(5,2,'Learn English','Reach B2 level in English by end of year','learning','2026-11-30',45.00,'active','2026-04-26 20:04:24','2026-04-26 20:04:24');
/*!40000 ALTER TABLE `goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habit_logs`
--

DROP TABLE IF EXISTS `habit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habit_logs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `habit_id` int unsigned NOT NULL,
  `log_date` date NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_habit_logs_day` (`habit_id`,`log_date`),
  KEY `idx_habit_logs_habit_id` (`habit_id`),
  KEY `idx_habit_logs_date` (`habit_id`,`log_date`),
  CONSTRAINT `fk_habit_logs_habit` FOREIGN KEY (`habit_id`) REFERENCES `habits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habit_logs`
--

LOCK TABLES `habit_logs` WRITE;
/*!40000 ALTER TABLE `habit_logs` DISABLE KEYS */;
INSERT INTO `habit_logs` VALUES (19,5,'2026-04-22',1,'2026-04-26 20:04:24'),(20,5,'2026-04-23',1,'2026-04-26 20:04:24'),(21,5,'2026-04-24',1,'2026-04-26 20:04:24'),(22,5,'2026-04-25',1,'2026-04-26 20:04:24'),(23,6,'2026-04-20',1,'2026-04-26 20:04:24'),(24,6,'2026-04-21',1,'2026-04-26 20:04:24'),(25,6,'2026-04-22',1,'2026-04-26 20:04:24'),(26,6,'2026-04-23',1,'2026-04-26 20:04:24'),(27,6,'2026-04-24',1,'2026-04-26 20:04:24'),(28,6,'2026-04-25',1,'2026-04-26 20:04:24'),(29,7,'2026-04-25',1,'2026-04-26 20:04:24');
/*!40000 ALTER TABLE `habit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habits`
--

DROP TABLE IF EXISTS `habits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habits` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `goal_id` int unsigned DEFAULT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `frequency` enum('daily','weekly') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'daily',
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'star',
  `streak` int unsigned NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_habits_user_id` (`user_id`),
  KEY `idx_habits_goal_id` (`goal_id`),
  CONSTRAINT `fk_habits_goal` FOREIGN KEY (`goal_id`) REFERENCES `goals` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_habits_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habits`
--

LOCK TABLES `habits` WRITE;
/*!40000 ALTER TABLE `habits` DISABLE KEYS */;
INSERT INTO `habits` VALUES (5,2,4,'Read 30 Minutes','Read at least 30 minutes before bed','daily','book',4,'2026-04-26 20:04:24','2026-04-26 20:04:24'),(6,2,5,'English Practice','Practice English with Duolingo or similar','daily','globe',6,'2026-04-26 20:04:24','2026-04-26 20:04:24'),(7,2,NULL,'Meditate','Meditate for 10 minutes in the morning','daily','brain',1,'2026-04-26 20:04:24','2026-04-26 20:04:24');
/*!40000 ALTER TABLE `habits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `life_scores`
--

DROP TABLE IF EXISTS `life_scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `life_scores` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `score` decimal(5,2) NOT NULL DEFAULT '0.00',
  `habits_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `tasks_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `goals_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `score_date` date NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_life_scores_day` (`user_id`,`score_date`),
  KEY `idx_life_scores_user_date` (`user_id`,`score_date`),
  CONSTRAINT `fk_life_scores_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `life_scores`
--

LOCK TABLES `life_scores` WRITE;
/*!40000 ALTER TABLE `life_scores` DISABLE KEYS */;
INSERT INTO `life_scores` VALUES (6,2,26.25,0.00,50.00,35.00,'2026-04-26','2026-04-26 20:04:42');
/*!40000 ALTER TABLE `life_scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `goal_id` int unsigned DEFAULT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `priority` enum('high','medium','low') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `status` enum('pending','in_progress','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `due_date` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tasks_user_id` (`user_id`),
  KEY `idx_tasks_status` (`user_id`,`status`),
  KEY `idx_tasks_goal_id` (`goal_id`),
  CONSTRAINT `fk_tasks_goal` FOREIGN KEY (`goal_id`) REFERENCES `goals` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (7,2,4,'Buy book: Atomic Habits','Purchase physical or digital copy','low','completed','2026-04-10','2026-04-26 20:04:24','2026-04-26 20:04:24'),(8,2,4,'Finish Atomic Habits','Read and take notes on Atomic Habits','medium','in_progress','2026-04-30','2026-04-26 20:04:24','2026-04-26 20:04:24'),(9,2,5,'Sign up for English course','Find and register for an online B2 English course','high','completed','2026-04-18','2026-04-26 20:04:24','2026-04-26 20:04:24'),(10,2,NULL,'Create LinkedIn profile','Set up professional LinkedIn profile with portfolio','medium','pending','2026-05-10','2026-04-26 20:04:24','2026-04-26 20:04:24');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Alex Rivera','alex@lifeboard.com','$2a$10$seed_hash_alex_placeholder','2026-04-26 20:04:24','2026-04-26 20:04:24'),(3,'Jordan Smith','jordan@lifeboard.com','$2a$10$seed_hash_jordan_placeholder','2026-04-26 20:04:24','2026-04-26 20:04:24');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'lifeboard_db'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_calculate_life_score` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_calculate_life_score`(IN p_user_id INT UNSIGNED)
BEGIN
    DECLARE v_habits_pct    DECIMAL(5,2) DEFAULT 0.00;
    DECLARE v_tasks_pct     DECIMAL(5,2) DEFAULT 0.00;
    DECLARE v_goals_pct     DECIMAL(5,2) DEFAULT 0.00;
    DECLARE v_final_score   DECIMAL(5,2) DEFAULT 0.00;
    DECLARE v_today         DATE DEFAULT CURDATE();

    -- ── 1. % de hábitos completados hoy ──────────────────────────
    SELECT
        CASE 
            WHEN COUNT(h.id) = 0 THEN 0
            ELSE ROUND(
                (COUNT(hl.id) / COUNT(h.id)) * 100, 2
            )
        END INTO v_habits_pct
    FROM habits h
    LEFT JOIN habit_logs hl 
        ON hl.habit_id = h.id 
        AND hl.log_date = v_today
        AND hl.completed = 1
    WHERE h.user_id = p_user_id;

    -- ── 2. % de tareas completadas ───────────────────────────────
    SELECT
        CASE 
            WHEN COUNT(id) = 0 THEN 0
            ELSE ROUND(
                (SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) 
                / COUNT(id)) * 100, 2
            )
        END INTO v_tasks_pct
    FROM tasks
    WHERE user_id = p_user_id;

    -- ── 3. Promedio de progreso de metas activas ─────────────────
    SELECT
        CASE 
            WHEN COUNT(id) = 0 THEN 0
            ELSE ROUND(AVG(progress), 2)
        END INTO v_goals_pct
    FROM goals
    WHERE user_id = p_user_id
    AND status = 'active';

    -- ── 4. Calcular score final ──────────────────────────────────
    SET v_final_score = ROUND(
        (v_habits_pct * 0.40) + 
        (v_tasks_pct  * 0.35) + 
        (v_goals_pct  * 0.25), 
    2);

    -- ── 5. Insertar o actualizar el score del día ────────────────
    INSERT INTO life_scores 
        (user_id, score, habits_pct, tasks_pct, goals_pct, score_date)
    VALUES 
        (p_user_id, v_final_score, v_habits_pct, v_tasks_pct, v_goals_pct, v_today)
    ON DUPLICATE KEY UPDATE
        score       = v_final_score,
        habits_pct  = v_habits_pct,
        tasks_pct   = v_tasks_pct,
        goals_pct   = v_goals_pct;

    -- ── 6. Retornar el resultado ─────────────────────────────────
    SELECT 
        v_final_score   AS score,
        v_habits_pct    AS habits_pct,
        v_tasks_pct     AS tasks_pct,
        v_goals_pct     AS goals_pct,
        v_today         AS score_date;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-26 20:17:51
