import { apiFetch } from './client';
import type { Source, SourceScenesPage, SourcesPage } from './types';

export const sources = {
  list: (params?: { type?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.type) {
      qs.set('type', params.type);
    }
    if (params?.page) {
      qs.set('page', String(params.page));
    }
    if (params?.limit) {
      qs.set('limit', String(params.limit));
    }
    const query = qs.toString();
    return apiFetch<SourcesPage>(`/api/v1/sources${query ? `?${query}` : ''}`);
  },
  get: (slug: string) => apiFetch<Source>(`/api/v1/sources/${slug}`),
  scenes: (
    slug: string,
    params?: {
      grammar_points?: string[];
      grammar_match?: 'scene' | 'transcript_line';
      page?: number;
      limit?: number;
    }
  ) => {
    const qs = new URLSearchParams();
    if (params?.grammar_points?.length) {
      qs.set('grammar_points', params.grammar_points.join(','));
    }
    if (params?.grammar_match) {
      qs.set('grammar_match', params.grammar_match);
    }
    if (params?.page) {
      qs.set('page', String(params.page));
    }
    if (params?.limit) {
      qs.set('limit', String(params.limit));
    }
    const query = qs.toString();
    return apiFetch<SourceScenesPage>(`/api/v1/sources/${slug}/scenes${query ? `?${query}` : ''}`);
  },
};
