-- CreateTable
CREATE TABLE `Queue` (
    `queue_id` VARCHAR(191) NOT NULL,
    `reservation_id` VARCHAR(191) NOT NULL,
    `has_arrived` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Queue_reservation_id_key`(`reservation_id`),
    PRIMARY KEY (`queue_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Queue` ADD CONSTRAINT `Queue_reservation_id_fkey` FOREIGN KEY (`reservation_id`) REFERENCES `Reservation`(`reservation_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
