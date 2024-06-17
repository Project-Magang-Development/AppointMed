/*
  Warnings:

  - Added the required column `patient_address` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Reservation` ADD COLUMN `patient_address` VARCHAR(191) NOT NULL;
