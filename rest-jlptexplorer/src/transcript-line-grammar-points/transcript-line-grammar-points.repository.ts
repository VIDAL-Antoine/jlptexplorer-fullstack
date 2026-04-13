import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class TranscriptLineGrammarPointsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllTranscriptLineGrammarPoints(filters: { transcriptLineId?: number }) {
    return this.prisma.transcript_line_grammar_points.findMany({
      where:
        filters.transcriptLineId !== undefined
          ? { transcript_line_id: filters.transcriptLineId }
          : {},
      orderBy: [{ transcript_line_id: 'asc' }, { start_index: 'asc' }],
    });
  }

  findTranscriptLineGrammarPointById(id: number) {
    return this.prisma.transcript_line_grammar_points.findUnique({
      where: { id },
    });
  }

  createTranscriptLineGrammarPoint(data: {
    transcript_line_id: number;
    grammar_point_id: number;
    start_index?: number;
    end_index?: number;
    matched_form?: string;
  }) {
    return this.prisma.transcript_line_grammar_points.create({ data });
  }

  updateTranscriptLineGrammarPoint(
    id: number,
    data: Prisma.transcript_line_grammar_pointsUncheckedUpdateInput,
  ) {
    return this.prisma.transcript_line_grammar_points.update({
      where: { id },
      data,
    });
  }

  deleteTranscriptLineGrammarPoint(id: number) {
    return this.prisma.transcript_line_grammar_points.delete({ where: { id } });
  }
}
