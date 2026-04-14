import { Module } from '@nestjs/common';
import { ScenesService } from './scenes.service';
import { ScenesController } from './scenes.controller';
import { ScenesRepository } from './scenes.repository';
import { SourcesModule } from '../sources/sources.module';
import { SpeakersModule } from '../speakers/speakers.module';
import { GrammarPointsModule } from '../grammar-points/grammar-points.module';

@Module({
  imports: [SourcesModule, SpeakersModule, GrammarPointsModule],
  controllers: [ScenesController],
  providers: [ScenesService, ScenesRepository],
})
export class ScenesModule {}
