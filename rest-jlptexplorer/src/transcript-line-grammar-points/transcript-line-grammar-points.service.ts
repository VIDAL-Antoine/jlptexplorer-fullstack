import { Injectable, NotFoundException } from '@nestjs/common';
import { TranscriptLineGrammarPointsRepository } from './transcript-line-grammar-points.repository';
import { GrammarPointsService } from '../grammar-points/grammar-points.service';
import { CreateTranscriptLineGrammarPointDto } from './dto/create-transcript-line-grammar-point.dto';
import { UpdateTranscriptLineGrammarPointDto } from './dto/update-transcript-line-grammar-point.dto';

@Injectable()
export class TranscriptLineGrammarPointsService {
  constructor(
    private readonly repo: TranscriptLineGrammarPointsRepository,
    private readonly grammarPointsService: GrammarPointsService,
  ) {}

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    const tlgp = await this.repo.findOne(id);
    if (!tlgp)
      throw new NotFoundException(
        `TranscriptLineGrammarPoint #${id} not found`,
      );
    return tlgp;
  }

  async create(dto: CreateTranscriptLineGrammarPointDto) {
    const grammar_point_id = (
      await this.grammarPointsService.findOne(dto.grammar_point_slug)
    ).id;
    return this.repo.create({
      transcript_line_id: dto.transcript_line_id,
      grammar_point_id,
      start_index: dto.start_index,
      end_index: dto.end_index,
      matched_form: dto.matched_form,
    });
  }

  async update(id: number, dto: UpdateTranscriptLineGrammarPointDto) {
    await this.findOne(id);
    const grammar_point_id =
      dto.grammar_point_slug !== undefined
        ? (await this.grammarPointsService.findOne(dto.grammar_point_slug)).id
        : undefined;
    return this.repo.update(id, {
      transcript_line_id: dto.transcript_line_id,
      grammar_point_id,
      start_index: dto.start_index,
      end_index: dto.end_index,
      matched_form: dto.matched_form,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
