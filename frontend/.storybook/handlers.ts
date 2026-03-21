import { http, HttpResponse } from 'msw';
import {
  allGrammarPoints,
  allSources,
  gpWaTopicDetail,
  scenesPageResponse,
  sourceDragonBallZDetail,
  sourceFinalFantasyVIIDetail,
} from './fixtures';

const BASE = 'http://localhost:8080';

export const defaultHandlers = [
  http.get(`${BASE}/api/v1/:locale/grammar-points`, ({ request }) => {
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
          (gp.meaning ?? '').toLowerCase().includes(search)
      );
    }

    return HttpResponse.json({
      grammar_points: points,
      total: points.length,
      page: 1,
      totalPages: 1,
    });
  }),

  http.get(`${BASE}/api/v1/:locale/grammar-points/:slug`, () => HttpResponse.json(gpWaTopicDetail)),

  http.get(`${BASE}/api/v1/:locale/grammar-points/:slug/scenes`, () =>
    HttpResponse.json({ scenes: [], total: 0, page: 1, totalPages: 0, available_sources: [] })
  ),

  http.get(`${BASE}/api/v1/:locale/sources`, ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    const sources = type ? allSources.filter((s) => s.type === type) : allSources;
    const available_types = Array.from(new Set(allSources.map((s) => s.type)));

    return HttpResponse.json({
      sources,
      total: sources.length,
      page: 1,
      totalPages: 1,
      available_types,
    });
  }),

  http.get(`${BASE}/api/v1/:locale/sources/dragon-ball-z`, () =>
    HttpResponse.json(sourceDragonBallZDetail)
  ),

  http.get(`${BASE}/api/v1/:locale/sources/final-fantasy-vii`, () =>
    HttpResponse.json(sourceFinalFantasyVIIDetail)
  ),

  http.get(`${BASE}/api/v1/:locale/sources/:slug`, () =>
    HttpResponse.json(sourceDragonBallZDetail)
  ),

  http.get(`${BASE}/api/v1/:locale/sources/:slug/scenes`, () =>
    HttpResponse.json({
      scenes: [],
      total: 0,
      page: 1,
      totalPages: 0,
      available_grammar_points: [],
    })
  ),

  http.get(`${BASE}/api/v1/:locale/scenes`, () => HttpResponse.json(scenesPageResponse)),

  http.get(`${BASE}/api/v1/:locale/speakers`, () =>
    HttpResponse.json({ speakers: [], total: 0, page: 1, totalPages: 1 })
  ),
];
