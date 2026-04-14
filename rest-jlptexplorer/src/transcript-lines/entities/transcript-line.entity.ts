import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GrammarPointEntity } from '../../grammar-points/entities/grammar-point.entity';
import { SpeakerEntity } from '../../speakers/entities/speaker.entity';

export class TranscriptLineTranslationEntity {
  @ApiProperty() id: number;
  @ApiProperty() transcript_line_id: number;
  @ApiProperty() locale: string;
  @ApiPropertyOptional({ nullable: true }) translation: string | null;
}

export class TranscriptLineGrammarPointAnnotationEntity {
  @ApiProperty() id: number;
  @ApiProperty() transcript_line_id: number;
  @ApiProperty() grammar_point_id: number;
  @ApiPropertyOptional({ nullable: true }) start_index: number | null;
  @ApiPropertyOptional({ nullable: true }) end_index: number | null;
  @ApiPropertyOptional({ nullable: true }) matched_form: string | null;
  @ApiProperty({ type: () => GrammarPointEntity }) grammar_points: GrammarPointEntity;
}

export class TranscriptLineEntity {
  @ApiProperty() id: number;
  @ApiProperty() scene_id: number;
  @ApiPropertyOptional({ nullable: true }) start_time: number | null;
  @ApiPropertyOptional({ nullable: true }) speaker_id: number | null;
  @ApiProperty() japanese_text: string;
  @ApiPropertyOptional({ nullable: true, type: () => SpeakerEntity }) speakers: SpeakerEntity | null;
  @ApiProperty({ type: [TranscriptLineTranslationEntity] }) translations: TranscriptLineTranslationEntity[];
  @ApiProperty({ type: [TranscriptLineGrammarPointAnnotationEntity] }) transcript_line_grammar_points: TranscriptLineGrammarPointAnnotationEntity[];
}

export class PaginatedTranscriptLinesEntity {
  @ApiProperty({ type: [TranscriptLineEntity] }) items: TranscriptLineEntity[];
  @ApiProperty() total: number;
}
