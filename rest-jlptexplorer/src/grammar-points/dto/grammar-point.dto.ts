import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsIn,
  IsArray,
  ValidateNested,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { jlpt_level } from '@prisma/client';

export class GrammarPointTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  locale: string;

  @ApiProperty()
  @IsString()
  meaning: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class GrammarPointTranslationPatchDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  locale: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meaning?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateGrammarPointDto {
  @ApiProperty({ example: 'wa-topic' })
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase kebab-case',
  })
  slug: string;

  @ApiProperty({ example: 'は' })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'wa' })
  @IsString()
  @MaxLength(100)
  romaji: string;

  @ApiProperty({ enum: jlpt_level, example: 'N5' })
  @IsIn(Object.values(jlpt_level))
  jlpt_level: jlpt_level;

  @ApiProperty({ type: [GrammarPointTranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrammarPointTranslationDto)
  translations: GrammarPointTranslationDto[];
}

export class UpdateGrammarPointDto extends CreateGrammarPointDto {}

export class PatchGrammarPointDto {
  @ApiPropertyOptional({ example: 'wa-topic' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  romaji?: string;

  @ApiPropertyOptional({ enum: jlpt_level })
  @IsOptional()
  @IsIn(Object.values(jlpt_level))
  jlpt_level?: jlpt_level;

  @ApiPropertyOptional({ type: [GrammarPointTranslationPatchDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrammarPointTranslationPatchDto)
  translations?: GrammarPointTranslationPatchDto[];
}

export class ListGrammarPointsQueryDto {
  @ApiPropertyOptional({ enum: jlpt_level })
  @IsOptional()
  @IsIn(Object.values(jlpt_level))
  jlpt_level?: jlpt_level;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50;
}

export class GrammarPointScenesQueryDto {
  @ApiPropertyOptional({ description: 'Comma-separated source slugs' })
  @IsOptional()
  @IsString()
  sources?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 12;
}
