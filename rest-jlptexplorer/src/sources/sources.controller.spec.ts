import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';

const mockSourcesService = {
  listSources: jest.fn(),
  getSource: jest.fn(),
  getSourceScenes: jest.fn(),
  createSource: jest.fn(),
  updateSource: jest.fn(),
  patchSource: jest.fn(),
  deleteSource: jest.fn(),
};

describe('SourcesController', () => {
  let controller: SourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SourcesController],
      providers: [{ provide: SourcesService, useValue: mockSourcesService }],
    }).compile();

    controller = module.get<SourcesController>(SourcesController);
    jest.clearAllMocks();
  });

  describe('getSource', () => {
    it('returns the source when found', async () => {
      const mockResult = { slug: 'dragon-ball-z', type: 'anime' };
      mockSourcesService.getSource.mockResolvedValue(mockResult);

      const result = await controller.getSource('en', 'dragon-ball-z');

      expect(result).toEqual(mockResult);
      expect(mockSourcesService.getSource).toHaveBeenCalledWith('dragon-ball-z', 'en');
    });

    it('throws NotFoundException when source does not exist', async () => {
      mockSourcesService.getSource.mockResolvedValue(null);

      await expect(controller.getSource('en', 'unknown')).rejects.toThrow(NotFoundException);
    });
  });
});
