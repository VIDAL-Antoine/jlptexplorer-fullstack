import { Injectable, NotFoundException } from '@nestjs/common';
import { TranscriptLineGrammarPointsRepository } from './transcript-line-grammar-points.repository';
import { CreateTranscriptLineGrammarPointDto } from './dto/create-transcript-line-grammar-point.dto';
import { UpdateTranscriptLineGrammarPointDto } from './dto/update-transcript-line-grammar-point.dto';

@Injectable()
export class TranscriptLineGrammarPointsService {
  constructor(private readonly repo: TranscriptLineGrammarPointsRepository) {}

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

  create(dto: CreateTranscriptLineGrammarPointDto) {
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateTranscriptLineGrammarPointDto) {
    await this.findOne(id);
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
