/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `imgx_preset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `imgx_preset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmplateId` to the `imgx_preset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `imgx_preset` ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `tmplateId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `imgx_template` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `imgx_preset_code_key` ON `imgx_preset`(`code`);

-- AddForeignKey
ALTER TABLE `imgx_preset` ADD CONSTRAINT `imgx_preset_tmplateId_fkey` FOREIGN KEY (`tmplateId`) REFERENCES `imgx_template`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
