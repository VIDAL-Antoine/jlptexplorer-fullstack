import { prisma } from '@/config/prisma.js';

export async function findAllTranscriptLineGrammarPoints(filters: {
  transcriptLineId?: number;
}) {
  return prisma.transcript_line_grammar_points.findMany({
    where: filters.transcriptLineId !== undefined ? { transcript_line_id: filters.transcriptLineId } : {},
    orderBy: [{ transcript_line_id: 'asc' }, { start_index: 'asc' }],
  });
}

export async function findTranscriptLineGrammarPointById(id: number) {
  return prisma.transcript_line_grammar_points.findUnique({ where: { id } });
}

export async function createTranscriptLineGrammarPoint(data: {
  transcript_line_id: number;
  grammar_point_id: number;
  start_index?: number;
  end_index?: number;
  matched_form?: string;
}) {
  return prisma.transcript_line_grammar_points.create({ data });
}

export async function updateTranscriptLineGrammarPoint(
  id: number,
  data: {
    grammar_point_id?: number;
    start_index?: number;
    end_index?: number;
    matched_form?: string | null;
  },
) {
  return prisma.transcript_line_grammar_points.update({ where: { id }, data });
}

export async function deleteTranscriptLineGrammarPoint(id: number) {
  return prisma.transcript_line_grammar_points.delete({ where: { id } });
}
