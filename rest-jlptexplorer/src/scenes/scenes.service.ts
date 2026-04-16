import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ScenesRepository } from './scenes.repository';
import { SourcesRepository } from '../sources/sources.repository';
import { SpeakersRepository } from '../speakers/speakers.repository';
import { GrammarPointsRepository } from '../grammar-points/grammar-points.repository';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { QuerySceneDto } from './dto/query-scene.dto';
import { parseTime } from '../utils/parse-time';

@Injectable()
export class ScenesService {
  constructor(
    private readonly repo: ScenesRepository,
    private readonly sourcesRepo: SourcesRepository,
    private readonly speakersRepo: SpeakersRepository,
    private readonly grammarPointsRepo: GrammarPointsRepository,
  ) {}

  findAll(query: QuerySceneDto) {
    const sourceSlugs = query.sources
      ? query.sources.split(',').filter(Boolean)
      : [];
    const grammarPointSlugs = query.grammar_points
      ? query.grammar_points.split(',').filter(Boolean)
      : [];
    return this.repo.findAll({
      sourceSlugs,
      grammarPointSlugs,
      grammarMatch: query.grammar_match ?? 'scene',
      youtube_video_id: query.youtube_video_id,
      start_time: query.start_time,
      end_time: query.end_time,
      page: query.page ?? 1,
      limit: query.limit ?? 12,
    });
  }

  async findOne(id: number) {
    const scene = await this.repo.findOne(id);
    if (!scene) throw new NotFoundException(`Scene #${id} not found`);
    return scene;
  }

  async create(dto: CreateSceneDto) {
    const resolved = await this.resolveDto(dto);
    if (
      resolved.source_id === undefined ||
      resolved.youtube_video_id === undefined ||
      resolved.start_time === undefined ||
      resolved.end_time === undefined
    ) {
      throw new BadRequestException(
        'source_slug, youtube_video_id, start_time and end_time are required',
      );
    }
    return this.repo.create(resolved as Parameters<typeof this.repo.create>[0]);
  }

  async update(id: number, dto: UpdateSceneDto) {
    await this.findOne(id);
    const resolvedData = await this.resolveDto(dto);
    return this.repo.update(id, resolvedData);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repo.remove(id);
  }

  private async resolveDto(dto: CreateSceneDto | UpdateSceneDto) {
    let source_id: number | undefined;
    if (dto.source_slug !== undefined) {
      const source = await this.sourcesRepo.findBySlug(dto.source_slug);
      if (!source) {
        throw new BadRequestException(
          `Source slug "${dto.source_slug}" not found`,
        );
      }
      source_id = source.id;
    }

    let resolvedLines:
      | Awaited<ReturnType<typeof this.resolveTranscriptLines>>
      | undefined;
    if (dto.transcript_lines !== undefined) {
      resolvedLines = await this.resolveTranscriptLines(dto.transcript_lines);
    }

    return {
      source_id,
      youtube_video_id: dto.youtube_video_id,
      start_time:
        dto.start_time !== undefined ? parseTime(dto.start_time) : undefined,
      end_time:
        dto.end_time !== undefined ? parseTime(dto.end_time) : undefined,
      episode_number:
        dto.episode_number !== undefined ? dto.episode_number : undefined,
      notes: dto.notes !== undefined ? dto.notes : undefined,
      transcript_lines: resolvedLines,
    };
  }

  private async resolveTranscriptLines(
    lines: NonNullable<CreateSceneDto['transcript_lines']>,
  ) {
    return Promise.all(
      lines.map(async (line) => {
        let speaker_id: number | null = null;
        if (line.speaker_slug) {
          const speaker = await this.speakersRepo.findBySlug(line.speaker_slug);
          if (!speaker) {
            throw new BadRequestException(
              `Speaker slug "${line.speaker_slug}" not found`,
            );
          }
          speaker_id = speaker.id;
        }

        const slugs = (line.grammar_points ?? []).map((gp) => gp.slug);
        const grammarPoints =
          slugs.length > 0
            ? await this.grammarPointsRepo.findManyBySlugs(slugs)
            : [];
        const grammarPointMap = new Map(
          grammarPoints.map((gp) => [gp.slug, gp.id]),
        );

        const grammar_point_annotations = (line.grammar_points ?? []).map(
          (gp) => {
            const grammar_point_id = grammarPointMap.get(gp.slug);
            if (!grammar_point_id) {
              throw new BadRequestException(
                `Grammar point slug "${gp.slug}" not found`,
              );
            }
            return {
              grammar_point_id,
              start_index: gp.start_index ?? null,
              end_index: gp.end_index ?? null,
              matched_form: gp.matched_form ?? null,
            };
          },
        );

        const translations = line.translations
          ? Object.entries(line.translations).map(([locale, translation]) => ({
              locale,
              translation,
            }))
          : [];

        return {
          start_time: line.start_time != null ? parseTime(line.start_time) : null,
          speaker_id,
          japanese_text: line.japanese_text,
          translations,
          grammar_point_annotations,
        };
      }),
    );
  }
}
