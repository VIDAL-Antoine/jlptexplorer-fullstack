import { Module } from '@nestjs/common';
import { TranscriptLineGrammarPointsController } from './transcript-line-grammar-points.controller';
import { TranscriptLineGrammarPointsService } from './transcript-line-grammar-points.service';
import { TranscriptLineGrammarPointsRepository } from './transcript-line-grammar-points.repository';
import { GrammarPointsModule } from '../grammar-points/grammar-points.module';
import { TranscriptLinesModule } from '../transcript-lines/transcript-lines.module';

@Module({
  imports: [GrammarPointsModule, TranscriptLinesModule],
  controllers: [TranscriptLineGrammarPointsController],
  providers: [
    TranscriptLineGrammarPointsService,
    TranscriptLineGrammarPointsRepository,
  ],
})
export class TranscriptLineGrammarPointsModule {}
