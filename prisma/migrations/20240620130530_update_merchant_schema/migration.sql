/*
  Warnings:

  - You are about to drop the column `domain` on the `merchant` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `merchant` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_company` on the `merchant` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_name` on the `merchant` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `merchant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[merchant_email]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[merchant_payment_id]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pending_id]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `available_balance` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchant_email` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchant_payment_id` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pending_id` to the `Merchant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Merchant_email_key` ON `merchant`;

-- AlterTable
ALTER TABLE `merchant` DROP COLUMN `domain`,
    DROP COLUMN `email`,
    DROP COLUMN `merchant_company`,
    DROP COLUMN `merchant_name`,
    DROP COLUMN `password`,
    ADD COLUMN `available_balance` INTEGER NOT NULL,
    ADD COLUMN `merchant_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `merchant_payment_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `pending_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Merchant_merchant_email_key` ON `Merchant`(`merchant_email`);

-- CreateIndex
CREATE UNIQUE INDEX `Merchant_merchant_payment_id_key` ON `Merchant`(`merchant_payment_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Merchant_pending_id_key` ON `Merchant`(`pending_id`);
