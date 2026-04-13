import { Module } from '@nestjs/common';
import { ScenesController } from './scenes.controller';
import { ScenesService } from './scenes.service';
import { ScenesRepository } from './scenes.repository';
import { SourcesModule } from '../sources/sources.module';
import { GrammarPointsModule } from '../grammar-points/grammar-points.module';
import { SpeakersModule } from '../speakers/speakers.module';

@Module({
  imports: [SourcesModule, GrammarPointsModule, SpeakersModule],
  controllers: [ScenesController],
  providers: [ScenesService, ScenesRepository],
  exports: [ScenesRepository],
})
export class ScenesModule {}
