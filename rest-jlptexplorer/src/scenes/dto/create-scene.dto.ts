import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class GrammarPointAnnotationDto {
  @ApiProperty({ example: 'wa-topic' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 2, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  start_index?: number | null;

  @ApiPropertyOptional({ example: 3, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  end_index?: number | null;

  @ApiPropertyOptional({ example: 'は', nullable: true })
  @IsOptional()
  @IsString()
  matched_form?: string | null;
}

class SceneTranscriptLineDto {
  @ApiPropertyOptional({ example: 122, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  start_time?: number | null;

  @ApiPropertyOptional({ example: 'songoku', nullable: true })
  @IsOptional()
  @IsString()
  speaker_slug?: string | null;

  @ApiProperty({ example: 'オラは孫悟空だ。' })
  @IsString()
  @IsNotEmpty()
  japanese_text: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string', nullable: true },
    example: { en: "I'm Songoku.", fr: 'Je suis Songoku.' },
  })
  @IsOptional()
  translations?: Record<string, string | null>;

  @ApiPropertyOptional({ type: [GrammarPointAnnotationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrammarPointAnnotationDto)
  grammar_points?: GrammarPointAnnotationDto[];
}

export class CreateSceneDto {
  @ApiProperty({ example: 'dragon-ball-z' })
  @IsString()
  @IsNotEmpty()
  source_slug: string;

  @ApiProperty({ example: 'LzHaHLdpOVI' })
  @IsString()
  @IsNotEmpty()
  youtube_video_id: string;

  @ApiProperty({
    example: '1:57',
    description: 'Time in seconds or "mm:ss" / "hh:mm:ss"',
  })
  @IsNotEmpty()
  start_time: string | number;

  @ApiProperty({
    example: '2:28',
    description: 'Time in seconds or "mm:ss" / "hh:mm:ss"',
  })
  @IsNotEmpty()
  end_time: string | number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  episode_number?: number;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string | null;

  @ApiPropertyOptional({ type: [SceneTranscriptLineDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SceneTranscriptLineDto)
  transcript_lines?: SceneTranscriptLineDto[];
}
