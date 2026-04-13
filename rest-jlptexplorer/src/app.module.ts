import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SourcesModule } from './sources/sources.module';
import { ScenesModule } from './scenes/scenes.module';
import { GrammarPointsModule } from './grammar-points/grammar-points.module';
import { SpeakersModule } from './speakers/speakers.module';
import { TranscriptLinesModule } from './transcript-lines/transcript-lines.module';
import { TranscriptLineGrammarPointsModule } from './transcript-line-grammar-points/transcript-line-grammar-points.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SourcesModule,
    ScenesModule,
    GrammarPointsModule,
    SpeakersModule,
    TranscriptLinesModule,
    TranscriptLineGrammarPointsModule,
  ],
})
export class AppModule {}
