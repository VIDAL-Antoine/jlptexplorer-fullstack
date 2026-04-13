import { BadRequestException, Injectable } from '@nestjs/common';
import { parseTime } from '../utils/parse-time';
import {
  flattenTranscriptLineFull,
  flattenTranscriptLineAll,
} from '../utils/flatten';
import { TranscriptLinesRepository } from './transcript-lines.repository';
import { ScenesRepository } from '../scenes/scenes.repository';
import { GrammarPointsRepository } from '../grammar-points/grammar-points.repository';
import { SpeakersRepository } from '../speakers/speakers.repository';
import type { GrammarPointAnnotationDto } from '../scenes/dto/create-scene.dto';

@Injectable()
export class TranscriptLinesService {
  constructor(
    private readonly transcriptLinesRepository: TranscriptLinesRepository,
    private readonly scenesRepository: ScenesRepository,
    private readonly grammarPointsRepository: GrammarPointsRepository,
    private readonly speakersRepository: SpeakersRepository,
  ) {}

  private async resolveGrammarPointSlugs(
    slugs: string[],
  ): Promise<Map<string, number>> {
    if (!slugs.length) return new Map();
    const points =
      await this.grammarPointsRepository.findGrammarPointsBySlugIn(slugs);
    const missing = slugs.filter((s) => !points.find((p) => p.slug === s));
    if (missing.length) {
      throw new BadRequestException(
        `Unknown grammar point slugs: ${missing.join(', ')}`,
      );
    }
    return new Map(points.map((p) => [p.slug, p.id]));
  }

  private async resolveSpeakerSlug(slug: string): Promise<number> {
    const speakers = await this.speakersRepository.findSpeakersBySlugIn([slug]);
    if (!speakers.length) {
      throw new BadRequestException(`Unknown speaker slug: ${slug}`);
    }
    return speakers[0].id;
  }

  async listTranscriptLines(
    locale: string,
    filters: {
      sceneId?: number;
      speakerSlug?: string;
      startTime?: number;
      grammarPointSlugs?: string[];
      page: number;
      limit: number;
    },
  ) {
    if (filters.sceneId !== undefined) {
      const sceneExists = await this.scenesRepository.findSceneByIdAll(
        filters.sceneId,
      );
      if (!sceneExists) return null;
    }
    const { lines, total } =
      await this.transcriptLinesRepository.findTranscriptLines(locale, filters);
    return {
      lines: lines.map(flattenTranscriptLineFull),
      total,
      page: filters.page,
      totalPages: Math.ceil(total / (filters.limit || 20)),
    };
  }

  async getTranscriptLine(id: number, locale: string) {
    const line = await this.transcriptLinesRepository.findTranscriptLineById(
      id,
      locale,
    );
    return line ? flattenTranscriptLineFull(line) : null;
  }

  async createTranscriptLine(body: {
    scene_id: number;
    start_time?: number | string;
    speaker_slug?: string;
    japanese_text: string;
    translations?: Record<string, string>;
    grammar_points?: GrammarPointAnnotationDto[];
  }) {
    const sceneExists = await this.scenesRepository.findSceneByIdAll(
      body.scene_id,
    );
    if (!sceneExists) {
      throw new BadRequestException(`Unknown scene id: ${body.scene_id}`);
    }

    const [speakerId, grammarSlugToId] = await Promise.all([
      body.speaker_slug
        ? this.resolveSpeakerSlug(body.speaker_slug)
        : Promise.resolve(undefined),
      body.grammar_points?.length
        ? this.resolveGrammarPointSlugs(
            body.grammar_points.map((gp) => gp.slug),
          )
        : Promise.resolve(new Map<string, number>()),
    ]);

    const line = await this.transcriptLinesRepository.createTranscriptLine({
      scene_id: body.scene_id,
      japanese_text: body.japanese_text,
      start_time: parseTime(body.start_time ?? 0),
      ...(speakerId !== undefined ? { speaker_id: speakerId } : {}),
      ...(body.translations && Object.keys(body.translations).length
        ? {
            translations: {
              create: Object.entries(body.translations).map(
                ([locale, translation]) => ({
                  locale,
                  translation,
                }),
              ),
            },
          }
        : {}),
      ...(body.grammar_points?.length
        ? {
            transcript_line_grammar_points: {
              create: body.grammar_points.map(
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
    });

    return flattenTranscriptLineAll(line);
  }

  async updateTranscriptLine(
    id: number,
    body: {
      start_time: number | string;
      speaker_slug?: string;
      japanese_text: string;
      translations?: Record<string, string>;
      grammar_points?: GrammarPointAnnotationDto[];
    },
  ) {
    const existing =
      await this.transcriptLinesRepository.findTranscriptLineByIdAll(id);
    if (!existing) return null;

    const [speakerId, grammarSlugToId] = await Promise.all([
      body.speaker_slug
        ? this.resolveSpeakerSlug(body.speaker_slug)
        : Promise.resolve(undefined),
      body.grammar_points?.length
        ? this.resolveGrammarPointSlugs(
            body.grammar_points.map((gp) => gp.slug),
          )
        : Promise.resolve(new Map<string, number>()),
    ]);

    const resolvedGrammarPoints = (body.grammar_points ?? []).map(
      ({ slug, start_index, end_index, matched_form }) => ({
        grammar_point_id: grammarSlugToId.get(slug)!,
        ...(start_index !== undefined ? { start_index } : {}),
        ...(end_index !== undefined ? { end_index } : {}),
        ...(matched_form !== undefined ? { matched_form } : {}),
      }),
    );

    const line = await this.transcriptLinesRepository.replaceTranscriptLine(
      id,
      {
        japanese_text: body.japanese_text,
        start_time: parseTime(body.start_time),
        ...(speakerId !== undefined
          ? { speaker_id: speakerId }
          : { speaker_id: null }),
        ...(body.translations
          ? {
              translations: {
                deleteMany: {},
                create: Object.entries(body.translations).map(
                  ([locale, translation]) => ({
                    locale,
                    translation,
                  }),
                ),
              },
            }
          : { translations: { deleteMany: {} } }),
      },
      resolvedGrammarPoints,
    );

    return flattenTranscriptLineAll(line);
  }

  async patchTranscriptLine(
    id: number,
    body: {
      japanese_text?: string;
      start_time?: number | string;
      speaker_slug?: string;
      translations?: Record<string, string>;
    },
  ) {
    const existing =
      await this.transcriptLinesRepository.findTranscriptLineByIdAll(id);
    if (!existing) return null;

    const speakerId =
      body.speaker_slug !== undefined
        ? await this.resolveSpeakerSlug(body.speaker_slug)
        : undefined;

    await this.transcriptLinesRepository.updateTranscriptLine(id, {
      ...(body.japanese_text !== undefined
        ? { japanese_text: body.japanese_text }
        : {}),
      ...(body.start_time !== undefined
        ? { start_time: parseTime(body.start_time) }
        : {}),
      ...(speakerId !== undefined ? { speaker_id: speakerId } : {}),
    });

    if (body.translations && Object.keys(body.translations).length) {
      await this.transcriptLinesRepository.upsertTranscriptLineTranslations(
        id,
        body.translations,
      );
    }

    const updated =
      await this.transcriptLinesRepository.findTranscriptLineByIdAll(id);
    return flattenTranscriptLineAll(updated!);
  }

  async deleteTranscriptLine(id: number) {
    const existing =
      await this.transcriptLinesRepository.findTranscriptLineByIdAll(id);
    if (!existing) return null;
    await this.transcriptLinesRepository.deleteTranscriptLine(id);
    return true;
  }
}
