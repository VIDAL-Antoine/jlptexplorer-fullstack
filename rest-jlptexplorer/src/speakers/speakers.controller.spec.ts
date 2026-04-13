import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SpeakersController } from './speakers.controller';
import { SpeakersService } from './speakers.service';

const mockSpeakersService = {
  listSpeakers: jest.fn(),
  getSpeaker: jest.fn(),
  createSpeaker: jest.fn(),
  updateSpeaker: jest.fn(),
  patchSpeaker: jest.fn(),
  deleteSpeaker: jest.fn(),
};

describe('SpeakersController', () => {
  let controller: SpeakersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeakersController],
      providers: [{ provide: SpeakersService, useValue: mockSpeakersService }],
    }).compile();

    controller = module.get<SpeakersController>(SpeakersController);
    jest.clearAllMocks();
  });

  describe('getSpeaker', () => {
    it('returns the speaker when found', async () => {
      const mockResult = { slug: 'goku', name: 'Goku' };
      mockSpeakersService.getSpeaker.mockResolvedValue(mockResult);

      const result = await controller.getSpeaker('en', 'goku');

      expect(result).toEqual(mockResult);
      expect(mockSpeakersService.getSpeaker).toHaveBeenCalledWith('goku', 'en');
    });

    it('throws NotFoundException when speaker does not exist', async () => {
      mockSpeakersService.getSpeaker.mockResolvedValue(null);

      await expect(controller.getSpeaker('en', 'unknown')).rejects.toThrow(NotFoundException);
    });
  });
});
