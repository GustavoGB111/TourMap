/*
  Warnings:

  - A unique constraint covering the columns `[userImageUrl]` on the table `Ponto_Comercial` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userImageUrl]` on the table `Ponto_Turistico` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userImageUrl]` on the table `Travel_Road_Map` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userImageUrl]` on the table `User_Business` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `ponto_comercial` MODIFY `userImageUrl` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `ponto_turistico` ADD COLUMN `userImageUrl` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `travel_road_map` ADD COLUMN `userImageUrl` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user_business` MODIFY `userImageUrl` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user_client` MODIFY `userImageUrl` VARCHAR(191) NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Ponto_Comercial_userImageUrl_key` ON `Ponto_Comercial`(`userImageUrl`);

-- CreateIndex
CREATE UNIQUE INDEX `Ponto_Turistico_userImageUrl_key` ON `Ponto_Turistico`(`userImageUrl`);

-- CreateIndex
CREATE UNIQUE INDEX `Travel_Road_Map_userImageUrl_key` ON `Travel_Road_Map`(`userImageUrl`);

-- CreateIndex
CREATE UNIQUE INDEX `User_Business_userImageUrl_key` ON `User_Business`(`userImageUrl`);
