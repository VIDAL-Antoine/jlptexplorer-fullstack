import { type JlptLevel } from '@/constants/jlpt';

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
    list: (
      locale: string,
      params?: { jlptLevel?: string; search?: string; page?: number; limit?: number }
    ) => {
      const query = new URLSearchParams();
      if (params?.jlptLevel) {
        query.set('jlpt_level', params.jlptLevel);
      }
      if (params?.search) {
        query.set('search', params.search);
      }
      if (params?.page) {
        query.set('page', String(params.page));
      }
      if (params?.limit) {
        query.set('limit', String(params.limit));
      }
      const qs = query.toString();
      return apiFetch<GrammarPointsPage>(`/api/v1/${locale}/grammar-points${qs ? `?${qs}` : ''}`);
    },
    get: (locale: string, slug: string) =>
      apiFetch<GrammarPointDetail>(`/api/v1/${locale}/grammar-points/${slug}`),
    scenes: (
      locale: string,
      slug: string,
      params?: { page?: number; limit?: number; sources?: string[] }
    ) => {
      const query = new URLSearchParams();
      if (params?.page) {
        query.set('page', String(params.page));
      }
      if (params?.limit) {
        query.set('limit', String(params.limit));
      }
      if (params?.sources?.length) {
        query.set('sources', params.sources.join(','));
      }
      const qs = query.toString();
      return apiFetch<GrammarPointScenesPage>(
        `/api/v1/${locale}/grammar-points/${slug}/scenes${qs ? `?${qs}` : ''}`
      );
    },
  },
  sources: {
    list: (locale: string, type?: string) => {
      const query = new URLSearchParams();
      if (type) {
        query.set('type', type);
      }
      const qs = query.toString();
      return apiFetch<Source[]>(`/api/v1/${locale}/sources${qs ? `?${qs}` : ''}`);
    },
    get: (locale: string, slug: string) =>
      apiFetch<SourceDetail>(`/api/v1/${locale}/sources/${slug}`),
    scenes: (
      locale: string,
      slug: string,
      params?: { page?: number; limit?: number; grammarPoints?: string[] }
    ) => {
      const query = new URLSearchParams();
      if (params?.page) {
        query.set('page', String(params.page));
      }
      if (params?.limit) {
        query.set('limit', String(params.limit));
      }
      if (params?.grammarPoints?.length) {
        query.set('grammar_points', params.grammarPoints.join(','));
      }
      const qs = query.toString();
      return apiFetch<SourceScenesPage>(
        `/api/v1/${locale}/sources/${slug}/scenes${qs ? `?${qs}` : ''}`
      );
    },
  },
  scenes: {
    list: (locale: string, params?: { sourceId?: number; jlptLevel?: string }) => {
      const query = new URLSearchParams();
      if (params?.sourceId) {
        query.set('source_id', String(params.sourceId));
      }
      if (params?.jlptLevel) {
        query.set('jlpt_level', params.jlptLevel);
      }
      const qs = query.toString();
      return apiFetch<Scene[]>(`/api/v1/${locale}/scenes${qs ? `?${qs}` : ''}`);
    },
    get: (locale: string, id: number) =>
      apiFetch<SceneWithDetails>(`/api/v1/${locale}/scenes/${id}`),
  },
};

// Types
export type GrammarPoint = {
  id: number;
  slug: string;
  title: string;
  romaji: string;
  meaning: string | null;
  jlpt_level: JlptLevel;
  notes: string | null;
  created_at: string;
  has_scenes: boolean;
};

export type Source = {
  id: number;
  slug: string;
  title: string | null;
  japanese_title: string | null;
  type: 'game' | 'anime' | 'movie' | 'series' | 'music';
  cover_image_url: string | null;
  created_at: string;
};

export type TranscriptLineGrammarPoint = {
  id: number;
  transcript_line_id: number;
  grammar_point_id: number;
  start_index: number | null;
  end_index: number | null;
  matched_form: string | null;
  grammar_points: GrammarPoint;
};

export type Speaker = {
  id: number;
  slug: string;
  name: string | null;
  name_japanese: string | null;
  description: string | null;
  image_url: string | null;
};

export type TranscriptLine = {
  id: number;
  scene_id: number;
  start_time: number | null;
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
  episode_number: number;
  notes: string | null;
  created_at: string;
};

export type SceneWithDetails = Scene & {
  sources: Source;
  transcript_lines: TranscriptLine[];
};

export type GrammarPointsPage = {
  grammar_points: GrammarPoint[];
  total: number;
  page: number;
  totalPages: number;
};

export type GrammarPointDetail = GrammarPoint & {
  scenes_count: number;
  available_sources: Source[];
};

export type GrammarPointScenesPage = {
  scenes: SceneWithDetails[];
  total: number;
  page: number;
  totalPages: number;
  available_sources: Source[];
};

export type SourceDetail = Source & {
  scenes_count: number;
  grammar_points: GrammarPoint[];
};

export type SourceScenesPage = {
  scenes: SceneWithDetails[];
  total: number;
  page: number;
  totalPages: number;
  available_grammar_points: GrammarPoint[];
};
