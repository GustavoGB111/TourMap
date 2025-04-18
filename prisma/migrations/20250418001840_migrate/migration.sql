/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User_Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_Admin_name_key` ON `user_admin`;

-- CreateIndex
CREATE UNIQUE INDEX `User_Admin_email_key` ON `User_Admin`(`email`);
