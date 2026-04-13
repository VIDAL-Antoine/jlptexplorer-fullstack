import { Test, TestingModule } from '@nestjs/testing';
import { TranscriptLinesService } from './transcript-lines.service';
import { TranscriptLinesRepository } from './transcript-lines.repository';
import { ScenesRepository } from '../scenes/scenes.repository';
import { GrammarPointsRepository } from '../grammar-points/grammar-points.repository';
import { SpeakersRepository } from '../speakers/speakers.repository';

const mockTranscriptLinesRepository = {
  findTranscriptLines: jest.fn(),
  findTranscriptLineById: jest.fn(),
  findTranscriptLineByIdAll: jest.fn(),
  createTranscriptLine: jest.fn(),
  updateTranscriptLine: jest.fn(),
  replaceTranscriptLine: jest.fn(),
  upsertTranscriptLineTranslations: jest.fn(),
  deleteTranscriptLine: jest.fn(),
};

describe('TranscriptLinesService', () => {
  let service: TranscriptLinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranscriptLinesService,
        { provide: TranscriptLinesRepository, useValue: mockTranscriptLinesRepository },
        { provide: ScenesRepository, useValue: {} },
        { provide: GrammarPointsRepository, useValue: {} },
        { provide: SpeakersRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<TranscriptLinesService>(TranscriptLinesService);
    jest.clearAllMocks();
  });

  describe('getTranscriptLine', () => {
    it('returns null when transcript line does not exist', async () => {
      mockTranscriptLinesRepository.findTranscriptLineById.mockResolvedValue(null);

      const result = await service.getTranscriptLine(999, 'en');

      expect(result).toBeNull();
    });
  });

  describe('deleteTranscriptLine', () => {
    it('returns null when transcript line does not exist', async () => {
      mockTranscriptLinesRepository.findTranscriptLineByIdAll.mockResolvedValue(null);

      const result = await service.deleteTranscriptLine(999);

      expect(result).toBeNull();
      expect(mockTranscriptLinesRepository.deleteTranscriptLine).not.toHaveBeenCalled();
    });
  });
});
