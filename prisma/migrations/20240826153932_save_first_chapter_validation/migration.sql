/*
  Warnings:

  - You are about to drop the column `isfirstTime` on the `UserProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserProgress` DROP COLUMN `isfirstTime`,
    ADD COLUMN `isFirstTime` BOOLEAN NOT NULL DEFAULT false;
