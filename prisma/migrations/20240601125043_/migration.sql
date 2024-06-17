-- CreateTable
CREATE TABLE `Merchant` (
    `merchant_id` VARCHAR(191) NOT NULL,
    `merchant_name` VARCHAR(191) NOT NULL,
    `merchant_company` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `status_subscriber` VARCHAR(191) NOT NULL DEFAULT 'Aktif',
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `api_key` VARCHAR(191) NOT NULL,
    `used_storage_vehicle` INTEGER NOT NULL DEFAULT 0,
    `used_storage_order` INTEGER NOT NULL DEFAULT 0,
    `package_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Merchant_email_key`(`email`),
    UNIQUE INDEX `Merchant_api_key_key`(`api_key`),
    PRIMARY KEY (`merchant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Package` (
    `package_id` VARCHAR(191) NOT NULL,
    `package_name` VARCHAR(191) NOT NULL,
    `package_description` VARCHAR(191) NOT NULL,
    `package_price` INTEGER NOT NULL,
    `package_feature` VARCHAR(191) NOT NULL,
    `count_doctor` INTEGER NULL,
    `count_order` INTEGER NULL,
    `duration` INTEGER NOT NULL,

    PRIMARY KEY (`package_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `doctor_id` VARCHAR(191) NOT NULL,
    `merchant_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `specialist` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL DEFAULT 0,
    `practiceDays` VARCHAR(191) NOT NULL,
    `imageUrl` LONGTEXT NOT NULL,
    `experiences` VARCHAR(191) NOT NULL DEFAULT '',
    `no_phone` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `no_sip` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`doctor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `schedules_id` VARCHAR(191) NOT NULL,
    `merchant_id` VARCHAR(191) NOT NULL,
    `doctor_id` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`schedules_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `reservation_id` VARCHAR(191) NOT NULL,
    `schedules_id` VARCHAR(191) NOT NULL,
    `merchant_id` VARCHAR(191) NOT NULL,
    `no_reservation` VARCHAR(191) NOT NULL DEFAULT '',
    `date_time` DATETIME(3) NOT NULL,
    `patient_name` VARCHAR(191) NOT NULL,
    `patient_phone` VARCHAR(191) NOT NULL,
    `patient_gender` VARCHAR(191) NOT NULL,
    `patient_email` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`reservation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` VARCHAR(191) NOT NULL,
    `reservation_id` VARCHAR(191) NOT NULL,
    `merchant_id` VARCHAR(191) NOT NULL,
    `external_id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `payment_method` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `payment_date` DATETIME(3) NULL,

    UNIQUE INDEX `Payment_external_id_key`(`external_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Queue` (
    `queue_id` VARCHAR(191) NOT NULL,
    `merchant_id` VARCHAR(191) NOT NULL,
    `reservation_id` VARCHAR(191) NOT NULL,
    `has_arrived` BOOLEAN NULL,

    UNIQUE INDEX `Queue_reservation_id_key`(`reservation_id`),
    PRIMARY KEY (`queue_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Merchant` ADD CONSTRAINT `Merchant_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `Package`(`package_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_schedules_id_fkey` FOREIGN KEY (`schedules_id`) REFERENCES `Schedule`(`schedules_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_reservation_id_fkey` FOREIGN KEY (`reservation_id`) REFERENCES `Reservation`(`reservation_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Queue` ADD CONSTRAINT `Queue_reservation_id_fkey` FOREIGN KEY (`reservation_id`) REFERENCES `Reservation`(`reservation_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Queue` ADD CONSTRAINT `Queue_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
