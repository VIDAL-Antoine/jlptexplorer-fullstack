import { apiFetch } from './client';
import type { GrammarPointDetail, GrammarPointScenesPage, GrammarPointsPage } from './types';

export const grammarPoints = {
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
};
