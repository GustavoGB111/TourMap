/*
  Warnings:

  - A unique constraint covering the columns `[CNPJ_Filial]` on the table `Ponto_Comercial` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[CNPJ]` on the table `User_Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CNPJ_Filial` to the `Ponto_Comercial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CNPJ_Matriz` to the `Ponto_Comercial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ponto_comercial` ADD COLUMN `CNPJ_Filial` VARCHAR(191) NOT NULL,
    ADD COLUMN `CNPJ_Matriz` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Ponto_Comercial_CNPJ_Filial_key` ON `Ponto_Comercial`(`CNPJ_Filial`);

-- CreateIndex
CREATE UNIQUE INDEX `User_Business_CNPJ_key` ON `User_Business`(`CNPJ`);

-- AddForeignKey
ALTER TABLE `Ponto_Comercial` ADD CONSTRAINT `Ponto_Comercial_CNPJ_Matriz_fkey` FOREIGN KEY (`CNPJ_Matriz`) REFERENCES `User_Business`(`CNPJ`) ON DELETE CASCADE ON UPDATE CASCADE;
