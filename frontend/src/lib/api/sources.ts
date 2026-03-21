import { apiFetch } from './client';
import type { SourcesPage, SourceDetail, SourceScenesPage } from './types';

export const sources = {
  list: (locale: string, params?: { type?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.type) {query.set('type', params.type);}
    if (params?.page) {query.set('page', String(params.page));}
    if (params?.limit) {query.set('limit', String(params.limit));}
    const qs = query.toString();
    return apiFetch<SourcesPage>(`/api/v1/${locale}/sources${qs ? `?${qs}` : ''}`);
  },
  get: (locale: string, slug: string) =>
    apiFetch<SourceDetail>(`/api/v1/${locale}/sources/${slug}`),
  scenes: (
    locale: string,
    slug: string,
    params?: { page?: number; limit?: number; grammarPoints?: string[]; grammarMatch?: 'scene' | 'transcript_line' }
  ) => {
    const query = new URLSearchParams();
    if (params?.page) {query.set('page', String(params.page));}
    if (params?.limit) {query.set('limit', String(params.limit));}
    if (params?.grammarPoints?.length) {query.set('grammar_points', params.grammarPoints.join(','));}
    if (params?.grammarMatch) {query.set('grammar_match', params.grammarMatch);}
    const qs = query.toString();
    return apiFetch<SourceScenesPage>(
      `/api/v1/${locale}/sources/${slug}/scenes${qs ? `?${qs}` : ''}`
    );
  },
};
