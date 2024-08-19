/*
  Warnings:

  - You are about to drop the column `quizId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chapterId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Question_quizId_idx` ON `Question`;

-- AlterTable
ALTER TABLE `Question` DROP COLUMN `quizId`,
    ADD COLUMN `chapterId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Quiz`;

-- CreateIndex
CREATE INDEX `Question_chapterId_idx` ON `Question`(`chapterId`);
