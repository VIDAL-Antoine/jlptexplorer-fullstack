import { Test, TestingModule } from '@nestjs/testing';
import { SourcesService } from './sources.service';
import { SourcesRepository } from './sources.repository';

const mockSourcesRepository = {
  findSources: jest.fn(),
  findSourceBySlug: jest.fn(),
  findSourceMeta: jest.fn(),
  findSourceScenes: jest.fn(),
  createSource: jest.fn(),
  updateSource: jest.fn(),
  patchSource: jest.fn(),
  deleteSource: jest.fn(),
};

describe('SourcesService', () => {
  let service: SourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SourcesService,
        { provide: SourcesRepository, useValue: mockSourcesRepository },
      ],
    }).compile();

    service = module.get<SourcesService>(SourcesService);
    jest.clearAllMocks();
  });

  describe('getSource', () => {
    it('returns null when source does not exist', async () => {
      mockSourcesRepository.findSourceBySlug.mockResolvedValue(null);

      const result = await service.getSource('unknown', 'en');

      expect(result).toBeNull();
    });
  });

  describe('listSources', () => {
    it('returns an empty list when no sources exist', async () => {
      mockSourcesRepository.findSources.mockResolvedValue([]);

      const result = await service.listSources('en', { page: 1, limit: 10 });

      expect(result.sources).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
