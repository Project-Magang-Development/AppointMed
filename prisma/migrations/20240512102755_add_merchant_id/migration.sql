/*
  Warnings:

  - Added the required column `merchant_id` to the `Queue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Queue` ADD COLUMN `merchant_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Queue` ADD CONSTRAINT `Queue_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
