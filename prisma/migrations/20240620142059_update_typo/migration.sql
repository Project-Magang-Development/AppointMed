/*
  Warnings:

  - You are about to drop the column `merchantMerchant_id` on the `merchantpendingpayment` table. All the data in the column will be lost.
  - Added the required column `password` to the `Merchant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `merchantpendingpayment` DROP FOREIGN KEY `MerchantPendingPayment_merchantMerchant_id_fkey`;

-- AlterTable
ALTER TABLE `merchant` ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `merchantpendingpayment` DROP COLUMN `merchantMerchant_id`;

-- AddForeignKey
ALTER TABLE `Merchant` ADD CONSTRAINT `Merchant_pending_id_fkey` FOREIGN KEY (`pending_id`) REFERENCES `MerchantPendingPayment`(`pending_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
