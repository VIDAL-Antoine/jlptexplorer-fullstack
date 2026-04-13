import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GrammarPointsController } from './grammar-points.controller';
import { GrammarPointsService } from './grammar-points.service';

const mockGrammarPointsService = {
  listGrammarPoints: jest.fn(),
  getGrammarPoint: jest.fn(),
  getGrammarPointScenes: jest.fn(),
  createGrammarPoint: jest.fn(),
  updateGrammarPoint: jest.fn(),
  patchGrammarPoint: jest.fn(),
  deleteGrammarPoint: jest.fn(),
};

describe('GrammarPointsController', () => {
  let controller: GrammarPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrammarPointsController],
      providers: [
        { provide: GrammarPointsService, useValue: mockGrammarPointsService },
      ],
    }).compile();

    controller = module.get<GrammarPointsController>(GrammarPointsController);
    jest.clearAllMocks();
  });

  describe('getGrammarPoint', () => {
    it('returns the grammar point when found', async () => {
      const mockResult = { slug: 'wa-topic', title: 'は' };
      mockGrammarPointsService.getGrammarPoint.mockResolvedValue(mockResult);

      const result = await controller.getGrammarPoint('en', 'wa-topic');

      expect(result).toEqual(mockResult);
      expect(mockGrammarPointsService.getGrammarPoint).toHaveBeenCalledWith('wa-topic', 'en');
    });

    it('throws NotFoundException when grammar point does not exist', async () => {
      mockGrammarPointsService.getGrammarPoint.mockResolvedValue(null);

      await expect(controller.getGrammarPoint('en', 'unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
