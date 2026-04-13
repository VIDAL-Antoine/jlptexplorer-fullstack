import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TranscriptLineGrammarPointsService } from './transcript-line-grammar-points.service';
import { TranscriptLineGrammarPointsRepository } from './transcript-line-grammar-points.repository';
import { GrammarPointsRepository } from '../grammar-points/grammar-points.repository';
import { TranscriptLinesRepository } from '../transcript-lines/transcript-lines.repository';

const mockTlgpRepository = {
  findAllTranscriptLineGrammarPoints: jest.fn(),
  findTranscriptLineGrammarPointById: jest.fn(),
  createTranscriptLineGrammarPoint: jest.fn(),
  updateTranscriptLineGrammarPoint: jest.fn(),
  deleteTranscriptLineGrammarPoint: jest.fn(),
};

const mockGrammarPointsRepository = {
  findGrammarPointsBySlugIn: jest.fn(),
};

const mockTranscriptLinesRepository = {
  findTranscriptLineByIdAll: jest.fn(),
};

describe('TranscriptLineGrammarPointsService', () => {
  let service: TranscriptLineGrammarPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranscriptLineGrammarPointsService,
        { provide: TranscriptLineGrammarPointsRepository, useValue: mockTlgpRepository },
        { provide: GrammarPointsRepository, useValue: mockGrammarPointsRepository },
        { provide: TranscriptLinesRepository, useValue: mockTranscriptLinesRepository },
      ],
    }).compile();

    service = module.get<TranscriptLineGrammarPointsService>(
      TranscriptLineGrammarPointsService,
    );
    jest.clearAllMocks();
  });

  describe('deleteTranscriptLineGrammarPoint', () => {
    it('returns null when annotation does not exist', async () => {
      mockTlgpRepository.findTranscriptLineGrammarPointById.mockResolvedValue(null);

      const result = await service.deleteTranscriptLineGrammarPoint(999);

      expect(result).toBeNull();
      expect(mockTlgpRepository.deleteTranscriptLineGrammarPoint).not.toHaveBeenCalled();
    });
  });

  describe('createTranscriptLineGrammarPoint', () => {
    it('throws BadRequestException when grammar point slug is unknown', async () => {
      mockTranscriptLinesRepository.findTranscriptLineByIdAll.mockResolvedValue({ id: 1 });
      mockGrammarPointsRepository.findGrammarPointsBySlugIn.mockResolvedValue([]);

      await expect(
        service.createTranscriptLineGrammarPoint({
          transcript_line_id: 1,
          grammar_point_slug: 'nonexistent',
          start_index: 0,
          end_index: 1,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
