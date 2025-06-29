/*
  Warnings:

  - A unique constraint covering the columns `[userImageUrl]` on the table `User_Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userImageUrl` to the `Ponto_Comercial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userImageUrl` to the `User_Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userImageUrl` to the `User_Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ponto_comercial` ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `reportNumber` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `userImageUrl` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ponto_turistico` ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user_business` ADD COLUMN `userImageUrl` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user_client` ADD COLUMN `userImageUrl` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Country` (
    `id` VARCHAR(191) NOT NULL,
    `countryName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Country_countryName_key`(`countryName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `State` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `countryName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `State_name_key`(`name`),
    UNIQUE INDEX `State_countryName_key`(`countryName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `countryName` VARCHAR(191) NOT NULL,
    `stateName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `City_name_key`(`name`),
    UNIQUE INDEX `City_countryName_key`(`countryName`),
    UNIQUE INDEX `City_stateName_key`(`stateName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImageTouristPoint` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `idTouristPoint` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ImageTouristPoint_image_key`(`image`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImageCommercialPoint` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `idCommercialPoint` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ImageCommercialPoint_image_key`(`image`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImageRoadMap` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `idRoadMap` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ImageRoadMap_image_key`(`image`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CountryToTravel_Road_Map` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CountryToTravel_Road_Map_AB_unique`(`A`, `B`),
    INDEX `_CountryToTravel_Road_Map_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_StateToTravel_Road_Map` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_StateToTravel_Road_Map_AB_unique`(`A`, `B`),
    INDEX `_StateToTravel_Road_Map_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CityToTravel_Road_Map` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CityToTravel_Road_Map_AB_unique`(`A`, `B`),
    INDEX `_CityToTravel_Road_Map_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `AvaliationCommercialPoint_idCommercialPoint_idUserClient_idx` ON `AvaliationCommercialPoint`(`idCommercialPoint`, `idUserClient`);

-- CreateIndex
CREATE INDEX `AvaliationRoadMap_idTravelRoadMap_idUserClient_idx` ON `AvaliationRoadMap`(`idTravelRoadMap`, `idUserClient`);

-- CreateIndex
CREATE INDEX `AvaliationTouristPoint_idTouristPoint_idUserClient_idx` ON `AvaliationTouristPoint`(`idTouristPoint`, `idUserClient`);

-- CreateIndex
CREATE INDEX `CommentCommercialPoint_idCommercialPoint_idUserClient_idx` ON `CommentCommercialPoint`(`idCommercialPoint`, `idUserClient`);

-- CreateIndex
CREATE INDEX `CommentRoadMap_idTravelRoadMap_idUserClient_idx` ON `CommentRoadMap`(`idTravelRoadMap`, `idUserClient`);

-- CreateIndex
CREATE INDEX `CommentTouristPoint_idTouristPoint_idUserClient_idx` ON `CommentTouristPoint`(`idTouristPoint`, `idUserClient`);

-- CreateIndex
CREATE INDEX `FavoriteCommercialPoint_idCommercialPoint_idUserClient_idx` ON `FavoriteCommercialPoint`(`idCommercialPoint`, `idUserClient`);

-- CreateIndex
CREATE INDEX `FavoriteRoadMap_idUserClient_idRoadMap_idx` ON `FavoriteRoadMap`(`idUserClient`, `idRoadMap`);

-- CreateIndex
CREATE INDEX `FavoriteTouristPoint_idTouristPoint_idUserClient_idx` ON `FavoriteTouristPoint`(`idTouristPoint`, `idUserClient`);

-- CreateIndex
CREATE UNIQUE INDEX `User_Client_userImageUrl_key` ON `User_Client`(`userImageUrl`);

-- AddForeignKey
ALTER TABLE `State` ADD CONSTRAINT `State_countryName_fkey` FOREIGN KEY (`countryName`) REFERENCES `Country`(`countryName`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_stateName_fkey` FOREIGN KEY (`stateName`) REFERENCES `State`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_countryName_fkey` FOREIGN KEY (`countryName`) REFERENCES `Country`(`countryName`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageTouristPoint` ADD CONSTRAINT `ImageTouristPoint_idTouristPoint_fkey` FOREIGN KEY (`idTouristPoint`) REFERENCES `Ponto_Turistico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageCommercialPoint` ADD CONSTRAINT `ImageCommercialPoint_idCommercialPoint_fkey` FOREIGN KEY (`idCommercialPoint`) REFERENCES `Ponto_Comercial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageRoadMap` ADD CONSTRAINT `ImageRoadMap_idRoadMap_fkey` FOREIGN KEY (`idRoadMap`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CountryToTravel_Road_Map` ADD CONSTRAINT `_CountryToTravel_Road_Map_A_fkey` FOREIGN KEY (`A`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CountryToTravel_Road_Map` ADD CONSTRAINT `_CountryToTravel_Road_Map_B_fkey` FOREIGN KEY (`B`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StateToTravel_Road_Map` ADD CONSTRAINT `_StateToTravel_Road_Map_A_fkey` FOREIGN KEY (`A`) REFERENCES `State`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StateToTravel_Road_Map` ADD CONSTRAINT `_StateToTravel_Road_Map_B_fkey` FOREIGN KEY (`B`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CityToTravel_Road_Map` ADD CONSTRAINT `_CityToTravel_Road_Map_A_fkey` FOREIGN KEY (`A`) REFERENCES `City`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CityToTravel_Road_Map` ADD CONSTRAINT `_CityToTravel_Road_Map_B_fkey` FOREIGN KEY (`B`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
