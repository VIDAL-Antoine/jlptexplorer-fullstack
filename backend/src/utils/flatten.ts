export function flattenGrammarPoint(gp: {
  id: number;
  slug: string;
  title: string;
  romaji: string;
  jlpt_level: string;
  created_at: Date;
  translations: { meaning: string; notes: string | null }[];
}) {
  const { translations, ...rest } = gp;
  return {
    ...rest,
    meaning: translations[0]?.meaning ?? null,
    notes: translations[0]?.notes ?? null,
  };
}

export function flattenSource(source: {
  id: number;
  slug: string;
  type: string;
  cover_image_url: string | null;
  japanese_title: string | null;
  created_at: Date;
  translations: { title: string }[];
}) {
  const { translations, ...rest } = source;
  return { ...rest, title: translations[0]?.title ?? null };
}

export function flattenSpeaker(speaker: {
  id: number;
  slug: string;
  name_japanese: string | null;
  image_url: string | null;
  translations: { name: string; description: string | null }[];
}) {
  const { translations, ...rest } = speaker;
  return {
    ...rest,
    name: translations[0]?.name ?? null,
    description: translations[0]?.description ?? null,
  };
}

export function flattenTranscriptLine(line: {
  id: number;
  scene_id: number;
  start_time: number | null;
  speaker_id: number | null;
  japanese_text: string;
  translations: { translation: string | null }[];
}) {
  const { translations, ...rest } = line;
  return { ...rest, translation: translations[0]?.translation ?? null };
}

export function flattenScene(scene: {
  id: number;
  source_id: number;
  youtube_video_id: string;
  start_time: number;
  end_time: number;
  episode_number: number;
  notes: string | null;
  created_at: Date;
  sources: Parameters<typeof flattenSource>[0];
  transcript_lines: Array<
    Parameters<typeof flattenTranscriptLine>[0] & {
      speakers: Parameters<typeof flattenSpeaker>[0] | null;
      transcript_line_grammar_points: Array<{
        id: number;
        transcript_line_id: number;
        grammar_point_id: number;
        start_index: number | null;
        end_index: number | null;
        matched_form: string | null;
        grammar_points: Parameters<typeof flattenGrammarPoint>[0] | null;
      }>;
    }
  >;
}) {
  return {
    ...scene,
    sources: flattenSource(scene.sources),
    transcript_lines: scene.transcript_lines.map((line) => ({
      ...flattenTranscriptLine(line),
      speakers: line.speakers ? flattenSpeaker(line.speakers) : null,
      transcript_line_grammar_points: line.transcript_line_grammar_points.map((tlgp) => ({
        ...tlgp,
        grammar_points: tlgp.grammar_points ? flattenGrammarPoint(tlgp.grammar_points) : null,
      })),
    })),
  };
}

export function flattenTranscriptLineAll<
  T extends {
    translations: Array<{ locale: string; translation: string | null }>;
  },
>(line: T) {
  const { translations, ...rest } = line;
  return {
    ...rest,
    translations: Object.fromEntries(translations.map((t) => [t.locale, t.translation])),
  };
}

export function flattenSceneAll<
  T extends {
    transcript_lines: Array<{
      translations: Array<{ locale: string; translation: string | null }>;
    }>;
  },
>(scene: T) {
  return {
    ...scene,
    transcript_lines: scene.transcript_lines.map((line) => {
      const { translations, ...rest } = line;
      return {
        ...rest,
        translations: Object.fromEntries(translations.map((t) => [t.locale, t.translation])),
      };
    }),
  };
}
