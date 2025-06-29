-- CreateTable
CREATE TABLE `reportTouristPoint` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `idTouristPoint` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reportCommercialPoint` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `idCommercialPoint` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reportRoadMap` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `idRoadMap` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reportTouristPoint` ADD CONSTRAINT `reportTouristPoint_idTouristPoint_fkey` FOREIGN KEY (`idTouristPoint`) REFERENCES `Ponto_Turistico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reportCommercialPoint` ADD CONSTRAINT `reportCommercialPoint_idCommercialPoint_fkey` FOREIGN KEY (`idCommercialPoint`) REFERENCES `Ponto_Comercial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reportRoadMap` ADD CONSTRAINT `reportRoadMap_idRoadMap_fkey` FOREIGN KEY (`idRoadMap`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
