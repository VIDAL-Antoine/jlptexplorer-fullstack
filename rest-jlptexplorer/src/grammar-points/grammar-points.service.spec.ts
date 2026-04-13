import { Test, TestingModule } from '@nestjs/testing';
import { GrammarPointsService } from './grammar-points.service';
import { GrammarPointsRepository } from './grammar-points.repository';

const mockGrammarPointsRepository = {
  findGrammarPoints: jest.fn(),
  findGrammarPointBySlug: jest.fn(),
  findGrammarPointMeta: jest.fn(),
  findGrammarPointScenes: jest.fn(),
  findGrammarPointsBySlugIn: jest.fn(),
  createGrammarPoint: jest.fn(),
  updateGrammarPoint: jest.fn(),
  patchGrammarPoint: jest.fn(),
  deleteGrammarPoint: jest.fn(),
};

describe('GrammarPointsService', () => {
  let service: GrammarPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrammarPointsService,
        { provide: GrammarPointsRepository, useValue: mockGrammarPointsRepository },
      ],
    }).compile();

    service = module.get<GrammarPointsService>(GrammarPointsService);
    jest.clearAllMocks();
  });

  describe('getGrammarPoint', () => {
    it('returns null when the grammar point does not exist', async () => {
      mockGrammarPointsRepository.findGrammarPointBySlug.mockResolvedValue(null);

      const result = await service.getGrammarPoint('unknown', 'en');

      expect(result).toBeNull();
      expect(mockGrammarPointsRepository.findGrammarPointBySlug).toHaveBeenCalledWith(
        'unknown',
        'en',
      );
    });
  });

  describe('listGrammarPoints', () => {
    it('returns grammar points with pagination metadata', async () => {
      mockGrammarPointsRepository.findGrammarPoints.mockResolvedValue([
        { id: 1, slug: 'wa-topic', _count: { transcript_line_grammar_points: 3 }, translations: [] },
        { id: 2, slug: 'ga-subject-marker', _count: { transcript_line_grammar_points: 0 }, translations: [] },
      ]);

      const result = await service.listGrammarPoints('en', {}, { page: 1, limit: 10 });

      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.grammar_points).toHaveLength(2);
      // grammar points with scenes should come first
      expect(result.grammar_points[0].has_scenes).toBe(true);
      expect(result.grammar_points[1].has_scenes).toBe(false);
    });
  });
});
