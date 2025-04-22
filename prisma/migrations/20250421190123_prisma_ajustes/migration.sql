-- CreateTable
CREATE TABLE `Ponto_Turistico` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `creationDate` DATE NOT NULL,
    `reportNumber` INTEGER NOT NULL DEFAULT 0,
    `local` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Ponto_Turistico_local_key`(`local`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
