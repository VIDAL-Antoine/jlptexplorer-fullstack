import { apiFetch } from './client';
import type { GrammarPoint, GrammarPointScenesPage, GrammarPointsPage } from './types';

export const grammarPoints = {
  list: (params?: { jlpt_level?: string; search?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.jlpt_level) {
      qs.set('jlpt_level', params.jlpt_level);
    }
    if (params?.search) {
      qs.set('search', params.search);
    }
    if (params?.page) {
      qs.set('page', String(params.page));
    }
    if (params?.limit) {
      qs.set('limit', String(params.limit));
    }
    const query = qs.toString();
    return apiFetch<GrammarPointsPage>(`/api/v1/grammar-points${query ? `?${query}` : ''}`);
  },
  get: (slug: string) => apiFetch<GrammarPoint>(`/api/v1/grammar-points/${slug}`),
  scenes: (slug: string, params?: { sources?: string[]; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.sources?.length) {
      qs.set('sources', params.sources.join(','));
    }
    if (params?.page) {
      qs.set('page', String(params.page));
    }
    if (params?.limit) {
      qs.set('limit', String(params.limit));
    }
    const query = qs.toString();
    return apiFetch<GrammarPointScenesPage>(
      `/api/v1/grammar-points/${slug}/scenes${query ? `?${query}` : ''}`
    );
  },
};
