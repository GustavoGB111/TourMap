/*
  Warnings:

  - You are about to drop the column `CNPJ_Matriz` on the `ponto_comercial` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ponto_comercial` DROP FOREIGN KEY `Ponto_Comercial_CNPJ_Matriz_fkey`;

-- DropIndex
DROP INDEX `Ponto_Comercial_CNPJ_Matriz_fkey` ON `ponto_comercial`;

-- AlterTable
ALTER TABLE `ponto_comercial` DROP COLUMN `CNPJ_Matriz`;
