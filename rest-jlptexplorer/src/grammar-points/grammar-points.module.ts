import { Module } from '@nestjs/common';
import { GrammarPointsController } from './grammar-points.controller';
import { GrammarPointsService } from './grammar-points.service';
import { GrammarPointsRepository } from './grammar-points.repository';

@Module({
  controllers: [GrammarPointsController],
  providers: [GrammarPointsService, GrammarPointsRepository],
  exports: [GrammarPointsRepository],
})
export class GrammarPointsModule {}
