import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GrammarPointAnnotationDto {
  @ApiProperty({ example: 'wa-topic' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  start_index?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  end_index?: number;

  @ApiPropertyOptional({ example: 'は' })
  @IsOptional()
  @IsString()
  matched_form?: string;
}

export class TranscriptLineInputDto {
  @ApiPropertyOptional({ description: 'Start time in seconds or "MM:SS"' })
  @IsOptional()
  start_time?: number | string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  speaker_slug?: string;

  @ApiProperty()
  @IsString()
  japanese_text: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  @IsOptional()
  @IsObject()
  translations?: Record<string, string>;

  @ApiPropertyOptional({
    type: [GrammarPointAnnotationDto],
    example: [
      { slug: 'wa-topic', start_index: 2, end_index: 3, matched_form: 'は' },
      { slug: 'da-desu', start_index: 6, end_index: 7, matched_form: 'だ' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrammarPointAnnotationDto)
  grammar_points?: GrammarPointAnnotationDto[];
}

export class CreateSceneDto {
  @ApiProperty()
  @IsString()
  source_slug: string;

  @ApiProperty({ maxLength: 20 })
  @IsString()
  youtube_video_id: string;

  @ApiProperty({ description: 'Start time in seconds or "MM:SS"' })
  start_time: number | string;

  @ApiProperty({ description: 'End time in seconds or "MM:SS"' })
  end_time: number | string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsPositive()
  episode_number?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [TranscriptLineInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranscriptLineInputDto)
  transcript_lines: TranscriptLineInputDto[];
}

export class PatchSceneDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  source_slug?: string;

  @ApiPropertyOptional({ maxLength: 20 })
  @IsOptional()
  @IsString()
  youtube_video_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  start_time?: number | string;

  @ApiPropertyOptional()
  @IsOptional()
  end_time?: number | string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsPositive()
  episode_number?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTranslationsBodyDto {
  @ApiProperty({ type: [Object] })
  @IsArray()
  transcript_lines: { id: number; translation: string }[];
}
