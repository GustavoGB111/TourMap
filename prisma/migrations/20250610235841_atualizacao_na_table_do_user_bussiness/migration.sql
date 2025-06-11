/*
  Warnings:

  - A unique constraint covering the columns `[telefone]` on the table `User_Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telefone` to the `User_Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_business` ADD COLUMN `telefone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_Business_telefone_key` ON `User_Business`(`telefone`);
