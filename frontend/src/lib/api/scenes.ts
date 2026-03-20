import { apiFetch } from './client';
import type { ScenesPage, SceneWithDetails } from './types';

export const scenes = {
  list: (
    locale: string,
    params?: { sources?: string[]; grammarPoints?: string[]; page?: number; limit?: number }
  ) => {
    const query = new URLSearchParams();
    if (params?.sources?.length) {query.set('sources', params.sources.join(','));}
    if (params?.grammarPoints?.length) {query.set('grammar_points', params.grammarPoints.join(','));}
    if (params?.page) {query.set('page', String(params.page));}
    if (params?.limit) {query.set('limit', String(params.limit));}
    const qs = query.toString();
    return apiFetch<ScenesPage>(`/api/v1/${locale}/scenes${qs ? `?${qs}` : ''}`);
  },
  get: (locale: string, id: number) =>
    apiFetch<SceneWithDetails>(`/api/v1/${locale}/scenes/${id}`),
};
