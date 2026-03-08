-- CreateEnum
CREATE TYPE "jlpt_level" AS ENUM ('N5', 'N4', 'N3', 'N2', 'N1', 'Other');

-- CreateEnum
CREATE TYPE "source_type" AS ENUM ('game', 'anime', 'movie', 'series', 'music');

-- CreateTable
CREATE TABLE "clips" (
    "id" SERIAL NOT NULL,
    "source_id" INTEGER NOT NULL,
    "youtube_video_id" VARCHAR(20) NOT NULL,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER NOT NULL,
    "translation" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clip_grammar_points" (
    "clip_id" INTEGER NOT NULL,
    "grammar_point_id" INTEGER NOT NULL,
    "featured_line_id" INTEGER,

    CONSTRAINT "clip_grammar_points_clip_id_grammar_point_id_pk" PRIMARY KEY ("clip_id","grammar_point_id")
);

-- CreateTable
CREATE TABLE "grammar_points" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "romaji" VARCHAR(100) NOT NULL,
    "meaning" TEXT NOT NULL,
    "jlpt_level" "jlpt_level" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grammar_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" "source_type" NOT NULL,
    "cover_image_url" VARCHAR(500),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "japanese_title" VARCHAR(255),
    "slug" VARCHAR(100) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transcript_lines" (
    "id" SERIAL NOT NULL,
    "clip_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "speaker" VARCHAR(100),
    "text" TEXT NOT NULL,

    CONSTRAINT "transcript_lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grammar_points_slug_unique" ON "grammar_points"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "sources_slug_unique" ON "sources"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "transcript_lines_clip_id_position_key" ON "transcript_lines"("clip_id", "position");

-- AddForeignKey
ALTER TABLE "clips" ADD CONSTRAINT "clips_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clip_grammar_points" ADD CONSTRAINT "clip_grammar_points_clip_id_clips_id_fk" FOREIGN KEY ("clip_id") REFERENCES "clips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clip_grammar_points" ADD CONSTRAINT "clip_grammar_points_grammar_point_id_grammar_points_id_fk" FOREIGN KEY ("grammar_point_id") REFERENCES "grammar_points"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clip_grammar_points" ADD CONSTRAINT "clip_grammar_points_featured_line_id_fkey" FOREIGN KEY ("featured_line_id") REFERENCES "transcript_lines"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transcript_lines" ADD CONSTRAINT "transcript_lines_clip_id_fkey" FOREIGN KEY ("clip_id") REFERENCES "clips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
