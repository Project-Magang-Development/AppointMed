/*
  Warnings:

  - Added the required column `total_amount` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `total_amount` INTEGER NOT NULL;
