import { apiFetch } from './client';
import type { Speaker, SpeakersPage } from './types';

export const speakers = {
  list: (params?: { slug?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.slug) {
      qs.set('slug', params.slug);
    }
    if (params?.page) {
      qs.set('page', String(params.page));
    }
    if (params?.limit) {
      qs.set('limit', String(params.limit));
    }
    const query = qs.toString();
    return apiFetch<SpeakersPage>(`/api/v1/speakers${query ? `?${query}` : ''}`);
  },
  get: (slug: string) => apiFetch<Speaker>(`/api/v1/speakers/${slug}`),
};
