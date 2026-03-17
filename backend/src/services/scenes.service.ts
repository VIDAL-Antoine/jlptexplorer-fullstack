import { parseTime } from "@/utils/parse-time";
import { flattenScene, flattenSceneAll } from "@/utils/flatten";
import * as scenesRepository from "@/repositories/scenes.repository";
import * as sourcesRepository from "@/repositories/sources.repository";
import { findGrammarPointsBySlugIn } from "@/repositories/grammar-points.repository";
import { findSpeakersBySlugIn } from "@/repositories/speakers.repository";
import type { TranscriptLineInput } from "@/types/common";
import type { jlpt_level } from "@/generated/prisma/enums";

async function resolveGrammarPointSlugs(lines: TranscriptLineInput[]): Promise<Map<string, number>> {
  const allSlugs = [...new Set(lines.flatMap((l) => l.grammar_points?.map((gp) => gp.slug) ?? []))];
  if (!allSlugs.length) {return new Map();}

  const points = await findGrammarPointsBySlugIn(allSlugs);
  const missing = allSlugs.filter((s) => !points.find((p) => p.slug === s));
  if (missing.length) {
    throw Object.assign(new Error(`Unknown grammar point slugs: ${missing.join(", ")}`), { statusCode: 400 });
  }

  return new Map(points.map((p) => [p.slug, p.id]));
}

async function resolveSpeakerSlugs(lines: TranscriptLineInput[]): Promise<Map<string, number>> {
  const allSlugs = [...new Set(lines.flatMap((l) => (l.speaker_slug ? [l.speaker_slug] : [])))];
  if (!allSlugs.length) {return new Map();}

  const speakers = await findSpeakersBySlugIn(allSlugs);
  const missing = allSlugs.filter((s) => !speakers.find((sp) => sp.slug === s));
  if (missing.length) {
    throw Object.assign(new Error(`Unknown speaker slugs: ${missing.join(", ")}`), { statusCode: 400 });
  }

  return new Map(speakers.map((sp) => [sp.slug, sp.id]));
}

function buildLineData(
  lines: TranscriptLineInput[],
  grammarSlugToId: Map<string, number>,
  speakerSlugToId: Map<string, number>
) {
  return lines.map(({ grammar_points, speaker_slug, translations, start_time, ...line }) => ({
    ...line,
    ...(start_time !== undefined ? { start_time: parseTime(start_time) } : {}),
    ...(speaker_slug ? { speaker_id: speakerSlugToId.get(speaker_slug)! } : {}),
    ...(translations && Object.keys(translations).length
      ? { translations: { create: Object.entries(translations).map(([locale, translation]) => ({ locale, translation })) } }
      : {}),
    ...(grammar_points?.length
      ? {
          transcript_line_grammar_points: {
            create: grammar_points.map(({ slug, start_index, end_index, matched_form }) => ({
              grammar_point_id: grammarSlugToId.get(slug)!,
              ...(start_index !== undefined ? { start_index } : {}),
              ...(end_index !== undefined ? { end_index } : {}),
              ...(matched_form !== undefined ? { matched_form } : {}),
            })),
          },
        }
      : {}),
  }));
}

export async function listScenes(locale: string, filters: { source_id?: number; jlpt_level?: jlpt_level }) {
  const scenes = await scenesRepository.findScenes(locale, filters);
  return scenes.map(flattenScene);
}

export async function getScene(id: number, locale: string) {
  const scene = await scenesRepository.findSceneById(id, locale);
  return scene ? flattenScene(scene) : null;
}

export async function createScene(body: {
  source_slug: string;
  youtube_video_id: string;
  start_time: number | string;
  end_time: number | string;
  episode_number?: number;
  notes?: string;
  transcript_lines: TranscriptLineInput[];
}) {
  const { source_slug, youtube_video_id, start_time, end_time, episode_number, notes, transcript_lines } = body;

  const source = await sourcesRepository.findSourceIdBySlug(source_slug);
  if (!source) {
    throw Object.assign(new Error(`Unknown source slug: ${source_slug}`), { statusCode: 400 });
  }

  const [grammarSlugToId, speakerSlugToId] = await Promise.all([
    resolveGrammarPointSlugs(transcript_lines),
    resolveSpeakerSlugs(transcript_lines),
  ]);

  const scene = await scenesRepository.createScene({
    source_id: source.id,
    youtube_video_id,
    start_time: parseTime(start_time),
    end_time: parseTime(end_time),
    ...(episode_number !== undefined ? { episode_number } : {}),
    notes,
    transcript_lines: { create: buildLineData(transcript_lines, grammarSlugToId, speakerSlugToId) },
  });

  return flattenSceneAll(scene);
}

export async function updateScene(
  id: number,
  body: {
    source_slug: string;
    youtube_video_id: string;
    start_time: number | string;
    end_time: number | string;
    episode_number?: number;
    notes?: string;
    transcript_lines: TranscriptLineInput[];
  }
) {
  const { source_slug, youtube_video_id, start_time, end_time, episode_number, notes, transcript_lines } = body;

  const source = await sourcesRepository.findSourceIdBySlug(source_slug);
  if (!source) {
    throw Object.assign(new Error(`Unknown source slug: ${source_slug}`), { statusCode: 400 });
  }

  const [grammarSlugToId, speakerSlugToId] = await Promise.all([
    resolveGrammarPointSlugs(transcript_lines),
    resolveSpeakerSlugs(transcript_lines),
  ]);

  const scene = await scenesRepository.updateScene(id, {
    source_id: source.id,
    youtube_video_id,
    start_time: parseTime(start_time),
    end_time: parseTime(end_time),
    ...(episode_number !== undefined ? { episode_number } : {}),
    notes,
    transcript_lines: {
      deleteMany: {},
      create: buildLineData(transcript_lines, grammarSlugToId, speakerSlugToId),
    },
  });

  return flattenSceneAll(scene);
}

export async function deleteScene(id: number) {
  return scenesRepository.deleteScene(id);
}

export async function updateTranslations(
  sceneId: number,
  locale: string,
  lines: { id: number; translation: string }[]
) {
  const existingLines = await scenesRepository.findTranscriptLinesBySceneId(sceneId);
  if (!existingLines.length) {return null;}

  const validIds = new Set(existingLines.map((l) => l.id));
  const missing = lines.filter((l) => !validIds.has(l.id)).map((l) => l.id);
  if (missing.length) {
    throw Object.assign(new Error(`Unknown transcript line ids: ${missing.join(", ")}`), { statusCode: 400 });
  }

  await scenesRepository.upsertTranscriptLineTranslations(locale, lines);

  const scene = await scenesRepository.findSceneByIdAll(sceneId);
  return scene ? flattenSceneAll(scene) : null;
}
