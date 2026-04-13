import { BadRequestException, Injectable } from '@nestjs/common';
import { parseTime } from '../utils/parse-time';
import {
  flattenScene,
  flattenSceneAll,
  flattenSource,
  flattenGrammarPoint,
} from '../utils/flatten';
import { ScenesRepository } from './scenes.repository';
import { SourcesRepository } from '../sources/sources.repository';
import { GrammarPointsRepository } from '../grammar-points/grammar-points.repository';
import { SpeakersRepository } from '../speakers/speakers.repository';
import { TranscriptLineInputDto } from './dto/create-scene.dto';

@Injectable()
export class ScenesService {
  constructor(
    private readonly scenesRepository: ScenesRepository,
    private readonly sourcesRepository: SourcesRepository,
    private readonly grammarPointsRepository: GrammarPointsRepository,
    private readonly speakersRepository: SpeakersRepository,
  ) {}

  private async resolveGrammarPointSlugs(
    lines: TranscriptLineInputDto[],
  ): Promise<Map<string, number>> {
    const allSlugs = [
      ...new Set(
        lines.flatMap((l) => l.grammar_points?.map((gp) => gp.slug) ?? []),
      ),
    ];
    if (!allSlugs.length) return new Map();

    const points =
      await this.grammarPointsRepository.findGrammarPointsBySlugIn(allSlugs);
    const missing = allSlugs.filter((s) => !points.find((p) => p.slug === s));
    if (missing.length) {
      throw new BadRequestException(
        `Unknown grammar point slugs: ${missing.join(', ')}`,
      );
    }
    return new Map(points.map((p) => [p.slug, p.id]));
  }

  private async resolveSpeakerSlugs(
    lines: TranscriptLineInputDto[],
  ): Promise<Map<string, number>> {
    const allSlugs = [
      ...new Set(
        lines.flatMap((l) => (l.speaker_slug ? [l.speaker_slug] : [])),
      ),
    ];
    if (!allSlugs.length) return new Map();

    const speakers =
      await this.speakersRepository.findSpeakersBySlugIn(allSlugs);
    const missing = allSlugs.filter(
      (s) => !speakers.find((sp) => sp.slug === s),
    );
    if (missing.length) {
      throw new BadRequestException(
        `Unknown speaker slugs: ${missing.join(', ')}`,
      );
    }
    return new Map(speakers.map((sp) => [sp.slug, sp.id]));
  }

  private buildLineData(
    lines: TranscriptLineInputDto[],
    grammarSlugToId: Map<string, number>,
    speakerSlugToId: Map<string, number>,
  ) {
    return lines.map(
      ({
        grammar_points,
        speaker_slug,
        translations,
        start_time,
        ...line
      }) => ({
        ...line,
        ...(start_time !== undefined
          ? { start_time: parseTime(start_time) }
          : {}),
        ...(speaker_slug
          ? { speaker_id: speakerSlugToId.get(speaker_slug)! }
          : {}),
        ...(translations && Object.keys(translations).length
          ? {
              translations: {
                create: Object.entries(translations).map(
                  ([locale, translation]) => ({
                    locale,
                    translation,
                  }),
                ),
              },
            }
          : {}),
        ...(grammar_points?.length
          ? {
              transcript_line_grammar_points: {
                create: grammar_points.map(
                  ({ slug, start_index, end_index, matched_form }) => ({
                    grammar_point_id: grammarSlugToId.get(slug)!,
                    ...(start_index !== undefined ? { start_index } : {}),
                    ...(end_index !== undefined ? { end_index } : {}),
                    ...(matched_form !== undefined ? { matched_form } : {}),
                  }),
                ),
              },
            }
          : {}),
      }),
    );
  }

  async listScenes(
    locale: string,
    options: {
      sourceSlugs: string[];
      grammarPointSlugs: string[];
      grammarMatch: 'scene' | 'transcript_line';
      youtube_video_id?: string;
      start_time?: number;
      end_time?: number;
      page: number;
      limit: number;
    },
  ) {
    const { scenes, total, availableSources, availableGrammarPoints } =
      await this.scenesRepository.findScenesPage(locale, options);
    const { page, limit } = options;
    return {
      scenes: scenes.map(flattenScene),
      total,
      page,
      totalPages: Math.ceil(total / (limit || 12)),
      available_sources: availableSources.map(flattenSource),
      available_grammar_points: availableGrammarPoints.map(flattenGrammarPoint),
    };
  }

  async getScene(id: number, locale: string) {
    const scene = await this.scenesRepository.findSceneById(id, locale);
    return scene ? flattenScene(scene) : null;
  }

