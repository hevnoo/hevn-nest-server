/*
  Warnings:

  - You are about to alter the column `valid_from` on the `dict` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `valid_to` on the `dict` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `dict` MODIFY `valid_from` TIMESTAMP NULL,
    MODIFY `valid_to` TIMESTAMP NULL;
