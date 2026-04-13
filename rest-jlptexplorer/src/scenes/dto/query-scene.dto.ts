import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ListScenesQueryDto {
  @ApiPropertyOptional({ description: 'Comma-separated source slugs' })
  @IsOptional()
  @IsString()
  sources?: string;

  @ApiPropertyOptional({ description: 'Comma-separated grammar point slugs' })
  @IsOptional()
  @IsString()
  grammar_points?: string;

  @ApiPropertyOptional({ enum: ['scene', 'transcript_line'], default: 'scene' })
  @IsOptional()
  @IsIn(['scene', 'transcript_line'])
  grammar_match?: 'scene' | 'transcript_line';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  youtube_video_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  start_time?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  end_time?: number;

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
