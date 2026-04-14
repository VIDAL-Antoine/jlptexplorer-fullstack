import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Leaf response DTOs — no cross-dependencies.
// Imported by all other response DTO files to avoid circular imports.

export class GrammarPointResponseDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 'wa-topic' }) slug: string;
  @ApiProperty({ example: 'は' }) title: string;
  @ApiProperty({ example: 'wa' }) romaji: string;
  @ApiProperty({ example: 'N5' }) jlpt_level: string;
  @ApiProperty({ example: 'Topic marker particle', nullable: true })
  meaning: string | null;
  @ApiPropertyOptional({ nullable: true }) notes: string | null;
}

export class GrammarPointRawResponseDto {
  @ApiProperty() id: number;
  @ApiProperty({ example: 'wa-topic' }) slug: string;
  @ApiProperty({ example: 'は' }) title: string;
  @ApiProperty({ example: 'wa' }) romaji: string;
  @ApiProperty({ example: 'N5' }) jlpt_level: string;
}

export class SourceResponseDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 'dragon-ball-z' }) slug: string;
  @ApiProperty({ example: 'anime' }) type: string;
  @ApiProperty({ example: null, nullable: true }) cover_image_url:
    | string
    | null;
  @ApiProperty({ example: 'ドラゴンボールZ', nullable: true })
  japanese_title: string | null;
  @ApiProperty({ example: 'Dragon Ball Z', nullable: true }) title:
    | string
    | null;
}

export class SourceRawResponseDto {
  @ApiProperty() id: number;
  @ApiProperty({ example: 'dragon-ball-z' }) slug: string;
  @ApiProperty({ example: 'anime' }) type: string;
  @ApiProperty({ nullable: true }) cover_image_url: string | null;
  @ApiProperty({ example: 'ドラゴンボールZ', nullable: true })
  japanese_title: string | null;
}

export class SpeakerResponseDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 'songoku' }) slug: string;
  @ApiProperty({ example: '孫悟空', nullable: true }) name_japanese:
    | string
    | null;
  @ApiProperty({ nullable: true }) image_url: string | null;
  @ApiProperty({ example: 'Songoku', nullable: true }) name: string | null;
  @ApiProperty({ nullable: true }) description: string | null;
}

export class SpeakerRawResponseDto {
  @ApiProperty() id: number;
  @ApiProperty({ example: 'songoku' }) slug: string;
  @ApiProperty({ example: '孫悟空', nullable: true }) name_japanese:
    | string
    | null;
  @ApiProperty({ nullable: true }) image_url: string | null;
}
