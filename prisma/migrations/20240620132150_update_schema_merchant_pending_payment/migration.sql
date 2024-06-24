-- CreateTable
CREATE TABLE `MerchantPayment` (
    `merchant_payment_id` VARCHAR(191) NOT NULL,
    `pending_id` VARCHAR(191) NOT NULL,
    `invoice_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MerchantPayment_pending_id_key`(`pending_id`),
    UNIQUE INDEX `MerchantPayment_invoice_id_key`(`invoice_id`),
    PRIMARY KEY (`merchant_payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MerchantPendingPayment` (
    `pending_id` VARCHAR(191) NOT NULL,
    `invoice_id` VARCHAR(191) NOT NULL,
    `package_name` VARCHAR(191) NOT NULL,
    `package_id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `merchant_name` VARCHAR(191) NOT NULL,
    `merchant_email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `merchant_whatsapp` VARCHAR(191) NOT NULL,
    `klinik_name` VARCHAR(191) NOT NULL,
    `klinik_type` VARCHAR(191) NOT NULL,
    `merchant_city` VARCHAR(191) NOT NULL,
    `merchant_address` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `payment_date` DATETIME(3) NULL,
    `merchantMerchant_id` VARCHAR(191) NULL,

    UNIQUE INDEX `MerchantPendingPayment_invoice_id_key`(`invoice_id`),
    PRIMARY KEY (`pending_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Merchant` ADD CONSTRAINT `Merchant_merchant_payment_id_fkey` FOREIGN KEY (`merchant_payment_id`) REFERENCES `MerchantPayment`(`merchant_payment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MerchantPayment` ADD CONSTRAINT `MerchantPayment_pending_id_fkey` FOREIGN KEY (`pending_id`) REFERENCES `MerchantPendingPayment`(`pending_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MerchantPendingPayment` ADD CONSTRAINT `MerchantPendingPayment_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `Package`(`package_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MerchantPendingPayment` ADD CONSTRAINT `MerchantPendingPayment_merchantMerchant_id_fkey` FOREIGN KEY (`merchantMerchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE SET NULL ON UPDATE CASCADE;
