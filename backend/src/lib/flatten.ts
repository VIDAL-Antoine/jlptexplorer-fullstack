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
  return { ...rest, meaning: translations[0]?.meaning ?? null, notes: translations[0]?.notes ?? null };
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
  return { ...rest, name: translations[0]?.name ?? null, description: translations[0]?.description ?? null };
}

export function flattenTranscriptLine(line: {
  id: number;
  scene_id: number;
  position: number;
  speaker_id: number | null;
  text: string;
  translations: { translation: string | null }[];
}) {
  const { translations, ...rest } = line;
  return { ...rest, translation: translations[0]?.translation ?? null };
}
