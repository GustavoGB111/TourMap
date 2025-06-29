/*
  Warnings:

  - You are about to drop the `avaliation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `avaliation` DROP FOREIGN KEY `Avaliation_idCreator_fkey`;

-- DropForeignKey
ALTER TABLE `avaliation` DROP FOREIGN KEY `Avaliation_idTravelRoadMap_fkey`;

-- DropForeignKey
ALTER TABLE `avaliation` DROP FOREIGN KEY `Avaliation_userEmail_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_idCreator_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_idTravelRoadMap_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_userEmail_fkey`;

-- DropTable
DROP TABLE `avaliation`;

-- DropTable
DROP TABLE `comment`;

-- CreateTable
CREATE TABLE `CommentRoadMap` (
    `id` VARCHAR(191) NOT NULL,
    `dataPublication` DATE NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `userClientEmail` VARCHAR(191) NOT NULL,
    `idUserClient` VARCHAR(191) NOT NULL,
    `idTravelRoadMap` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommentTouristPoint` (
    `id` VARCHAR(191) NOT NULL,
    `dataPublication` DATE NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `userClientEmail` VARCHAR(191) NOT NULL,
    `idUserClient` VARCHAR(191) NOT NULL,
    `idTouristPoint` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommentCommercialPoint` (
    `id` VARCHAR(191) NOT NULL,
    `dataPublication` DATE NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `userClientEmail` VARCHAR(191) NOT NULL,
    `idUserClient` VARCHAR(191) NOT NULL,
    `idCommercialPoint` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AvaliationRoadMap` (
    `id` VARCHAR(191) NOT NULL,
    `dataPublication` DATE NOT NULL,
    `avaliation` INTEGER NOT NULL,
    `userClientEmail` VARCHAR(191) NOT NULL,
    `idUserClient` VARCHAR(191) NOT NULL,
    `idTravelRoadMap` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AvaliationTouristPoint` (
    `id` VARCHAR(191) NOT NULL,
    `dataPublication` DATE NOT NULL,
    `avaliation` INTEGER NOT NULL,
    `userClientEmail` VARCHAR(191) NOT NULL,
    `idUserClient` VARCHAR(191) NOT NULL,
    `idTouristPoint` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AvaliationCommercialPoint` (
    `id` VARCHAR(191) NOT NULL,
    `dataPublication` DATE NOT NULL,
    `avaliation` INTEGER NOT NULL,
    `userClientEmail` VARCHAR(191) NOT NULL,
    `idUserClient` VARCHAR(191) NOT NULL,
    `idCommercialPoint` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavoriteCommercialPoint` (
    `id` VARCHAR(191) NOT NULL,
    `Favorite` BOOLEAN NOT NULL DEFAULT false,
    `idUserClient` VARCHAR(191) NOT NULL,
    `idCommercialPoint` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavoriteTouristPoint` (
    `id` VARCHAR(191) NOT NULL,
    `Favorite` BOOLEAN NOT NULL DEFAULT false,
    `idUserClient` VARCHAR(191) NOT NULL,
    `idTouristPoint` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavoriteRoadMap` (
    `id` VARCHAR(191) NOT NULL,
    `Favorite` BOOLEAN NOT NULL DEFAULT false,
    `idUserClient` VARCHAR(191) NOT NULL,
    `idRoadMap` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CommentRoadMap` ADD CONSTRAINT `CommentRoadMap_userClientEmail_fkey` FOREIGN KEY (`userClientEmail`) REFERENCES `User_Client`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentRoadMap` ADD CONSTRAINT `CommentRoadMap_idUserClient_fkey` FOREIGN KEY (`idUserClient`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentRoadMap` ADD CONSTRAINT `CommentRoadMap_idTravelRoadMap_fkey` FOREIGN KEY (`idTravelRoadMap`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentTouristPoint` ADD CONSTRAINT `CommentTouristPoint_userClientEmail_fkey` FOREIGN KEY (`userClientEmail`) REFERENCES `User_Client`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentTouristPoint` ADD CONSTRAINT `CommentTouristPoint_idUserClient_fkey` FOREIGN KEY (`idUserClient`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentTouristPoint` ADD CONSTRAINT `CommentTouristPoint_idTouristPoint_fkey` FOREIGN KEY (`idTouristPoint`) REFERENCES `Ponto_Turistico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentCommercialPoint` ADD CONSTRAINT `CommentCommercialPoint_userClientEmail_fkey` FOREIGN KEY (`userClientEmail`) REFERENCES `User_Client`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentCommercialPoint` ADD CONSTRAINT `CommentCommercialPoint_idUserClient_fkey` FOREIGN KEY (`idUserClient`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentCommercialPoint` ADD CONSTRAINT `CommentCommercialPoint_idCommercialPoint_fkey` FOREIGN KEY (`idCommercialPoint`) REFERENCES `Ponto_Comercial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvaliationRoadMap` ADD CONSTRAINT `AvaliationRoadMap_userClientEmail_fkey` FOREIGN KEY (`userClientEmail`) REFERENCES `User_Client`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvaliationRoadMap` ADD CONSTRAINT `AvaliationRoadMap_idUserClient_fkey` FOREIGN KEY (`idUserClient`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvaliationRoadMap` ADD CONSTRAINT `AvaliationRoadMap_idTravelRoadMap_fkey` FOREIGN KEY (`idTravelRoadMap`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvaliationTouristPoint` ADD CONSTRAINT `AvaliationTouristPoint_userClientEmail_fkey` FOREIGN KEY (`userClientEmail`) REFERENCES `User_Client`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvaliationTouristPoint` ADD CONSTRAINT `AvaliationTouristPoint_idUserClient_fkey` FOREIGN KEY (`idUserClient`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvaliationTouristPoint` ADD CONSTRAINT `AvaliationTouristPoint_idTouristPoint_fkey` FOREIGN KEY (`idTouristPoint`) REFERENCES `Ponto_Turistico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvaliationCommercialPoint` ADD CONSTRAINT `AvaliationCommercialPoint_userClientEmail_fkey` FOREIGN KEY (`userClientEmail`) REFERENCES `User_Client`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvaliationCommercialPoint` ADD CONSTRAINT `AvaliationCommercialPoint_idUserClient_fkey` FOREIGN KEY (`idUserClient`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvaliationCommercialPoint` ADD CONSTRAINT `AvaliationCommercialPoint_idCommercialPoint_fkey` FOREIGN KEY (`idCommercialPoint`) REFERENCES `Ponto_Comercial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteCommercialPoint` ADD CONSTRAINT `FavoriteCommercialPoint_idUserClient_fkey` FOREIGN KEY (`idUserClient`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteCommercialPoint` ADD CONSTRAINT `FavoriteCommercialPoint_idCommercialPoint_fkey` FOREIGN KEY (`idCommercialPoint`) REFERENCES `Ponto_Comercial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteTouristPoint` ADD CONSTRAINT `FavoriteTouristPoint_idUserClient_fkey` FOREIGN KEY (`idUserClient`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteTouristPoint` ADD CONSTRAINT `FavoriteTouristPoint_idTouristPoint_fkey` FOREIGN KEY (`idTouristPoint`) REFERENCES `Ponto_Turistico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteRoadMap` ADD CONSTRAINT `FavoriteRoadMap_idUserClient_fkey` FOREIGN KEY (`idUserClient`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteRoadMap` ADD CONSTRAINT `FavoriteRoadMap_idRoadMap_fkey` FOREIGN KEY (`idRoadMap`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
