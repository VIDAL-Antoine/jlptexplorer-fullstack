import { Test, TestingModule } from '@nestjs/testing';
import { ScenesService } from './scenes.service';
import { ScenesRepository } from './scenes.repository';
import { SourcesRepository } from '../sources/sources.repository';
import { GrammarPointsRepository } from '../grammar-points/grammar-points.repository';
import { SpeakersRepository } from '../speakers/speakers.repository';

const mockScenesRepository = {
  findScenes: jest.fn(),
  findSceneById: jest.fn(),
  findSceneByIdAll: jest.fn(),
  createScene: jest.fn(),
  updateScene: jest.fn(),
  updateSceneTranslations: jest.fn(),
  deleteScene: jest.fn(),
};

describe('ScenesService', () => {
  let service: ScenesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScenesService,
        { provide: ScenesRepository, useValue: mockScenesRepository },
        { provide: SourcesRepository, useValue: {} },
        { provide: GrammarPointsRepository, useValue: {} },
        { provide: SpeakersRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<ScenesService>(ScenesService);
    jest.clearAllMocks();
  });

  describe('getScene', () => {
    it('returns null when scene does not exist', async () => {
      mockScenesRepository.findSceneById.mockResolvedValue(null);

      const result = await service.getScene(999, 'en');

      expect(result).toBeNull();
      expect(mockScenesRepository.findSceneById).toHaveBeenCalledWith(999, 'en');
    });
  });
});
