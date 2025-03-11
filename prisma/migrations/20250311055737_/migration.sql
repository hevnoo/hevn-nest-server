/*
  Warnings:

  - You are about to alter the column `valid_from` on the `dict` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `valid_to` on the `dict` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - A unique constraint covering the columns `[code,parent_id,deletetime]` on the table `department` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `department_code_deletetime_key` ON `department`;

-- AlterTable
ALTER TABLE `dict` MODIFY `valid_from` TIMESTAMP NULL,
    MODIFY `valid_to` TIMESTAMP NULL;

-- CreateIndex
CREATE UNIQUE INDEX `department_code_parent_id_deletetime_key` ON `department`(`code`, `parent_id`, `deletetime`);
