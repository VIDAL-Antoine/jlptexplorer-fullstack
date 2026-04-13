import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsIn,
  IsObject,
  MaxLength,
  Matches,
} from 'class-validator';
import { source_type } from '@prisma/client';

export class CreateSourceDto {
  @ApiProperty({ example: 'dragon-ball-z' })
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase kebab-case',
  })
  slug: string;

  @ApiPropertyOptional({ example: 'ドラゴンボールZ' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  japanese_title?: string;

  @ApiProperty({ enum: source_type, example: 'anime' })
  @IsIn(Object.values(source_type))
  type: source_type;

  @ApiPropertyOptional({ example: 'https://placehold.co/400x600?text=No+image' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cover_image_url?: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { en: 'Dragon Ball Z', fr: 'Dragon Ball Z' },
  })
  @IsObject()
  translations: Record<string, string>;
}

export class UpdateSourceDto extends CreateSourceDto {}

export class PatchSourceDto {
  @ApiPropertyOptional({ example: 'dragon-ball-z' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  japanese_title?: string;

  @ApiPropertyOptional({ enum: source_type })
  @IsOptional()
  @IsIn(Object.values(source_type))
  type?: source_type;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cover_image_url?: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  @IsOptional()
  @IsObject()
  translations?: Record<string, string>;
}
