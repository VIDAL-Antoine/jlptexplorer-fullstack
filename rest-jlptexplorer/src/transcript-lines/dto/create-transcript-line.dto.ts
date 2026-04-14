import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TranscriptLineTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsNotEmpty()
  locale: string;

  @ApiPropertyOptional({ example: "I'm Songoku.", nullable: true })
  @IsOptional()
  @IsString()
  translation?: string | null;
}

export class CreateTranscriptLineDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  scene_id: number;

  @ApiPropertyOptional({ example: 122, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  start_time?: number | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  speaker_id?: number | null;

  @ApiProperty({ example: 'オラは孫悟空だ。' })
  @IsString()
  @IsNotEmpty()
  japanese_text: string;

  @ApiPropertyOptional({ type: [TranscriptLineTranslationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranscriptLineTranslationDto)
  translations?: TranscriptLineTranslationDto[];
}
