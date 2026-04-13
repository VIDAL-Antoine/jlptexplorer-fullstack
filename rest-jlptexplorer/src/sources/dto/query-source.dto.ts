import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { source_type } from '@prisma/client';

export class ListSourcesQueryDto {
  @ApiPropertyOptional({ enum: source_type })
  @IsOptional()
  @IsIn(Object.values(source_type))
  type?: source_type;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12;
}

export class SourceScenesQueryDto {
  @ApiPropertyOptional({ description: 'Comma-separated grammar point slugs' })
  @IsOptional()
  grammar_points?: string;

  @ApiPropertyOptional({ enum: ['scene', 'transcript_line'], default: 'scene' })
  @IsOptional()
  @IsIn(['scene', 'transcript_line'])
  grammar_match?: 'scene' | 'transcript_line';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12;
}
