/*
  Warnings:

  - You are about to drop the column `countryName` on the `country` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Country` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `city` DROP FOREIGN KEY `City_countryName_fkey`;

-- DropForeignKey
ALTER TABLE `state` DROP FOREIGN KEY `State_countryName_fkey`;

-- DropIndex
DROP INDEX `Country_countryName_key` ON `country`;

-- AlterTable
ALTER TABLE `country` DROP COLUMN `countryName`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Country_name_key` ON `Country`(`name`);

-- AddForeignKey
ALTER TABLE `State` ADD CONSTRAINT `State_countryName_fkey` FOREIGN KEY (`countryName`) REFERENCES `Country`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_countryName_fkey` FOREIGN KEY (`countryName`) REFERENCES `Country`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
