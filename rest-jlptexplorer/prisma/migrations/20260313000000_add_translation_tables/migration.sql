-- CreateTable: grammar_point_translations
CREATE TABLE "grammar_point_translations" (
    "id" SERIAL NOT NULL,
    "grammar_point_id" INTEGER NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "meaning" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "grammar_point_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: source_translations
CREATE TABLE "source_translations" (
    "id" SERIAL NOT NULL,
    "source_id" INTEGER NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "source_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: speaker_translations
CREATE TABLE "speaker_translations" (
    "id" SERIAL NOT NULL,
    "speaker_id" INTEGER NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "speaker_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: transcript_line_translations
CREATE TABLE "transcript_line_translations" (
    "id" SERIAL NOT NULL,
    "transcript_line_id" INTEGER NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "translation" TEXT,

    CONSTRAINT "transcript_line_translations_pkey" PRIMARY KEY ("id")
);

-- Migrate existing data to locale 'en'
INSERT INTO "grammar_point_translations" ("grammar_point_id", "locale", "meaning", "notes")
SELECT "id", 'en', "meaning", "notes" FROM "grammar_points";

INSERT INTO "source_translations" ("source_id", "locale", "title")
SELECT "id", 'en', "title" FROM "sources";

INSERT INTO "speaker_translations" ("speaker_id", "locale", "name", "description")
SELECT "id", 'en', "name_english", "description" FROM "speakers";

INSERT INTO "transcript_line_translations" ("transcript_line_id", "locale", "translation")
SELECT "id", 'en', "translation" FROM "transcript_lines" WHERE "translation" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "grammar_point_translations" ADD CONSTRAINT "grammar_point_translations_grammar_point_id_fkey"
    FOREIGN KEY ("grammar_point_id") REFERENCES "grammar_points"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "source_translations" ADD CONSTRAINT "source_translations_source_id_fkey"
    FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "speaker_translations" ADD CONSTRAINT "speaker_translations_speaker_id_fkey"
    FOREIGN KEY ("speaker_id") REFERENCES "speakers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "transcript_line_translations" ADD CONSTRAINT "transcript_line_translations_transcript_line_id_fkey"
    FOREIGN KEY ("transcript_line_id") REFERENCES "transcript_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateUniqueIndex
CREATE UNIQUE INDEX "grammar_point_translations_grammar_point_id_locale_key"
    ON "grammar_point_translations"("grammar_point_id", "locale");

CREATE UNIQUE INDEX "source_translations_source_id_locale_key"
    ON "source_translations"("source_id", "locale");

CREATE UNIQUE INDEX "speaker_translations_speaker_id_locale_key"
    ON "speaker_translations"("speaker_id", "locale");

CREATE UNIQUE INDEX "transcript_line_translations_transcript_line_id_locale_key"
    ON "transcript_line_translations"("transcript_line_id", "locale");

-- Drop old columns (after data has been migrated)
ALTER TABLE "grammar_points" DROP COLUMN "meaning";
ALTER TABLE "grammar_points" DROP COLUMN "notes";
ALTER TABLE "sources" DROP COLUMN "title";
ALTER TABLE "speakers" DROP COLUMN "name_english";
ALTER TABLE "speakers" DROP COLUMN "description";
ALTER TABLE "transcript_lines" DROP COLUMN "translation";
