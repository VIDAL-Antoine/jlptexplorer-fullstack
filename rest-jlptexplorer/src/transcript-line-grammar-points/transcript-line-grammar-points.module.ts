import { Module } from '@nestjs/common';
import { TranscriptLineGrammarPointsService } from './transcript-line-grammar-points.service';
import { TranscriptLineGrammarPointsController } from './transcript-line-grammar-points.controller';
import { TranscriptLineGrammarPointsRepository } from './transcript-line-grammar-points.repository';

@Module({
  controllers: [TranscriptLineGrammarPointsController],
  providers: [
    TranscriptLineGrammarPointsService,
    TranscriptLineGrammarPointsRepository,
  ],
  exports: [TranscriptLineGrammarPointsRepository],
})
export class TranscriptLineGrammarPointsModule {}
