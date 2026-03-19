import { parseTime } from '@/utils/parse-time';
import { flattenTranscriptLine, flattenTranscriptLineAll } from '@/utils/flatten';
import * as transcriptLinesRepository from '@/repositories/transcript-lines.repository';
import * as scenesRepository from '@/repositories/scenes.repository';
import { findGrammarPointsBySlugIn } from '@/repositories/grammar-points.repository';
import { findSpeakersBySlugIn } from '@/repositories/speakers.repository';
import type { TranscriptLineCreateBody, TranscriptLineUpdateBody } from '@/schemas/transcript-lines.schema';

async function resolveGrammarPointSlugs(slugs: string[]): Promise<Map<string, number>> {
  if (!slugs.length) {
    return new Map();
  }
  const points = await findGrammarPointsBySlugIn(slugs);
  const missing = slugs.filter((s) => !points.find((p) => p.slug === s));
  if (missing.length) {
    throw Object.assign(new Error(`Unknown grammar point slugs: ${missing.join(', ')}`), {
      statusCode: 400,
    });
  }
  return new Map(points.map((p) => [p.slug, p.id]));
}

async function resolveSpeakerSlug(slug: string): Promise<number> {
  const speakers = await findSpeakersBySlugIn([slug]);
  if (!speakers.length) {
    throw Object.assign(new Error(`Unknown speaker slug: ${slug}`), { statusCode: 400 });
  }
  return speakers[0].id;
}

const DEFAULT_LIMIT = 20;

export async function listTranscriptLines(
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
    const sceneExists = await scenesRepository.findSceneByIdAll(filters.sceneId);
    if (!sceneExists) {
      return null;
    }
  }
  const { lines, total } = await transcriptLinesRepository.findTranscriptLines(locale, filters);
  return {
    lines: lines.map(flattenTranscriptLine),
    total,
    page: filters.page,
    totalPages: Math.ceil(total / (filters.limit || DEFAULT_LIMIT)),
  };
}

export async function getTranscriptLine(id: number, locale: string) {
  const line = await transcriptLinesRepository.findTranscriptLineById(id, locale);
  return line ? flattenTranscriptLine(line) : null;
}

export async function createTranscriptLine(body: TranscriptLineCreateBody) {
  const { scene_id, speaker_slug, grammar_points, translations, start_time, japanese_text } = body;

  const sceneExists = await scenesRepository.findSceneByIdAll(scene_id);
  if (!sceneExists) {
    throw Object.assign(new Error(`Unknown scene id: ${scene_id}`), { statusCode: 400 });
  }

  const [speakerId, grammarSlugToId] = await Promise.all([
    speaker_slug ? resolveSpeakerSlug(speaker_slug) : Promise.resolve(undefined),
    grammar_points?.length
      ? resolveGrammarPointSlugs(grammar_points.map((gp: { slug: string }) => gp.slug))
      : Promise.resolve(new Map<string, number>()),
  ]);

  const line = await transcriptLinesRepository.createTranscriptLine({
    scene_id,
    japanese_text,
    start_time: parseTime(start_time),
    ...(speakerId !== undefined ? { speaker_id: speakerId } : {}),
    ...(translations && Object.keys(translations).length
      ? {
          translations: {
            create: Object.entries(translations).map(([locale, translation]: [string, string]) => ({
              locale,
              translation,
            })),
          },
        }
      : {}),
    ...(grammar_points?.length
      ? {
          transcript_line_grammar_points: {
            create: grammar_points.map(
              ({ slug, start_index, end_index, matched_form }: {
                slug: string;
                start_index?: number;
                end_index?: number;
                matched_form?: string;
              }) => ({
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

export async function updateTranscriptLine(id: number, body: TranscriptLineUpdateBody) {
  const existing = await transcriptLinesRepository.findTranscriptLineByIdAll(id);
  if (!existing) {
    return null;
  }

  const { speaker_slug, grammar_points, translations, start_time, japanese_text } = body;

  const [speakerId, grammarSlugToId] = await Promise.all([
    speaker_slug ? resolveSpeakerSlug(speaker_slug) : Promise.resolve(undefined),
    grammar_points?.length
      ? resolveGrammarPointSlugs(grammar_points.map((gp: { slug: string }) => gp.slug))
      : Promise.resolve(new Map<string, number>()),
  ]);

  const resolvedGrammarPoints = (grammar_points ?? []).map(
    ({ slug, start_index, end_index, matched_form }: {
      slug: string;
      start_index?: number;
      end_index?: number;
      matched_form?: string;
    }) => ({
      grammar_point_id: grammarSlugToId.get(slug)!,
      ...(start_index !== undefined ? { start_index } : {}),
      ...(end_index !== undefined ? { end_index } : {}),
      ...(matched_form !== undefined ? { matched_form } : {}),
    }),
  );

  const line = await transcriptLinesRepository.replaceTranscriptLine(
    id,
    {
      japanese_text,
      start_time: parseTime(start_time),
      ...(speakerId !== undefined ? { speaker_id: speakerId } : { speaker_id: null }),
      ...(translations
        ? {
            translations: {
              deleteMany: {},
              create: Object.entries(translations).map(([locale, translation]: [string, string]) => ({
                locale,
                translation,
              })),
            },
          }
        : { translations: { deleteMany: {} } }),
    },
    resolvedGrammarPoints,
  );

  return flattenTranscriptLineAll(line);
}

export async function patchTranscriptLine(
  id: number,
  body: {
    japanese_text?: string;
    start_time?: number | string;
    speaker_slug?: string;
    translations?: Record<string, string>;
  },
) {
  const existing = await transcriptLinesRepository.findTranscriptLineByIdAll(id);
  if (!existing) {
    return null;
  }

  const speakerId =
    body.speaker_slug !== undefined ? await resolveSpeakerSlug(body.speaker_slug) : undefined;

  await transcriptLinesRepository.updateTranscriptLine(id, {
    ...(body.japanese_text !== undefined ? { japanese_text: body.japanese_text } : {}),
    ...(body.start_time !== undefined ? { start_time: parseTime(body.start_time) } : {}),
    ...(speakerId !== undefined ? { speaker_id: speakerId } : {}),
  });

  if (body.translations && Object.keys(body.translations).length) {
    await transcriptLinesRepository.upsertTranscriptLineTranslations(id, body.translations);
  }

  const updated = await transcriptLinesRepository.findTranscriptLineByIdAll(id);
  return flattenTranscriptLineAll(updated!);
}

export async function deleteTranscriptLine(id: number) {
  const existing = await transcriptLinesRepository.findTranscriptLineByIdAll(id);
  if (!existing) {
    return null;
  }
  await transcriptLinesRepository.deleteTranscriptLine(id);
  return true;
}
