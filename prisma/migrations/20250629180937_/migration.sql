-- CreateTable
CREATE TABLE `notificationRoadMap` (
    `id` VARCHAR(191) NOT NULL,
    `idAdmin` VARCHAR(191) NOT NULL,
    `idRoadMap` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificationTouristPoint` (
    `id` VARCHAR(191) NOT NULL,
    `idAdmin` VARCHAR(191) NOT NULL,
    `idTouristPoint` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notificationRoadMap` ADD CONSTRAINT `notificationRoadMap_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `User_Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificationRoadMap` ADD CONSTRAINT `notificationRoadMap_idRoadMap_fkey` FOREIGN KEY (`idRoadMap`) REFERENCES `Travel_Road_Map`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificationTouristPoint` ADD CONSTRAINT `notificationTouristPoint_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `User_Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificationTouristPoint` ADD CONSTRAINT `notificationTouristPoint_idTouristPoint_fkey` FOREIGN KEY (`idTouristPoint`) REFERENCES `Ponto_Turistico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
