import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTranscriptLineGrammarPointDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  transcript_line_id: number;

  @ApiProperty()
  @IsString()
  grammar_point_slug: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  start_index: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  end_index: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  matched_form?: string;
}

export class UpdateTranscriptLineGrammarPointDto {
  @ApiProperty()
  @IsString()
  grammar_point_slug: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  start_index: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  end_index: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  matched_form?: string;
}

export class PatchTranscriptLineGrammarPointDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  grammar_point_slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  start_index?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  end_index?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  matched_form?: string;
}

export class ListTranscriptLineGrammarPointsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  transcript_line_id?: number;
}
