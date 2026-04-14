import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QuerySourceScenesDto {
  @ApiPropertyOptional({ description: 'Comma-separated grammar point slugs' })
  @IsOptional()
  @IsString()
  grammar_points?: string;

  @ApiPropertyOptional({ enum: ['scene', 'transcript_line'], default: 'scene' })
  @IsOptional()
  @IsIn(['scene', 'transcript_line'])
  grammar_match?: 'scene' | 'transcript_line' = 'scene';

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
  limit?: number = 12;
}
