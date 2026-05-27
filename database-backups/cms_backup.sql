-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: 172.21.211.109    Database: cms
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin@1234','admin');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `appointment_time` datetime(6) DEFAULT NULL,
  `status` int NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKoeb98n82eph1dx43v3y2bcmsl` (`doctor_id`),
  KEY `FK4apif2ewfyf14077ichee8g06` (`patient_id`),
  CONSTRAINT `FK4apif2ewfyf14077ichee8g06` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`id`),
  CONSTRAINT `FKoeb98n82eph1dx43v3y2bcmsl` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (1,'2026-06-01 09:00:00.000000',0,1,1),(2,'2026-06-02 10:00:00.000000',0,1,2),(3,'2026-06-03 11:00:00.000000',0,2,3),(4,'2026-06-04 14:00:00.000000',0,3,4),(5,'2026-06-05 15:00:00.000000',0,4,5);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `specialty` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (1,'dr.adams@example.com','Dr. Emily Adams','pass12345','5551012020','Cardiologist'),(2,'dr.johnson@example.com','Dr. Mark Johnson','secure4567','5552023030','Neurologist'),(3,'dr.lee@example.com','Dr. Sarah Lee','leePass987','5553034040','Orthopedist'),(4,'dr.wilson@example.com','Dr. Tom Wilson','wils0nPwd','5554045050','Pediatrician'),(5,'dr.brown@example.com','Dr. Alice Brown','brownie123','5555056060','Dermatologist');
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_available_times`
--

DROP TABLE IF EXISTS `doctor_available_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_available_times` (
  `doctor_id` bigint NOT NULL,
  `available_times` varchar(255) DEFAULT NULL,
  KEY `FKdgs10srq75djpwnb9c22k3lmk` (`doctor_id`),
  CONSTRAINT `FKdgs10srq75djpwnb9c22k3lmk` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_available_times`
--

LOCK TABLES `doctor_available_times` WRITE;
/*!40000 ALTER TABLE `doctor_available_times` DISABLE KEYS */;
INSERT INTO `doctor_available_times` VALUES (1,'09:00-10:00'),(1,'10:00-11:00'),(2,'10:00-11:00'),(2,'11:00-12:00'),(3,'09:00-10:00');
/*!40000 ALTER TABLE `doctor_available_times` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES (1,'101 Oak St, Cityville','jane.doe@example.com','Jane Doe','passJane1','8881111111'),(2,'202 Maple Rd, Townsville','john.smith@example.com','John Smith','smithSecure','8882222222'),(3,'303 Pine Ave, Villageton','emily.rose@example.com','Emily Rose','emilyPass99','8883333333'),(4,'404 Birch Ln, Metropolis','michael.j@example.com','Michael Jordan','airmj23','8884444444'),(5,'505 Cedar Blvd, Springfield','olivia.m@example.com','Olivia Moon','moonshine12','8885555555');
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27  8:04:00
