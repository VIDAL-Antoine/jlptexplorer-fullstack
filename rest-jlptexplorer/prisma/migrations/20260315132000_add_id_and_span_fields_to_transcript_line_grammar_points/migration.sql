-- DropConstraint (composite PK)
ALTER TABLE "transcript_line_grammar_points" DROP CONSTRAINT IF EXISTS "transcript_line_grammar_points_pkey";

-- AlterTable: add id PK and span fields
ALTER TABLE "transcript_line_grammar_points"
ADD COLUMN "id" SERIAL NOT NULL,
ADD COLUMN "start_index" INTEGER,
ADD COLUMN "end_index" INTEGER,
ADD COLUMN "matched_form" TEXT;

-- AddPrimaryKey
ALTER TABLE "transcript_line_grammar_points" ADD CONSTRAINT "transcript_line_grammar_points_pkey" PRIMARY KEY ("id");
