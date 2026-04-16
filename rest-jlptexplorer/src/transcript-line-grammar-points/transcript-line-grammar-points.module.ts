import { Module } from '@nestjs/common';
import { TranscriptLineGrammarPointsService } from './transcript-line-grammar-points.service';
import { TranscriptLineGrammarPointsController } from './transcript-line-grammar-points.controller';
import { TranscriptLineGrammarPointsRepository } from './transcript-line-grammar-points.repository';
import { GrammarPointsModule } from '../grammar-points/grammar-points.module';

@Module({
  imports: [GrammarPointsModule],
  controllers: [TranscriptLineGrammarPointsController],
  providers: [
    TranscriptLineGrammarPointsService,
    TranscriptLineGrammarPointsRepository,
  ],
  exports: [TranscriptLineGrammarPointsRepository],
})
export class TranscriptLineGrammarPointsModule {}
