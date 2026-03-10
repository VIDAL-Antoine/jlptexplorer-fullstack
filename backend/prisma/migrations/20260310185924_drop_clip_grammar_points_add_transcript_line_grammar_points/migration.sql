/*
  Warnings:

  - You are about to drop the `clip_grammar_points` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "clip_grammar_points" DROP CONSTRAINT "clip_grammar_points_clip_id_clips_id_fk";

-- DropForeignKey
ALTER TABLE "clip_grammar_points" DROP CONSTRAINT "clip_grammar_points_featured_line_id_fkey";

-- DropForeignKey
ALTER TABLE "clip_grammar_points" DROP CONSTRAINT "clip_grammar_points_grammar_point_id_grammar_points_id_fk";

-- DropTable
DROP TABLE "clip_grammar_points";

-- CreateTable
CREATE TABLE "transcript_line_grammar_points" (
    "transcript_line_id" INTEGER NOT NULL,
    "grammar_point_id" INTEGER NOT NULL,

    CONSTRAINT "transcript_line_grammar_points_pkey" PRIMARY KEY ("transcript_line_id","grammar_point_id")
);

-- AddForeignKey
ALTER TABLE "transcript_line_grammar_points" ADD CONSTRAINT "transcript_line_grammar_points_transcript_line_id_fkey" FOREIGN KEY ("transcript_line_id") REFERENCES "transcript_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transcript_line_grammar_points" ADD CONSTRAINT "transcript_line_grammar_points_grammar_point_id_fkey" FOREIGN KEY ("grammar_point_id") REFERENCES "grammar_points"("id") ON DELETE CASCADE ON UPDATE CASCADE;
