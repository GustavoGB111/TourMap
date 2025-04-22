-- CreateTable
CREATE TABLE `Ponto_Comercial` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `local` VARCHAR(191) NOT NULL,
    `creationDate` DATE NOT NULL,
    `businessId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Ponto_Comercial_local_key`(`local`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ponto_Comercial` ADD CONSTRAINT `Ponto_Comercial_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `User_Business`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
