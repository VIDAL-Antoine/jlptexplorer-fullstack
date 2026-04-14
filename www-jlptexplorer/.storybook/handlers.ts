import { http, HttpResponse } from 'msw';
import { allGrammarPoints, allSources, gpWaTopic, scenesPageResponse } from './fixtures';

const BASE = 'http://localhost:8080';

export const defaultHandlers = [
  http.get(`${BASE}/api/v1/grammar-points`, ({ request }) => {
    const url = new URL(request.url);
    const level = url.searchParams.get('jlpt_level');
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';

    let points = allGrammarPoints;
    if (level) {
      points = points.filter((gp) => gp.jlpt_level === level);
    }
    if (search) {
      points = points.filter(
        (gp) =>
          gp.title.includes(search) ||
          (gp.romaji ?? '').toLowerCase().includes(search) ||
          gp.translations.some((t) => t.meaning.toLowerCase().includes(search))
      );
    }

    return HttpResponse.json({ items: points, total: points.length });
  }),

  http.get(`${BASE}/api/v1/grammar-points/:slug`, () => HttpResponse.json(gpWaTopic)),

  http.get(`${BASE}/api/v1/grammar-points/:slug/scenes`, () =>
    HttpResponse.json({ items: [], total: 0, availableSources: [] })
  ),

  http.get(`${BASE}/api/v1/sources`, ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const sources = type ? allSources.filter((s) => s.type === type) : allSources;
    return HttpResponse.json({ items: sources, total: sources.length });
  }),

  http.get(`${BASE}/api/v1/sources/:slug/scenes`, () =>
    HttpResponse.json({ items: [], total: 0, availableGrammarPoints: [] })
  ),

  http.get(`${BASE}/api/v1/sources/:slug`, () => HttpResponse.json(allSources[0])),

  http.get(`${BASE}/api/v1/scenes`, () => HttpResponse.json(scenesPageResponse)),

  http.get(`${BASE}/api/v1/speakers`, () => HttpResponse.json({ items: [], total: 0 })),
];
