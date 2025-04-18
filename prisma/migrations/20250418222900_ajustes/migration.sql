/*
  Warnings:

  - You are about to drop the column `senha` on the `user_admin` table. All the data in the column will be lost.
  - Added the required column `password` to the `User_Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_admin` DROP COLUMN `senha`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;
