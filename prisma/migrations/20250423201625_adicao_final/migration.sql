-- DropForeignKey
ALTER TABLE `avaliation` DROP FOREIGN KEY `avaliationsByEmail_fkey`;

-- DropForeignKey
ALTER TABLE `avaliation` DROP FOREIGN KEY `avaliationsById_fkey`;

-- CreateTable
CREATE TABLE `Travel_Road_Map` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `dataPublication` DATE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `idCreator` VARCHAR(191) NOT NULL,
    `avaliationId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Avaliation` ADD CONSTRAINT `Avaliation_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User_Client`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliation` ADD CONSTRAINT `Avaliation_idCreator_fkey` FOREIGN KEY (`idCreator`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Travel_Road_Map` ADD CONSTRAINT `Travel_Road_Map_idCreator_fkey` FOREIGN KEY (`idCreator`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Travel_Road_Map` ADD CONSTRAINT `Travel_Road_Map_avaliationId_fkey` FOREIGN KEY (`avaliationId`) REFERENCES `Avaliation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
