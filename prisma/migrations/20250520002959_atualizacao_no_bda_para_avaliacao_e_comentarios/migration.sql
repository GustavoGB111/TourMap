/*
  Warnings:

  - Added the required column `idTravelRoadMap` to the `Avaliation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idTravelRoadMap` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `travel_road_map` DROP FOREIGN KEY `Travel_Road_Map_avaliationId_fkey`;

-- DropIndex
DROP INDEX `Travel_Road_Map_avaliationId_fkey` ON `travel_road_map`;

-- AlterTable
ALTER TABLE `avaliation` ADD COLUMN `idTravelRoadMap` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `idTravelRoadMap` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_idTravelRoadMap_fkey` FOREIGN KEY (`idTravelRoadMap`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliation` ADD CONSTRAINT `Avaliation_idTravelRoadMap_fkey` FOREIGN KEY (`idTravelRoadMap`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
