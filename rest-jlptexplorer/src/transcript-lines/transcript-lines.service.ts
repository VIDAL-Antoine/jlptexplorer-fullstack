import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TranscriptLinesRepository } from './transcript-lines.repository';
import { SpeakersRepository } from '../speakers/speakers.repository';
import { CreateTranscriptLineDto } from './dto/create-transcript-line.dto';
import { UpdateTranscriptLineDto } from './dto/update-transcript-line.dto';
import { QueryTranscriptLineDto } from './dto/query-transcript-line.dto';
import { parseTime } from '../utils/parse-time';

@Injectable()
export class TranscriptLinesService {
  constructor(
    private readonly repo: TranscriptLinesRepository,
    private readonly speakersRepo: SpeakersRepository,
  ) {}

  findAll(query: QueryTranscriptLineDto) {
    return this.repo.findAll(query);
  }

  async findOne(id: number) {
    const line = await this.repo.findOne(id);
    if (!line) throw new NotFoundException(`TranscriptLine #${id} not found`);
    return line;
  }

  async create(dto: CreateTranscriptLineDto) {
    const speaker_id = await this.resolveSpeakerId(dto.speaker_slug);
    return this.repo.create({
      scene_id: dto.scene_id,
      start_time: dto.start_time != null ? parseTime(dto.start_time) : null,
      speaker_id,
      japanese_text: dto.japanese_text,
      translations: dto.translations,
    });
  }

  async update(id: number, dto: UpdateTranscriptLineDto) {
    await this.findOne(id);
    const speaker_id =
      dto.speaker_slug !== undefined
        ? await this.resolveSpeakerId(dto.speaker_slug)
        : undefined;
    return this.repo.update(id, {
      scene_id: dto.scene_id,
      start_time:
        dto.start_time === undefined
          ? undefined
          : dto.start_time != null
            ? parseTime(dto.start_time)
            : null,
      speaker_id,
      japanese_text: dto.japanese_text,
      translations: dto.translations,
    });
  }

  private async resolveSpeakerId(
    slug: string | null | undefined,
  ): Promise<number | null> {
    if (!slug) return null;
    const speaker = await this.speakersRepo.findBySlug(slug);
    if (!speaker)
      throw new BadRequestException(`Speaker slug "${slug}" not found`);
    return speaker.id;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
