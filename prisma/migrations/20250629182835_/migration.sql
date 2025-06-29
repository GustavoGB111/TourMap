/*
  Warnings:

  - You are about to drop the column `idAdmin` on the `notificationroadmap` table. All the data in the column will be lost.
  - You are about to drop the column `idAdmin` on the `notificationtouristpoint` table. All the data in the column will be lost.
  - Added the required column `idClient` to the `notificationRoadMap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idClient` to the `notificationTouristPoint` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notificationroadmap` DROP FOREIGN KEY `notificationRoadMap_idAdmin_fkey`;

-- DropForeignKey
ALTER TABLE `notificationtouristpoint` DROP FOREIGN KEY `notificationTouristPoint_idAdmin_fkey`;

-- DropIndex
DROP INDEX `notificationRoadMap_idAdmin_fkey` ON `notificationroadmap`;

-- DropIndex
DROP INDEX `notificationTouristPoint_idAdmin_fkey` ON `notificationtouristpoint`;

-- AlterTable
ALTER TABLE `notificationroadmap` DROP COLUMN `idAdmin`,
    ADD COLUMN `idClient` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `notificationtouristpoint` DROP COLUMN `idAdmin`,
    ADD COLUMN `idClient` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `notificationRoadMap` ADD CONSTRAINT `notificationRoadMap_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificationTouristPoint` ADD CONSTRAINT `notificationTouristPoint_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
