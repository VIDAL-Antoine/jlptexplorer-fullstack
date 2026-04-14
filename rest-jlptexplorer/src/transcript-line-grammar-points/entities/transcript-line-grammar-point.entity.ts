import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GrammarPointEntity } from '../../grammar-points/entities/grammar-point.entity';

export class TranscriptLineGrammarPointEntity {
  @ApiProperty() id: number;
  @ApiProperty() transcript_line_id: number;
  @ApiProperty() grammar_point_id: number;
  @ApiPropertyOptional({ nullable: true }) start_index: number | null;
  @ApiPropertyOptional({ nullable: true }) end_index: number | null;
  @ApiPropertyOptional({ nullable: true }) matched_form: string | null;
  @ApiProperty({ type: () => GrammarPointEntity }) grammar_points: GrammarPointEntity;
}
