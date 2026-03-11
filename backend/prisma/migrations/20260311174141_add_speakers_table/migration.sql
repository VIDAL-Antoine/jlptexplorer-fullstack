/*
  Warnings:

  - You are about to drop the column `speaker` on the `transcript_lines` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transcript_lines" DROP COLUMN "speaker",
ADD COLUMN     "speaker_id" INTEGER;

-- CreateTable
CREATE TABLE "speakers" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name_english" VARCHAR(100) NOT NULL,
    "name_japanese" VARCHAR(100),
    "description" TEXT,
    "image_url" VARCHAR(500),

    CONSTRAINT "speakers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "speakers_slug_key" ON "speakers"("slug");

-- AddForeignKey
ALTER TABLE "transcript_lines" ADD CONSTRAINT "transcript_lines_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "speakers"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
