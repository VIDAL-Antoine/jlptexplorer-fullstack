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
import { source_type } from '@prisma/client';

class SourceTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsNotEmpty()
  locale: string;

  @ApiProperty({ example: 'Dragon Ball Z' })
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class CreateSourceDto {
  @ApiProperty({ example: 'dragon-ball-z' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ enum: source_type, example: 'anime' })
  @IsIn(Object.values(source_type))
  type: source_type;

  @ApiPropertyOptional({
    example: 'https://example.com/cover.jpg',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  cover_image_url?: string | null;

  @ApiPropertyOptional({ example: 'ドラゴンボールZ', nullable: true })
  @IsOptional()
  @IsString()
  japanese_title?: string | null;

  @ApiPropertyOptional({ type: [SourceTranslationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SourceTranslationDto)
  translations?: SourceTranslationDto[];
}
