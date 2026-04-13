import { Test, TestingModule } from '@nestjs/testing';
import { SpeakersService } from './speakers.service';
import { SpeakersRepository } from './speakers.repository';

const mockSpeakersRepository = {
  findSpeakers: jest.fn(),
  findSpeakerBySlug: jest.fn(),
  findSpeakersBySlugIn: jest.fn(),
  createSpeaker: jest.fn(),
  updateSpeaker: jest.fn(),
  patchSpeaker: jest.fn(),
  deleteSpeaker: jest.fn(),
};

describe('SpeakersService', () => {
  let service: SpeakersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeakersService,
        { provide: SpeakersRepository, useValue: mockSpeakersRepository },
      ],
    }).compile();

    service = module.get<SpeakersService>(SpeakersService);
    jest.clearAllMocks();
  });

  describe('getSpeaker', () => {
    it('returns null when speaker does not exist', async () => {
      mockSpeakersRepository.findSpeakerBySlug.mockResolvedValue(null);

      const result = await service.getSpeaker('unknown', 'en');

      expect(result).toBeNull();
      expect(mockSpeakersRepository.findSpeakerBySlug).toHaveBeenCalledWith('unknown', 'en');
    });
  });

  describe('listSpeakers', () => {
    it('returns an empty list when no speakers exist', async () => {
      mockSpeakersRepository.findSpeakers.mockResolvedValue([]);

      const result = await service.listSpeakers('en', {});

      expect(result.speakers).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
