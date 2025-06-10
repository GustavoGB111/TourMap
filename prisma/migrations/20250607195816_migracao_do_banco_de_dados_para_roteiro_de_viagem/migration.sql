/*
  Warnings:

  - You are about to drop the column `avaliationId` on the `travel_road_map` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `travel_road_map` DROP COLUMN `avaliationId`,
    ADD COLUMN `avaliationValue` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `dataPublication` DATE NULL;

-- CreateTable
CREATE TABLE `_Ponto_ComercialToTravel_Road_Map` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_Ponto_ComercialToTravel_Road_Map_AB_unique`(`A`, `B`),
    INDEX `_Ponto_ComercialToTravel_Road_Map_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Ponto_TuristicoToTravel_Road_Map` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_Ponto_TuristicoToTravel_Road_Map_AB_unique`(`A`, `B`),
    INDEX `_Ponto_TuristicoToTravel_Road_Map_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_Ponto_ComercialToTravel_Road_Map` ADD CONSTRAINT `_Ponto_ComercialToTravel_Road_Map_A_fkey` FOREIGN KEY (`A`) REFERENCES `Ponto_Comercial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Ponto_ComercialToTravel_Road_Map` ADD CONSTRAINT `_Ponto_ComercialToTravel_Road_Map_B_fkey` FOREIGN KEY (`B`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Ponto_TuristicoToTravel_Road_Map` ADD CONSTRAINT `_Ponto_TuristicoToTravel_Road_Map_A_fkey` FOREIGN KEY (`A`) REFERENCES `Ponto_Turistico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Ponto_TuristicoToTravel_Road_Map` ADD CONSTRAINT `_Ponto_TuristicoToTravel_Road_Map_B_fkey` FOREIGN KEY (`B`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
