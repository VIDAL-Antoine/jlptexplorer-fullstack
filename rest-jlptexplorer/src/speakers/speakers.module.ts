import { Module } from '@nestjs/common';
import { SpeakersService } from './speakers.service';
import { SpeakersController } from './speakers.controller';
import { SpeakersRepository } from './speakers.repository';

@Module({
  controllers: [SpeakersController],
  providers: [SpeakersService, SpeakersRepository],
  exports: [SpeakersRepository],
})
export class SpeakersModule {}
