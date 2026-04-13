import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TranscriptLineGrammarPointsController } from './transcript-line-grammar-points.controller';
import { TranscriptLineGrammarPointsService } from './transcript-line-grammar-points.service';

const mockTlgpService = {
  listTranscriptLineGrammarPoints: jest.fn(),
  getTranscriptLineGrammarPointById: jest.fn(),
  createTranscriptLineGrammarPoint: jest.fn(),
  updateTranscriptLineGrammarPoint: jest.fn(),
  patchTranscriptLineGrammarPoint: jest.fn(),
  deleteTranscriptLineGrammarPoint: jest.fn(),
};

describe('TranscriptLineGrammarPointsController', () => {
  let controller: TranscriptLineGrammarPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranscriptLineGrammarPointsController],
      providers: [
        { provide: TranscriptLineGrammarPointsService, useValue: mockTlgpService },
      ],
    }).compile();

    controller = module.get<TranscriptLineGrammarPointsController>(
      TranscriptLineGrammarPointsController,
    );
    jest.clearAllMocks();
  });

  describe('getTranscriptLineGrammarPoint', () => {
    it('returns the annotation when found', async () => {
      const mockResult = { id: 1, grammar_point_id: 5, start_index: 0, end_index: 1 };
      mockTlgpService.getTranscriptLineGrammarPointById.mockResolvedValue(mockResult);

      const result = await controller.getTranscriptLineGrammarPoint(1);

      expect(result).toEqual(mockResult);
      expect(mockTlgpService.getTranscriptLineGrammarPointById).toHaveBeenCalledWith(1);
    });

    it('throws NotFoundException when annotation does not exist', async () => {
      mockTlgpService.getTranscriptLineGrammarPointById.mockResolvedValue(null);

      await expect(controller.getTranscriptLineGrammarPoint(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
