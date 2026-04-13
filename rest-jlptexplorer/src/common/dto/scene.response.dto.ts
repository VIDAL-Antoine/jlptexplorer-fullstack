import { ApiProperty } from '@nestjs/swagger';
import {
  SourceResponseDto,
  SourceRawResponseDto,
  GrammarPointResponseDto,
} from './base.response.dto';
import {
  TranscriptLineResponseDto,
  TranscriptLineAdminResponseDto,
} from './transcript-line.response.dto';

export class SceneResponseDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty() source_id: number;
  @ApiProperty({ example: 'LzHaHLdpOVI' }) youtube_video_id: string;
  @ApiProperty({ example: 117 }) start_time: number;
  @ApiProperty({ example: 148 }) end_time: number;
  @ApiProperty({ example: 129, nullable: true }) episode_number: number | null;
  @ApiProperty({ nullable: true }) notes: string | null;
  @ApiProperty({ type: () => SourceResponseDto }) sources: SourceResponseDto;
  @ApiProperty({ type: [TranscriptLineResponseDto] })
  transcript_lines: TranscriptLineResponseDto[];
}

export class SceneAdminResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() source_id: number;
  @ApiProperty({ example: 'LzHaHLdpOVI' }) youtube_video_id: string;
  @ApiProperty() start_time: number;
  @ApiProperty() end_time: number;
  @ApiProperty({ example: 129, nullable: true }) episode_number: number | null;
  @ApiProperty({ nullable: true }) notes: string | null;
  @ApiProperty({ type: () => SourceRawResponseDto }) sources: SourceRawResponseDto;
  @ApiProperty({ type: [TranscriptLineAdminResponseDto] })
  transcript_lines: TranscriptLineAdminResponseDto[];
}

export class PaginatedScenesResponseDto {
  @ApiProperty({ type: [SceneResponseDto] }) scenes: SceneResponseDto[];
  @ApiProperty({ example: 42 }) total: number;
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 4 }) totalPages: number;
  @ApiProperty({ type: [SourceResponseDto] })
  available_sources: SourceResponseDto[];
  @ApiProperty({ type: [GrammarPointResponseDto] })
  available_grammar_points: GrammarPointResponseDto[];
}
