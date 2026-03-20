import { apiFetch } from './client';
import type { SpeakersPage } from './types';

export const speakers = {
  list: (locale: string, params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) {query.set('page', String(params.page));}
    if (params?.limit) {query.set('limit', String(params.limit));}
    const qs = query.toString();
    return apiFetch<SpeakersPage>(`/api/v1/${locale}/speakers${qs ? `?${qs}` : ''}`);
  },
};
