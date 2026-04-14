import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GrammarPointEntity } from '../../grammar-points/entities/grammar-point.entity';
import { SourceEntity } from '../../sources/entities/source.entity';
import { TranscriptLineEntity } from '../../transcript-lines/entities/transcript-line.entity';

export class SceneEntity {
  @ApiProperty() id: number;
  @ApiProperty() source_id: number;
  @ApiProperty() youtube_video_id: string;
  @ApiProperty() start_time: number;
  @ApiProperty() end_time: number;
  @ApiProperty() episode_number: number;
  @ApiPropertyOptional({ nullable: true }) notes: string | null;
  @ApiProperty({ type: () => SourceEntity }) sources: SourceEntity;
  @ApiProperty({ type: [TranscriptLineEntity] })
  transcript_lines: TranscriptLineEntity[];
}

export class PaginatedScenesEntity {
  @ApiProperty({ type: [SceneEntity] }) items: SceneEntity[];
  @ApiProperty() total: number;
  @ApiProperty({ type: [SourceEntity] }) availableSources: SourceEntity[];
  @ApiProperty({ type: [GrammarPointEntity] })
  availableGrammarPoints: GrammarPointEntity[];
}

export class PaginatedSourceScenesEntity {
  @ApiProperty({ type: [SceneEntity] }) items: SceneEntity[];
  @ApiProperty() total: number;
  @ApiProperty({ type: [GrammarPointEntity] })
  availableGrammarPoints: GrammarPointEntity[];
}

export class PaginatedGrammarPointScenesEntity {
  @ApiProperty({ type: [SceneEntity] }) items: SceneEntity[];
  @ApiProperty() total: number;
  @ApiProperty({ type: [SourceEntity] }) availableSources: SourceEntity[];
}
