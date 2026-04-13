import { Injectable } from '@nestjs/common';
import {
  flattenSource,
  flattenGrammarPoint,
  flattenScene,
} from '../utils/flatten';
import { SourcesRepository } from './sources.repository';
import { source_type } from '@prisma/client';

@Injectable()
export class SourcesService {
  constructor(private readonly sourcesRepository: SourcesRepository) {}

  async listSources(
    locale: string,
    options: { type?: source_type; page: number; limit: number },
  ) {
    const { type, page, limit } = options;
    const all = await this.sourcesRepository.findSources(locale);
    const mapped = all.map(flattenSource);
    const available_types = Array.from(new Set(mapped.map((s) => s.type)));
    const filtered = type ? mapped.filter((s) => s.type === type) : mapped;
    const total = filtered.length;
    return {
      sources: filtered.slice((page - 1) * limit, page * limit),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      available_types,
    };
  }

  async getSource(slug: string, locale: string) {
    const source = await this.sourcesRepository.findSourceBySlug(slug, locale);
    if (!source) return null;

    const { scenesCount, grammarPoints } =
      await this.sourcesRepository.findSourceMeta(source.id, locale);

    return {
      ...flattenSource(source),
      scenes_count: scenesCount,
      grammar_points: grammarPoints.map(flattenGrammarPoint),
    };
  }

  async getSourceScenes(
    slug: string,
    locale: string,
    options: {
      grammarPointSlugs: string[];
      grammarMatch: 'scene' | 'transcript_line';
      page: number;
      limit: number;
    },
  ) {
    const source = await this.sourcesRepository.findSourceBySlug(slug, locale);
    if (!source) return null;

    const { scenes, total, availableGrammarPoints } =
      await this.sourcesRepository.findSourceScenes(source.id, locale, options);

    return {
      scenes: scenes.map(flattenScene),
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      available_grammar_points: availableGrammarPoints.map(flattenGrammarPoint),
    };
  }

  async createSource(data: {
    slug: string;
    japanese_title?: string;
    type: source_type;
    cover_image_url?: string;
    translations: Record<string, string>;
  }) {
    const source = await this.sourcesRepository.createSource(data);
    return {
      ...source,
      translations: Object.fromEntries(
        source.translations.map((t) => [t.locale, t.title]),
      ),
    };
  }

  async updateSource(
    paramSlug: string,
    data: {
      slug: string;
      japanese_title?: string;
      type: source_type;
      cover_image_url?: string;
      translations: Record<string, string>;
    },
  ) {
    const existing = await this.sourcesRepository.findSourceBySlug(
      paramSlug,
      'en',
    );
    if (!existing) return null;

    const source = await this.sourcesRepository.updateSource(
      paramSlug,
      existing.id,
      data,
    );
    return {
      ...source,
      translations: Object.fromEntries(
        source.translations.map((t) => [t.locale, t.title]),
      ),
    };
  }

  async patchSource(
    paramSlug: string,
    data: {
      slug?: string;
      japanese_title?: string;
      type?: source_type;
      cover_image_url?: string;
      translations?: Record<string, string>;
    },
  ) {
    const existing = await this.sourcesRepository.findSourceBySlug(
      paramSlug,
      'en',
    );
    if (!existing) return null;

    const source = await this.sourcesRepository.patchSource(
      paramSlug,
      existing.id,
      data,
    );
    return {
      ...source,
      translations: Object.fromEntries(
        source.translations.map((t) => [t.locale, t.title]),
      ),
    };
  }

  deleteSource(slug: string) {
    return this.sourcesRepository.deleteSource(slug);
  }
}
