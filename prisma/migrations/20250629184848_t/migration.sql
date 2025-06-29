/*
  Warnings:

  - A unique constraint covering the columns `[idUserReport]` on the table `reportCommercialPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idRoadMap]` on the table `reportRoadMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUserReport]` on the table `reportRoadMap` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idUserReport` to the `reportCommercialPoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUserReport` to the `reportRoadMap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUserReport` to the `reportTouristPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reportcommercialpoint` ADD COLUMN `idUserReport` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `reportroadmap` ADD COLUMN `idUserReport` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `reporttouristpoint` ADD COLUMN `idUserReport` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `notificationRoadMap_idClient_idRoadMap_idx` ON `notificationRoadMap`(`idClient`, `idRoadMap`);

-- CreateIndex
CREATE INDEX `notificationTouristPoint_idClient_idTouristPoint_idx` ON `notificationTouristPoint`(`idClient`, `idTouristPoint`);

-- CreateIndex
CREATE UNIQUE INDEX `reportCommercialPoint_idUserReport_key` ON `reportCommercialPoint`(`idUserReport`);

-- CreateIndex
CREATE INDEX `reportCommercialPoint_idCommercialPoint_idUserReport_idx` ON `reportCommercialPoint`(`idCommercialPoint`, `idUserReport`);

-- CreateIndex
CREATE UNIQUE INDEX `reportRoadMap_idRoadMap_key` ON `reportRoadMap`(`idRoadMap`);

-- CreateIndex
CREATE UNIQUE INDEX `reportRoadMap_idUserReport_key` ON `reportRoadMap`(`idUserReport`);

-- CreateIndex
CREATE INDEX `reportRoadMap_idUserReport_idRoadMap_idx` ON `reportRoadMap`(`idUserReport`, `idRoadMap`);

-- CreateIndex
CREATE INDEX `reportTouristPoint_idTouristPoint_idUserReport_idx` ON `reportTouristPoint`(`idTouristPoint`, `idUserReport`);

-- AddForeignKey
ALTER TABLE `reportTouristPoint` ADD CONSTRAINT `reportTouristPoint_idUserReport_fkey` FOREIGN KEY (`idUserReport`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reportCommercialPoint` ADD CONSTRAINT `reportCommercialPoint_idUserReport_fkey` FOREIGN KEY (`idUserReport`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reportRoadMap` ADD CONSTRAINT `reportRoadMap_idUserReport_fkey` FOREIGN KEY (`idUserReport`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
