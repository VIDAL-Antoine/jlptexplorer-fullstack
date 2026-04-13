import { Injectable } from '@nestjs/common';
import {
  flattenGrammarPoint,
  flattenScene,
  flattenSource,
} from '../utils/flatten';
import { GrammarPointsRepository } from './grammar-points.repository';
import { jlpt_level } from '@prisma/client';

@Injectable()
export class GrammarPointsService {
  constructor(
    private readonly grammarPointsRepository: GrammarPointsRepository,
  ) {}

  async listGrammarPoints(
    locale: string,
    filters: { jlpt_level?: jlpt_level; search?: string },
    pagination: { page: number; limit: number },
  ) {
    const { page, limit } = pagination;
    const allGrammarPoints =
      await this.grammarPointsRepository.findGrammarPoints(locale, filters);

    const mapped = allGrammarPoints.map((gp) => ({
      ...flattenGrammarPoint(gp),
      has_scenes: gp._count.transcript_line_grammar_points > 0,
    }));

    mapped.sort((a, b) => {
      if (a.has_scenes !== b.has_scenes) return a.has_scenes ? -1 : 1;
      return 0;
    });

    const total = mapped.length;
    return {
      grammar_points: mapped.slice((page - 1) * limit, page * limit),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getGrammarPoint(slug: string, locale: string) {
    const grammarPoint =
      await this.grammarPointsRepository.findGrammarPointBySlug(slug, locale);
    if (!grammarPoint) return null;

    const { scenesCount, availableSources } =
      await this.grammarPointsRepository.findGrammarPointMeta(
        grammarPoint.id,
        locale,
      );

    return {
      ...flattenGrammarPoint(grammarPoint),
      scenes_count: scenesCount,
      available_sources: availableSources.map(flattenSource),
    };
  }

  async getGrammarPointScenes(
    slug: string,
    locale: string,
    options: { sourceSlugs: string[]; page: number; limit: number },
  ) {
    const grammarPoint =
      await this.grammarPointsRepository.findGrammarPointBySlug(slug, 'en');
    if (!grammarPoint) return null;

    const { scenes, total, availableSources } =
      await this.grammarPointsRepository.findGrammarPointScenes(
        grammarPoint.id,
        locale,
        options,
      );

    return {
      scenes: scenes.map(flattenScene),
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      available_sources: availableSources.map(flattenSource),
    };
  }

  private toTranslationsRecord(
    translations: { locale: string; meaning: string; notes: string | null }[],
  ) {
    return Object.fromEntries(
      translations.map((t) => [
        t.locale,
        { meaning: t.meaning, notes: t.notes },
      ]),
    );
  }

  async createGrammarPoint(data: {
    slug: string;
    title: string;
    romaji: string;
    jlpt_level: jlpt_level;
    translations: { locale: string; meaning: string; notes?: string }[];
  }) {
    const gp = await this.grammarPointsRepository.createGrammarPoint(data);
    return { ...gp, translations: this.toTranslationsRecord(gp.translations) };
  }

  async updateGrammarPoint(
    paramSlug: string,
    data: {
      slug: string;
      title: string;
      romaji: string;
      jlpt_level: jlpt_level;
      translations: { locale: string; meaning: string; notes?: string }[];
    },
  ) {
    const existing = await this.grammarPointsRepository.findGrammarPointBySlug(
      paramSlug,
      'en',
    );
    if (!existing) return null;

    const gp = await this.grammarPointsRepository.updateGrammarPoint(
      paramSlug,
      existing.id,
      data,
    );
    return { ...gp, translations: this.toTranslationsRecord(gp.translations) };
  }

  async patchGrammarPoint(
    paramSlug: string,
    data: {
      slug?: string;
      title?: string;
      romaji?: string;
      jlpt_level?: jlpt_level;
      translations?: { locale: string; meaning?: string; notes?: string }[];
    },
  ) {
    const existing = await this.grammarPointsRepository.findGrammarPointBySlug(
      paramSlug,
      'en',
    );
    if (!existing) return null;

    const gp = await this.grammarPointsRepository.patchGrammarPoint(
      paramSlug,
      existing.id,
      data,
    );
    return { ...gp, translations: this.toTranslationsRecord(gp.translations) };
  }

  deleteGrammarPoint(slug: string) {
    return this.grammarPointsRepository.deleteGrammarPoint(slug);
  }
}
