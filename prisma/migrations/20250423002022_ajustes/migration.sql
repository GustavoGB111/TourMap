/*
  Warnings:

  - You are about to drop the column `CNPJ_Filial` on the `ponto_comercial` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Ponto_Comercial_CNPJ_Filial_key` ON `ponto_comercial`;

-- AlterTable
ALTER TABLE `ponto_comercial` DROP COLUMN `CNPJ_Filial`;
