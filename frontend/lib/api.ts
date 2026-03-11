import { type JlptLevel } from '../constants/jlpt';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options);

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  grammarPoints: {
    list: (level?: string) =>
      apiFetch<GrammarPoint[]>(`/api/v1/grammar-points${level ? `?level=${level}` : ''}`),
    get: (slug: string) => apiFetch<GrammarPointWithScenes>(`/api/v1/grammar-points/${slug}`),
  },
  sources: {
    list: () => apiFetch<Source[]>('/api/v1/sources'),
    get: (slug: string) => apiFetch<SourceWithScenes>(`/api/v1/sources/${slug}`),
  },
  scenes: {
    list: (params?: { sourceId?: number; level?: string }) => {
      const query = new URLSearchParams();
      if (params?.sourceId) query.set('sourceId', String(params.sourceId));
      if (params?.level) query.set('level', params.level);
      const qs = query.toString();
      return apiFetch<Scene[]>(`/api/v1/scenes${qs ? `?${qs}` : ''}`);
    },
    get: (id: number) => apiFetch<SceneWithDetails>(`/api/v1/scenes/${id}`),
  },
};

// Types
export type GrammarPoint = {
  id: number;
  slug: string;
  title: string;
  romaji: string;
  meaning: string;
  jlpt_level: JlptLevel;
  notes: string | null;
  created_at: string;
};

export type Source = {
  id: number;
  slug: string;
  title: string;
  japanese_title: string | null;
  type: 'game' | 'anime' | 'movie' | 'series' | 'music';
  cover_image_url: string | null;
  created_at: string;
};

export type TranscriptLineGrammarPoint = {
  transcript_line_id: number;
  grammar_point_id: number;
  grammar_points: GrammarPoint;
};

export type Speaker = {
  id: number;
  slug: string;
  name_english: string;
  name_japanese: string | null;
  description: string | null;
  image_url: string | null;
};

export type TranscriptLine = {
  id: number;
  scene_id: number;
  position: number;
  speaker_id: number | null;
  speakers: Speaker | null;
  text: string;
  translation: string | null;
  transcript_line_grammar_points: TranscriptLineGrammarPoint[];
};

export type Scene = {
  id: number;
  source_id: number;
  youtube_video_id: string;
  start_time: number;
  end_time: number;
  notes: string | null;
  created_at: string;
};

export type SceneWithDetails = Scene & {
  sources: Source;
  transcript_lines: TranscriptLine[];
};

export type GrammarPointWithScenes = GrammarPoint & {
  scenes: SceneWithDetails[];
};

export type SourceWithScenes = Source & {
  scenes: SceneWithDetails[];
};
