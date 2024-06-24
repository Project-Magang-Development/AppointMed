/*
  Warnings:

  - Added the required column `package_tag` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `package` ADD COLUMN `package_tag` VARCHAR(191) NOT NULL;
