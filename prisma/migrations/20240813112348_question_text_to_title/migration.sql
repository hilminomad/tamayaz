/*
  Warnings:

  - You are about to drop the column `text` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Question` table. All the data in the column will be lost.
  - Added the required column `title` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Answer` DROP COLUMN `text`,
    ADD COLUMN `title` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Question` DROP COLUMN `text`,
    ADD COLUMN `title` TEXT NOT NULL;
