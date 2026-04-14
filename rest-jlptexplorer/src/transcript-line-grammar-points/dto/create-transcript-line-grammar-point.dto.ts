import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTranscriptLineGrammarPointDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  transcript_line_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  grammar_point_id: number;

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
