import { Module } from '@nestjs/common';
import { TranscriptLinesController } from './transcript-lines.controller';
import { TranscriptLinesService } from './transcript-lines.service';
import { TranscriptLinesRepository } from './transcript-lines.repository';
import { ScenesModule } from '../scenes/scenes.module';
import { GrammarPointsModule } from '../grammar-points/grammar-points.module';
import { SpeakersModule } from '../speakers/speakers.module';

@Module({
  imports: [ScenesModule, GrammarPointsModule, SpeakersModule],
  controllers: [TranscriptLinesController],
  providers: [TranscriptLinesService, TranscriptLinesRepository],
  exports: [TranscriptLinesRepository],
})
export class TranscriptLinesModule {}
