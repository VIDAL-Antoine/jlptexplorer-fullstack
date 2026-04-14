import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SpeakerTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  @IsNotEmpty()
  locale: string;

  @ApiProperty({ example: 'Songoku' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;
}

export class CreateSpeakerDto {
  @ApiProperty({ example: 'songoku' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: '孫悟空', nullable: true })
  @IsOptional()
  @IsString()
  name_japanese?: string | null;

  @ApiPropertyOptional({
    example: 'https://example.com/songoku.jpg',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  image_url?: string | null;

  @ApiPropertyOptional({ type: [SpeakerTranslationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpeakerTranslationDto)
  translations?: SpeakerTranslationDto[];
}
