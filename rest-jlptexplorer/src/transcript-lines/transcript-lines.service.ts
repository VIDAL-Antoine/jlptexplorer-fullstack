import { Injectable, NotFoundException } from '@nestjs/common';
import { TranscriptLinesRepository } from './transcript-lines.repository';
import { CreateTranscriptLineDto } from './dto/create-transcript-line.dto';
import { UpdateTranscriptLineDto } from './dto/update-transcript-line.dto';
import { QueryTranscriptLineDto } from './dto/query-transcript-line.dto';
import { parseTime } from '../utils/parse-time';

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
    return this.repo.create({
      ...dto,
      start_time: dto.start_time != null ? parseTime(dto.start_time) : null,
    });
  }

  async update(id: number, dto: UpdateTranscriptLineDto) {
    await this.findOne(id);
    return this.repo.update(id, {
      ...dto,
      start_time:
        dto.start_time === undefined
          ? undefined
          : dto.start_time != null
            ? parseTime(dto.start_time)
            : null,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
