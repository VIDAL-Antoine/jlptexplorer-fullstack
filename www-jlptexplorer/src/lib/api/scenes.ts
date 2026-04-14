import { apiFetch } from './client';
import type { ScenesPage, SceneWithDetails } from './types';

export const scenes = {
  list: (params?: {
    sources?: string[];
    grammar_points?: string[];
    grammar_match?: 'scene' | 'transcript_line';
    youtube_video_id?: string;
    start_time?: number;
    end_time?: number;
    page?: number;
    limit?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.sources?.length) {
      qs.set('sources', params.sources.join(','));
    }
    if (params?.grammar_points?.length) {
      qs.set('grammar_points', params.grammar_points.join(','));
    }
    if (params?.grammar_match) {
      qs.set('grammar_match', params.grammar_match);
    }
    if (params?.youtube_video_id) {
      qs.set('youtube_video_id', params.youtube_video_id);
    }
    if (params?.start_time !== undefined) {
      qs.set('start_time', String(params.start_time));
    }
    if (params?.end_time !== undefined) {
      qs.set('end_time', String(params.end_time));
    }
    if (params?.page) {
      qs.set('page', String(params.page));
    }
    if (params?.limit) {
      qs.set('limit', String(params.limit));
    }
    const query = qs.toString();
    return apiFetch<ScenesPage>(`/api/v1/scenes${query ? `?${query}` : ''}`);
  },
  get: (id: number) => apiFetch<SceneWithDetails>(`/api/v1/scenes/${id}`),
};
