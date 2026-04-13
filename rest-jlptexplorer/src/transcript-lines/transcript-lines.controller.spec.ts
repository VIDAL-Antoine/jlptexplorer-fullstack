import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TranscriptLinesController } from './transcript-lines.controller';
import { TranscriptLinesService } from './transcript-lines.service';

const mockTranscriptLinesService = {
  listTranscriptLines: jest.fn(),
  getTranscriptLine: jest.fn(),
  createTranscriptLine: jest.fn(),
  updateTranscriptLine: jest.fn(),
  patchTranscriptLine: jest.fn(),
  deleteTranscriptLine: jest.fn(),
};

describe('TranscriptLinesController', () => {
  let controller: TranscriptLinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranscriptLinesController],
      providers: [
        { provide: TranscriptLinesService, useValue: mockTranscriptLinesService },
      ],
    }).compile();

    controller = module.get<TranscriptLinesController>(TranscriptLinesController);
    jest.clearAllMocks();
  });

  describe('getTranscriptLine', () => {
    it('returns the transcript line when found', async () => {
      const mockResult = { id: 1, japanese_text: '行くよ' };
      mockTranscriptLinesService.getTranscriptLine.mockResolvedValue(mockResult);

      const result = await controller.getTranscriptLine('en', 1);

      expect(result).toEqual(mockResult);
      expect(mockTranscriptLinesService.getTranscriptLine).toHaveBeenCalledWith(1, 'en');
    });

    it('throws NotFoundException when transcript line does not exist', async () => {
      mockTranscriptLinesService.getTranscriptLine.mockResolvedValue(null);

      await expect(controller.getTranscriptLine('en', 999)).rejects.toThrow(NotFoundException);
    });
  });
});
