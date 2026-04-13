import { ApiProperty } from '@nestjs/swagger';
import {
  SpeakerResponseDto,
  SourceResponseDto,
  GrammarPointResponseDto,
} from './base.response.dto';

export class SpeakerTranscriptLineGrammarPointResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() grammar_point_id: number;
  @ApiProperty({ example: 2, nullable: true }) start_index: number | null;
  @ApiProperty({ example: 3, nullable: true }) end_index: number | null;
  @ApiProperty({ example: 'は', nullable: true }) matched_form: string | null;
  @ApiProperty({ type: () => GrammarPointResponseDto })
  grammar_points: GrammarPointResponseDto;
}

export class SpeakerSceneResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() source_id: number;
  @ApiProperty() youtube_video_id: string;
  @ApiProperty() start_time: number;
  @ApiProperty() end_time: number;
  @ApiProperty({ nullable: true }) episode_number: number | null;
  @ApiProperty({ nullable: true }) notes: string | null;
  @ApiProperty({ type: () => SourceResponseDto }) sources: SourceResponseDto;
}

export class SpeakerTranscriptLineResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() scene_id: number;
  @ApiProperty({ nullable: true }) start_time: number | null;
  @ApiProperty({ nullable: true }) speaker_id: number | null;
  @ApiProperty({ example: 'オラは孫悟空だ。' }) japanese_text: string;
  @ApiProperty({ type: () => SpeakerSceneResponseDto }) scenes: SpeakerSceneResponseDto;
  @ApiProperty({ type: [SpeakerTranscriptLineGrammarPointResponseDto] })
  transcript_line_grammar_points: SpeakerTranscriptLineGrammarPointResponseDto[];
}

export class SpeakerDetailResponseDto extends SpeakerResponseDto {
  @ApiProperty({ type: [SpeakerTranscriptLineResponseDto] })
  transcript_lines: SpeakerTranscriptLineResponseDto[];
}

export class PaginatedSpeakersResponseDto {
  @ApiProperty({ type: [SpeakerResponseDto] }) speakers: SpeakerResponseDto[];
  @ApiProperty({ example: 10 }) total: number;
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 1 }) totalPages: number;
}

export class SpeakerAdminResponseDto {
  @ApiProperty() id: number;
  @ApiProperty({ example: 'songoku' }) slug: string;
  @ApiProperty({ example: '孫悟空', nullable: true }) name_japanese: string | null;
  @ApiProperty({ nullable: true }) image_url: string | null;
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
      },
    },
    example: { en: { name: 'Songoku', description: null } },
  })
  translations: Record<string, { name: string; description: string | null }>;
}
