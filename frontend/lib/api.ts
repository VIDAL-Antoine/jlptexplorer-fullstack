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
    get: (slug: string) => apiFetch<GrammarPointWithClips>(`/api/v1/grammar-points/${slug}`),
  },
  sources: {
    list: () => apiFetch<Source[]>('/api/v1/sources'),
    get: (slug: string) => apiFetch<SourceWithClips>(`/api/v1/sources/${slug}`),
  },
  clips: {
    list: (params?: { sourceId?: number; level?: string }) => {
      const query = new URLSearchParams();
      if (params?.sourceId) query.set('sourceId', String(params.sourceId));
      if (params?.level) query.set('level', params.level);
      const qs = query.toString();
      return apiFetch<Clip[]>(`/api/v1/clips${qs ? `?${qs}` : ''}`);
    },
    get: (id: number) => apiFetch<ClipWithDetails>(`/api/v1/clips/${id}`),
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

export type Clip = {
  id: number;
  source_id: number;
  youtube_video_id: string;
  start_time: number;
  end_time: number;
  transcript: string;
  translation: string | null;
  notes: string | null;
  created_at: string;
};

export type GrammarPointWithClips = GrammarPoint & {
  clip_grammar_points: Array<{
    clips: Clip & { sources: Source };
  }>;
};

export type SourceWithClips = Source & {
  clips: Array<Clip & {
    clip_grammar_points: Array<{ grammar_points: GrammarPoint }>;
  }>;
};

export type ClipWithDetails = Clip & {
  sources: Source;
  clip_grammar_points: Array<{ grammar_points: GrammarPoint }>;
};
