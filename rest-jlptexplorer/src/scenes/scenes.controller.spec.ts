import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ScenesController } from './scenes.controller';
import { ScenesService } from './scenes.service';

const mockScenesService = {
  listScenes: jest.fn(),
  getScene: jest.fn(),
  createScene: jest.fn(),
  updateScene: jest.fn(),
  patchScene: jest.fn(),
  updateTranslations: jest.fn(),
  deleteScene: jest.fn(),
};

describe('ScenesController', () => {
  let controller: ScenesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScenesController],
      providers: [{ provide: ScenesService, useValue: mockScenesService }],
    }).compile();

    controller = module.get<ScenesController>(ScenesController);
    jest.clearAllMocks();
  });

  describe('getScene', () => {
    it('returns the scene when found', async () => {
      const mockResult = { id: 1, youtube_video_id: 'abc123' };
      mockScenesService.getScene.mockResolvedValue(mockResult);

      const result = await controller.getScene('en', 1);

      expect(result).toEqual(mockResult);
      expect(mockScenesService.getScene).toHaveBeenCalledWith(1, 'en');
    });

    it('throws NotFoundException when scene does not exist', async () => {
      mockScenesService.getScene.mockResolvedValue(null);

      await expect(controller.getScene('en', 999)).rejects.toThrow(NotFoundException);
    });
  });
});
