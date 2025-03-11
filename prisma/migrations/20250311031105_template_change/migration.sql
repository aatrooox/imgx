/*
  Warnings:

  - You are about to drop the column `tmplateId` on the `imgx_preset` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `imgx_template` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `imgx_template` table. All the data in the column will be lost.
  - Added the required column `templateId` to the `imgx_preset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `props` to the `imgx_template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `template` to the `imgx_template` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `imgx_preset` DROP FOREIGN KEY `imgx_preset_tmplateId_fkey`;

-- DropIndex
DROP INDEX `imgx_preset_tmplateId_fkey` ON `imgx_preset`;

-- AlterTable
ALTER TABLE `imgx_preset` DROP COLUMN `tmplateId`,
    ADD COLUMN `templateId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `imgx_template` DROP COLUMN `content`,
    DROP COLUMN `description`,
    ADD COLUMN `props` JSON NOT NULL,
    ADD COLUMN `template` TEXT NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'base';

-- AddForeignKey
ALTER TABLE `imgx_preset` ADD CONSTRAINT `imgx_preset_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `imgx_template`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
