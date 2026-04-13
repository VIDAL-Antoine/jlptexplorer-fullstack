import { ApiProperty } from '@nestjs/swagger';
import {
  SourceResponseDto,
  SpeakerResponseDto,
  SpeakerRawResponseDto,
} from './base.response.dto';
import {
  TranscriptLineGrammarPointResponseDto,
  TranscriptLineGrammarPointRawResponseDto,
} from './tlgp.response.dto';

export class TranscriptLineResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() scene_id: number;
  @ApiProperty({ nullable: true }) start_time: number | null;
  @ApiProperty({ nullable: true }) speaker_id: number | null;
  @ApiProperty({ example: 'オラは孫悟空だ。' }) japanese_text: string;
  @ApiProperty({ nullable: true }) translation: string | null;
  @ApiProperty({ type: () => SpeakerResponseDto, nullable: true })
  speakers: SpeakerResponseDto | null;
  @ApiProperty({ type: [TranscriptLineGrammarPointResponseDto] })
  transcript_line_grammar_points: TranscriptLineGrammarPointResponseDto[];
}

export class TranscriptLineFullResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() scene_id: number;
  @ApiProperty({ nullable: true }) start_time: number | null;
  @ApiProperty({ nullable: true }) speaker_id: number | null;
  @ApiProperty({ example: 'オラは孫悟空だ。' }) japanese_text: string;
  @ApiProperty({ nullable: true }) translation: string | null;
  @ApiProperty({ type: () => SourceResponseDto }) source: SourceResponseDto;
  @ApiProperty({ type: () => SpeakerResponseDto, nullable: true })
  speakers: SpeakerResponseDto | null;
  @ApiProperty({ type: [TranscriptLineGrammarPointResponseDto] })
  transcript_line_grammar_points: TranscriptLineGrammarPointResponseDto[];
}

export class TranscriptLineAdminResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() scene_id: number;
  @ApiProperty({ nullable: true }) start_time: number | null;
  @ApiProperty({ nullable: true }) speaker_id: number | null;
  @ApiProperty({ example: 'オラは孫悟空だ。' }) japanese_text: string;
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string', nullable: true },
    example: { en: "I'm Songoku.", fr: 'Je suis Songoku.' },
  })
  translations: Record<string, string | null>;
  @ApiProperty({ type: () => SpeakerRawResponseDto, nullable: true })
  speakers: SpeakerRawResponseDto | null;
  @ApiProperty({ type: [TranscriptLineGrammarPointRawResponseDto] })
  transcript_line_grammar_points: TranscriptLineGrammarPointRawResponseDto[];
}

export class TranscriptLineWriteResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() scene_id: number;
  @ApiProperty({ nullable: true }) start_time: number | null;
  @ApiProperty({ nullable: true }) speaker_id: number | null;
  @ApiProperty({ example: 'オラは孫悟空だ。' }) japanese_text: string;
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string', nullable: true },
    example: { en: "I'm Songoku.", fr: 'Je suis Songoku.' },
  })
  translations: Record<string, string | null>;
}

export class PaginatedTranscriptLinesResponseDto {
  @ApiProperty({ type: [TranscriptLineFullResponseDto] })
  lines: TranscriptLineFullResponseDto[];
  @ApiProperty({ example: 20 }) total: number;
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 2 }) totalPages: number;
}
