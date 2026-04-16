import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TranscriptLineGrammarPointsRepository } from './transcript-line-grammar-points.repository';
import { GrammarPointsRepository } from '../grammar-points/grammar-points.repository';
import { CreateTranscriptLineGrammarPointDto } from './dto/create-transcript-line-grammar-point.dto';
import { UpdateTranscriptLineGrammarPointDto } from './dto/update-transcript-line-grammar-point.dto';

@Injectable()
export class TranscriptLineGrammarPointsService {
  constructor(
    private readonly repo: TranscriptLineGrammarPointsRepository,
    private readonly grammarPointsRepo: GrammarPointsRepository,
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
    const grammar_point_id = await this.resolveGrammarPointId(
      dto.grammar_point_slug,
    );
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
        ? await this.resolveGrammarPointId(dto.grammar_point_slug)
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

  private async resolveGrammarPointId(slug: string): Promise<number> {
    const gp = await this.grammarPointsRepo.findBySlug(slug);
    if (!gp)
      throw new BadRequestException(`Grammar point slug "${slug}" not found`);
    return gp.id;
  }
}