  async createScene(body: {
    source_slug: string;
    youtube_video_id: string;
    start_time: number | string;
    end_time: number | string;
    episode_number?: number;
    notes?: string;
    transcript_lines: TranscriptLineInputDto[];
  }) {
    const source = await this.sourcesRepository.findSourceBySlug(
      body.source_slug,
      'en',
    );
    if (!source) {
      throw new BadRequestException(`Unknown source slug: ${body.source_slug}`);
    }

    const [grammarSlugToId, speakerSlugToId] = await Promise.all([
      this.resolveGrammarPointSlugs(body.transcript_lines),
      this.resolveSpeakerSlugs(body.transcript_lines),
    ]);

    const scene = await this.scenesRepository.createScene({
      source_id: source.id,
      youtube_video_id: body.youtube_video_id,
      start_time: parseTime(body.start_time),
      end_time: parseTime(body.end_time),
      ...(body.episode_number !== undefined
        ? { episode_number: body.episode_number }
        : {}),
      notes: body.notes,
      transcript_lines: {
        create: this.buildLineData(
          body.transcript_lines,
          grammarSlugToId,
          speakerSlugToId,
        ),
      },
    });

    return flattenSceneAll(scene);
  }

  async updateScene(
    id: number,
    body: {
      source_slug: string;
      youtube_video_id: string;
      start_time: number | string;
      end_time: number | string;
      episode_number?: number;
      notes?: string;
      transcript_lines: TranscriptLineInputDto[];
    },
  ) {
    const source = await this.sourcesRepository.findSourceBySlug(
      body.source_slug,
      'en',
    );
    if (!source) {
      throw new BadRequestException(`Unknown source slug: ${body.source_slug}`);
    }

    const [grammarSlugToId, speakerSlugToId] = await Promise.all([
      this.resolveGrammarPointSlugs(body.transcript_lines),
      this.resolveSpeakerSlugs(body.transcript_lines),
    ]);

    const scene = await this.scenesRepository.updateScene(id, {
      source_id: source.id,
      youtube_video_id: body.youtube_video_id,
      start_time: parseTime(body.start_time),
      end_time: parseTime(body.end_time),
      ...(body.episode_number !== undefined
        ? { episode_number: body.episode_number }
        : {}),
      notes: body.notes,
      transcript_lines: {
        deleteMany: {},
        create: this.buildLineData(
          body.transcript_lines,
          grammarSlugToId,
          speakerSlugToId,
        ),
      },
    });

    return flattenSceneAll(scene);
  }

  async patchScene(
    id: number,
    body: {
      source_slug?: string;
      youtube_video_id?: string;
      start_time?: number | string;
      end_time?: number | string;
      episode_number?: number;
      notes?: string;
    },
  ) {
    const existing = await this.scenesRepository.findSceneByIdAll(id);
    if (!existing) return null;

    let source_id: number | undefined;
    if (body.source_slug !== undefined) {
      const source = await this.sourcesRepository.findSourceBySlug(
        body.source_slug,
        'en',
      );
      if (!source) {
        throw new BadRequestException(
          `Unknown source slug: ${body.source_slug}`,
        );
      }
      source_id = source.id;
    }

    const scene = await this.scenesRepository.updateScene(id, {
      ...(source_id !== undefined ? { source_id } : {}),
      ...(body.youtube_video_id !== undefined
        ? { youtube_video_id: body.youtube_video_id }
        : {}),
      ...(body.start_time !== undefined
        ? { start_time: parseTime(body.start_time) }
        : {}),
      ...(body.end_time !== undefined
        ? { end_time: parseTime(body.end_time) }
        : {}),
      ...(body.episode_number !== undefined
        ? { episode_number: body.episode_number }
        : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
    });

    return flattenSceneAll(scene);
  }

  deleteScene(id: number) {
    return this.scenesRepository.deleteScene(id);
  }

  async updateTranslations(
    sceneId: number,
    locale: string,
    lines: { id: number; translation: string }[],
  ) {
    const existingLines =
      await this.scenesRepository.findTranscriptLinesBySceneId(sceneId);
    if (!existingLines.length) return null;

    const validIds = new Set(existingLines.map((l) => l.id));
    const missing = lines.filter((l) => !validIds.has(l.id)).map((l) => l.id);
    if (missing.length) {
      throw new BadRequestException(
        `Unknown transcript line ids: ${missing.join(', ')}`,
      );
    }

    await this.scenesRepository.upsertTranscriptLineTranslations(locale, lines);

    const scene = await this.scenesRepository.findSceneByIdAll(sceneId);
    return scene ? flattenSceneAll(scene) : null;
  }
}
