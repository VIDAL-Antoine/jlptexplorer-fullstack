import { flattenSource, flattenGrammarPoint, flattenScene } from '@/utils/flatten';
import * as sourcesRepository from '@/repositories/sources.repository';
import type { source_type } from '@prisma/client';

export async function listSources(
  locale: string,
  options: { type?: source_type; page: number; limit: number },
) {
  const { type, page, limit } = options;
  const all = await sourcesRepository.findSources(locale);
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

export async function getSource(slug: string, locale: string) {
  const source = await sourcesRepository.findSourceBySlug(slug, locale);
  if (!source) {
    return null;
  }

  const grammarPoints = Array.from(
    new Map(
      source.scenes
        .flatMap((s) => s.transcript_lines)
        .flatMap((l) => l.transcript_line_grammar_points)
        .map((tlgp) => tlgp.grammar_points)
        .filter((gp): gp is NonNullable<typeof gp> => gp !== null)
        .map((gp) => [gp.id, flattenGrammarPoint(gp)]),
    ).values(),
  );

  return {
    ...flattenSource({
      id: source.id,
      slug: source.slug,
      type: source.type,
      cover_image_url: source.cover_image_url,
      japanese_title: source.japanese_title,
      created_at: source.created_at,
      translations: source.translations,
    }),
    scenes_count: source.scenes.length,
    grammar_points: grammarPoints,
  };
}

export async function getSourceScenes(
  slug: string,
  locale: string,
  options: { grammarPointSlugs: string[]; grammarMatch: 'scene' | 'transcript_line'; page: number; limit: number },
) {
  const source = await sourcesRepository.findSourceIdBySlug(slug);
  if (!source) {
    return null;
  }

  const { scenes, total, availableGrammarPoints } = await sourcesRepository.findSourceScenes(
    source.id,
    locale,
    options,
  );

  return {
    scenes: scenes.map(flattenScene),
    total,
    page: options.page,
    totalPages: Math.ceil(total / options.limit),
    available_grammar_points: availableGrammarPoints.map(flattenGrammarPoint),
  };
}

export async function createSource(data: {
  slug: string;
  japanese_title?: string;
  type: source_type;
  cover_image_url?: string;
  translations: Record<string, string>;
}) {
  const source = await sourcesRepository.createSource(data);
  return {
    ...source,
    translations: Object.fromEntries(source.translations.map((t) => [t.locale, t.title])),
  };
}

export async function updateSource(
  paramSlug: string,
  data: {
    slug: string;
    japanese_title?: string;
    type: source_type;
    cover_image_url?: string;
    translations: Record<string, string>;
  },
) {
  const existing = await sourcesRepository.findSourceIdBySlug(paramSlug);
  if (!existing) {
    return null;
  }

  const source = await sourcesRepository.updateSource(paramSlug, existing.id, data);
  return {
    ...source,
    translations: Object.fromEntries(source.translations.map((t) => [t.locale, t.title])),
  };
}

export async function patchSource(
  paramSlug: string,
  data: {
    slug?: string;
    japanese_title?: string;
    type?: source_type;
    cover_image_url?: string;
    translations?: Record<string, string>;
  },
) {
  const existing = await sourcesRepository.findSourceIdBySlug(paramSlug);
  if (!existing) {
    return null;
  }

  const source = await sourcesRepository.patchSource(paramSlug, existing.id, data);
  return {
    ...source,
    translations: Object.fromEntries(source.translations.map((t) => [t.locale, t.title])),
  };
}

export async function deleteSource(slug: string) {
  return sourcesRepository.deleteSource(slug);
}
