/*
  Warnings:

  - You are about to drop the column `translation` on the `clips` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clips" DROP COLUMN "translation";

-- AlterTable
ALTER TABLE "transcript_lines" ADD COLUMN     "translation" TEXT;
