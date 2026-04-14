import { Injectable, NotFoundException } from '@nestjs/common';
import { TranscriptLinesRepository } from './transcript-lines.repository';
import { CreateTranscriptLineDto } from './dto/create-transcript-line.dto';
import { UpdateTranscriptLineDto } from './dto/update-transcript-line.dto';
import { QueryTranscriptLineDto } from './dto/query-transcript-line.dto';

@Injectable()
export class TranscriptLinesService {
  constructor(private readonly repo: TranscriptLinesRepository) {}

  findAll(query: QueryTranscriptLineDto) {
    return this.repo.findAll(query);
  }

  async findOne(id: number) {
    const line = await this.repo.findOne(id);
    if (!line) throw new NotFoundException(`TranscriptLine #${id} not found`);
    return line;
  }

  create(dto: CreateTranscriptLineDto) {
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateTranscriptLineDto) {
    await this.findOne(id);
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
