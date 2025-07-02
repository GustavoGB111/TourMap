/*
  Warnings:

  - You are about to drop the `notificationroadmap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `notificationroadmap` DROP FOREIGN KEY `notificationRoadMap_idClient_fkey`;

-- DropForeignKey
ALTER TABLE `notificationroadmap` DROP FOREIGN KEY `notificationRoadMap_idRoadMap_fkey`;

-- DropTable
DROP TABLE `notificationroadmap`;
