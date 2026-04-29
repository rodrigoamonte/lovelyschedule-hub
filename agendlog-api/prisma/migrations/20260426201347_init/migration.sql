/*
  Warnings:

  - You are about to drop the column `deliverySlotId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `driverId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(1))`.
  - Added the required column `supplierId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `Bay` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_deliverySlotId_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_driverId_fkey`;

-- DropIndex
DROP INDEX `Appointment_deliverySlotId_idx` ON `Appointment`;

-- DropIndex
DROP INDEX `Appointment_driverId_idx` ON `Appointment`;

-- DropIndex
DROP INDEX `Bay_deletedAt_idx` ON `Bay`;

-- AlterTable
ALTER TABLE `Appointment` DROP COLUMN `deliverySlotId`,
    DROP COLUMN `driverId`,
    ADD COLUMN `orderNumber` VARCHAR(191) NULL,
    ADD COLUMN `statusReason` VARCHAR(191) NULL,
    ADD COLUMN `supplierId` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalValue` INTEGER NULL,
    MODIFY `status` ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SCHEDULED', 'INSPECTION', 'COMPLETED', 'CANCELLED', 'MAINTENANCE') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `AppointmentHistory` MODIFY `status` ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SCHEDULED', 'INSPECTION', 'COMPLETED', 'CANCELLED', 'MAINTENANCE') NOT NULL,
    MODIFY `previousStatus` ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SCHEDULED', 'INSPECTION', 'COMPLETED', 'CANCELLED', 'MAINTENANCE') NULL;

-- AlterTable
ALTER TABLE `Bay` ADD COLUMN `storeId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('ADMIN', 'ANALYST', 'CHECKER', 'SUPPLIER') NOT NULL DEFAULT 'SUPPLIER';

-- CreateTable
CREATE TABLE `_AppointmentToDeliverySlot` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AppointmentToDeliverySlot_AB_unique`(`A`, `B`),
    INDEX `_AppointmentToDeliverySlot_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Appointment_supplierId_idx` ON `Appointment`(`supplierId`);

-- CreateIndex
CREATE INDEX `Bay_storeId_idx` ON `Bay`(`storeId`);

-- AddForeignKey
ALTER TABLE `Bay` ADD CONSTRAINT `Bay_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppointmentToDeliverySlot` ADD CONSTRAINT `_AppointmentToDeliverySlot_A_fkey` FOREIGN KEY (`A`) REFERENCES `Appointment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppointmentToDeliverySlot` ADD CONSTRAINT `_AppointmentToDeliverySlot_B_fkey` FOREIGN KEY (`B`) REFERENCES `DeliverySlot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
