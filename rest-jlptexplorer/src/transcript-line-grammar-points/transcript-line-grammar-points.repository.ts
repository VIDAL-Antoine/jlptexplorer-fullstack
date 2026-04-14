import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTranscriptLineGrammarPointDto } from './dto/create-transcript-line-grammar-point.dto';
import { UpdateTranscriptLineGrammarPointDto } from './dto/update-transcript-line-grammar-point.dto';

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

  create(dto: CreateTranscriptLineGrammarPointDto) {
    return this.prisma.transcript_line_grammar_points.create({
      data: {
        transcript_line_id: dto.transcript_line_id,
        grammar_point_id: dto.grammar_point_id,
        start_index: dto.start_index ?? null,
        end_index: dto.end_index ?? null,
        matched_form: dto.matched_form ?? null,
      },
      include: { grammar_points: true },
    });
  }

  update(id: number, dto: UpdateTranscriptLineGrammarPointDto) {
    return this.prisma.transcript_line_grammar_points.update({
      where: { id },
      data: {
        transcript_line_id: dto.transcript_line_id,
        grammar_point_id: dto.grammar_point_id,
        start_index: dto.start_index,
        end_index: dto.end_index,
        matched_form: dto.matched_form,
      },
      include: { grammar_points: true },
    });
  }

  remove(id: number) {
    return this.prisma.transcript_line_grammar_points.delete({ where: { id } });
  }
}
