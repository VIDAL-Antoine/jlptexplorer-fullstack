import { ApiProperty } from '@nestjs/swagger';
import {
  GrammarPointResponseDto,
  GrammarPointRawResponseDto,
} from './base.response.dto';

export class TranscriptLineGrammarPointResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() transcript_line_id: number;
  @ApiProperty() grammar_point_id: number;
  @ApiProperty({ example: 2, nullable: true }) start_index: number | null;
  @ApiProperty({ example: 3, nullable: true }) end_index: number | null;
  @ApiProperty({ example: 'は', nullable: true }) matched_form: string | null;
  @ApiProperty({ type: () => GrammarPointResponseDto, nullable: true })
  grammar_points: GrammarPointResponseDto | null;
}

export class TranscriptLineGrammarPointRawResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() transcript_line_id: number;
  @ApiProperty() grammar_point_id: number;
  @ApiProperty({ example: 2, nullable: true }) start_index: number | null;
  @ApiProperty({ example: 3, nullable: true }) end_index: number | null;
  @ApiProperty({ example: 'は', nullable: true }) matched_form: string | null;
  @ApiProperty({ type: () => GrammarPointRawResponseDto, nullable: true })
  grammar_points: GrammarPointRawResponseDto | null;
}

export class TlgpEntityResponseDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty() transcript_line_id: number;
  @ApiProperty() grammar_point_id: number;
  @ApiProperty({ example: 2 }) start_index: number;
  @ApiProperty({ example: 3 }) end_index: number;
  @ApiProperty({ example: 'は', nullable: true }) matched_form: string | null;
}
