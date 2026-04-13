import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  IsArray,
  ValidateNested,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GrammarPointAnnotationDto } from '../../scenes/dto/create-scene.dto';

export class CreateTranscriptLineDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  scene_id: number;

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

export class UpdateTranscriptLineDto {
  @ApiProperty({ description: 'Start time in seconds or "MM:SS"' })
  start_time: number | string;

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

export class PatchTranscriptLineDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  japanese_text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  start_time?: number | string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  speaker_slug?: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  @IsOptional()
  @IsObject()
  translations?: Record<string, string>;
}

export class ListTranscriptLinesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  scene_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  speaker_slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  start_time?: number;

  @ApiPropertyOptional({ description: 'Comma-separated grammar point slugs' })
  @IsOptional()
  @IsString()
  grammar_points?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}
