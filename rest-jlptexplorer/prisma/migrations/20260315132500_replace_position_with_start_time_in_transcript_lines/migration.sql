-- DropIndex
DROP INDEX "transcript_lines_scene_id_position_key";

-- AlterTable
ALTER TABLE "transcript_lines" DROP COLUMN "position",
ADD COLUMN     "start_time" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "transcript_lines_scene_id_start_time_speaker_id_key" ON "transcript_lines"("scene_id", "start_time", "speaker_id");
