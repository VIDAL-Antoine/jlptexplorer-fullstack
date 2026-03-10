-- Rename table
ALTER TABLE "clips" RENAME TO "scenes";

-- Rename constraints on scenes
ALTER INDEX "clips_pkey" RENAME TO "scenes_pkey";
ALTER TABLE "scenes" RENAME CONSTRAINT "clips_source_id_sources_id_fk" TO "scenes_source_id_sources_id_fk";

-- Rename column in transcript_lines
ALTER TABLE "transcript_lines" RENAME COLUMN "clip_id" TO "scene_id";

-- Rename constraints on transcript_lines
ALTER TABLE "transcript_lines" RENAME CONSTRAINT "transcript_lines_clip_id_fkey" TO "transcript_lines_scene_id_fkey";
ALTER INDEX "transcript_lines_clip_id_position_key" RENAME TO "transcript_lines_scene_id_position_key";
