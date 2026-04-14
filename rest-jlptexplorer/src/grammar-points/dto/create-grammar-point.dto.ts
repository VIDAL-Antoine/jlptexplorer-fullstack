import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { jlpt_level } from '@prisma/client';

class GrammarPointTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsNotEmpty()
  locale: string;

  @ApiProperty({ example: 'Topic marker particle' })
  @IsString()
  @IsNotEmpty()
  meaning: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string | null;
}

export class CreateGrammarPointDto {
  @ApiProperty({ example: 'wa-topic' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'は' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'wa' })
  @IsString()
  @IsNotEmpty()
  romaji: string;

  @ApiProperty({ enum: jlpt_level, example: 'N5' })
  @IsIn(Object.values(jlpt_level))
  jlpt_level: jlpt_level;

  @ApiPropertyOptional({ type: [GrammarPointTranslationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrammarPointTranslationDto)
  translations?: GrammarPointTranslationDto[];
}
