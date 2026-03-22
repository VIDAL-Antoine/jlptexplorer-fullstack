import { flattenGrammarPoint, flattenScene, flattenSource } from '@/utils/flatten';
import * as grammarPointsRepository from '@/repositories/grammar-points.repository';
import type { jlpt_level } from '@prisma/client';

export async function listGrammarPoints(
  locale: string,
  filters: { jlpt_level?: jlpt_level; search?: string },
  pagination: { page: number; limit: number },
) {
  const { page, limit } = pagination;
  const allGrammarPoints = await grammarPointsRepository.findGrammarPoints(locale, filters);

  const mapped = allGrammarPoints.map((gp) => ({
    ...flattenGrammarPoint(gp),
    has_scenes: gp._count.transcript_line_grammar_points > 0,
  }));

  // Stable sort: grammar points with scenes first, then those without
  mapped.sort((a, b) => {
    if (a.has_scenes !== b.has_scenes) {
      return a.has_scenes ? -1 : 1;
    }
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

export async function getGrammarPoint(slug: string, locale: string) {
  const grammarPoint = await grammarPointsRepository.findGrammarPointBySlug(slug, locale);
  if (!grammarPoint) {
    return null;
  }

  const { scenesCount, availableSources } = await grammarPointsRepository.findGrammarPointMeta(
    grammarPoint.id,
    locale,
  );

  return {
    ...flattenGrammarPoint(grammarPoint),
    scenes_count: scenesCount,
    available_sources: availableSources.map(flattenSource),
  };
}

export async function getGrammarPointScenes(
  slug: string,
  locale: string,
  options: { sourceSlugs: string[]; page: number; limit: number },
) {
  const grammarPoint = await grammarPointsRepository.findGrammarPointIdBySlug(slug);
  if (!grammarPoint) {
    return null;
  }

  const { scenes, total, availableSources } = await grammarPointsRepository.findGrammarPointScenes(
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

function toTranslationsRecord(translations: { locale: string; meaning: string; notes: string | null }[]) {
  return Object.fromEntries(translations.map((t) => [t.locale, { meaning: t.meaning, notes: t.notes }]));
}

export async function createGrammarPoint(data: {
  slug: string;
  title: string;
  romaji: string;
  jlpt_level: jlpt_level;
  translations: { locale: string; meaning: string; notes?: string }[];
}) {
  const gp = await grammarPointsRepository.createGrammarPoint(data);
  return { ...gp, translations: toTranslationsRecord(gp.translations) };
}

export async function updateGrammarPoint(
  paramSlug: string,
  data: {
    slug: string;
    title: string;
    romaji: string;
    jlpt_level: jlpt_level;
    translations: { locale: string; meaning: string; notes?: string }[];
  },
) {
  const existing = await grammarPointsRepository.findGrammarPointIdBySlug(paramSlug);
  if (!existing) {
    return null;
  }

  const gp = await grammarPointsRepository.updateGrammarPoint(paramSlug, existing.id, data);
  return { ...gp, translations: toTranslationsRecord(gp.translations) };
}

export async function patchGrammarPoint(
  paramSlug: string,
  data: {
    slug?: string;
    title?: string;
    romaji?: string;
    jlpt_level?: jlpt_level;
    translations?: { locale: string; meaning?: string; notes?: string }[];
  },
) {
  const existing = await grammarPointsRepository.findGrammarPointIdBySlug(paramSlug);
  if (!existing) {
    return null;
  }

  const gp = await grammarPointsRepository.patchGrammarPoint(paramSlug, existing.id, data);
  return { ...gp, translations: toTranslationsRecord(gp.translations) };
}

export async function deleteGrammarPoint(slug: string) {
  return grammarPointsRepository.deleteGrammarPoint(slug);
}
