import { Module } from '@nestjs/common';
import { TranscriptLinesService } from './transcript-lines.service';
import { TranscriptLinesController } from './transcript-lines.controller';
import { TranscriptLinesRepository } from './transcript-lines.repository';
import { SpeakersModule } from '../speakers/speakers.module';

@Module({
  imports: [SpeakersModule],
  controllers: [TranscriptLinesController],
  providers: [TranscriptLinesService, TranscriptLinesRepository],
  exports: [TranscriptLinesRepository],
})
export class TranscriptLinesModule {}
