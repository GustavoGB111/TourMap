-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `dataPublication` DATE NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `idCreator` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avaliation` (
    `id` VARCHAR(191) NOT NULL,
    `dataPublication` DATE NOT NULL,
    `avaliation` INTEGER NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `idCreator` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User_Client`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_idCreator_fkey` FOREIGN KEY (`idCreator`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliation` ADD CONSTRAINT `avaliationsByEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User_Client`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliation` ADD CONSTRAINT `avaliationsById_fkey` FOREIGN KEY (`idCreator`) REFERENCES `User_Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
