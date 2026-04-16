import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type CreateTranscriptLineGrammarPointData = {
  transcript_line_id: number;
  grammar_point_id: number;
  start_index?: number | null;
  end_index?: number | null;
  matched_form?: string | null;
};

type UpdateTranscriptLineGrammarPointData = {
  transcript_line_id?: number;
  grammar_point_id?: number;
  start_index?: number | null;
  end_index?: number | null;
  matched_form?: string | null;
};

@Injectable()
export class TranscriptLineGrammarPointsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.transcript_line_grammar_points.findMany({
      include: { grammar_points: true },
    });
  }

  findOne(id: number) {
    return this.prisma.transcript_line_grammar_points.findUnique({
      where: { id },
      include: { grammar_points: true },
    });
  }

  create(data: CreateTranscriptLineGrammarPointData) {
    return this.prisma.transcript_line_grammar_points.create({
      data: {
        transcript_line_id: data.transcript_line_id,
        grammar_point_id: data.grammar_point_id,
        start_index: data.start_index ?? null,
        end_index: data.end_index ?? null,
        matched_form: data.matched_form ?? null,
      },
      include: { grammar_points: true },
    });
  }

  update(id: number, data: UpdateTranscriptLineGrammarPointData) {
    return this.prisma.transcript_line_grammar_points.update({
      where: { id },
      data: {
        transcript_line_id: data.transcript_line_id,
        grammar_point_id: data.grammar_point_id,
        start_index: data.start_index,
        end_index: data.end_index,
        matched_form: data.matched_form,
      },
      include: { grammar_points: true },
    });
  }

  remove(id: number) {
    return this.prisma.transcript_line_grammar_points.delete({ where: { id } });
  }
}
