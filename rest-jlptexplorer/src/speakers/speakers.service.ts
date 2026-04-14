import { Injectable, NotFoundException } from '@nestjs/common';
import { SpeakersRepository } from './speakers.repository';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';
import { QuerySpeakerDto } from './dto/query-speaker.dto';

@Injectable()
export class SpeakersService {
  constructor(private readonly repo: SpeakersRepository) {}

  findAll(query: QuerySpeakerDto) {
    return this.repo.findAll(query);
  }

  async findOne(slug: string) {
    const speaker = await this.repo.findBySlug(slug);
    if (!speaker) throw new NotFoundException(`Speaker "${slug}" not found`);
    return speaker;
  }

  create(dto: CreateSpeakerDto) {
    return this.repo.create(dto);
  }

  async update(slug: string, dto: UpdateSpeakerDto) {
    const existing = await this.findOne(slug);
    return this.repo.update(existing.id, dto);
  }

  async remove(slug: string) {
    const existing = await this.findOne(slug);
    return this.repo.remove(existing.id);
  }
}
