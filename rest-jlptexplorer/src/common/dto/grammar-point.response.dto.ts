import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  GrammarPointResponseDto,
  SourceResponseDto,
} from './base.response.dto';
import { SceneResponseDto } from './scene.response.dto';

export class GrammarPointWithHasScenesResponseDto extends GrammarPointResponseDto {
  @ApiProperty({ example: true }) has_scenes: boolean;
}

export class PaginatedGrammarPointsResponseDto {
  @ApiProperty({ type: [GrammarPointWithHasScenesResponseDto] })
  grammar_points: GrammarPointWithHasScenesResponseDto[];
  @ApiProperty({ example: 100 }) total: number;
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 2 }) totalPages: number;
}

export class GrammarPointDetailResponseDto extends GrammarPointResponseDto {
  @ApiProperty({ example: 5 }) scenes_count: number;
  @ApiProperty({ type: [SourceResponseDto] })
  available_sources: SourceResponseDto[];
}

export class GrammarPointScenesResponseDto {
  @ApiProperty({ type: [SceneResponseDto] }) scenes: SceneResponseDto[];
  @ApiProperty({ example: 5 }) total: number;
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 1 }) totalPages: number;
  @ApiProperty({ type: [SourceResponseDto] })
  available_sources: SourceResponseDto[];
}

export class GrammarPointAdminResponseDto {
  @ApiProperty() id: number;
  @ApiProperty({ example: 'wa-topic' }) slug: string;
  @ApiProperty({ example: 'は' }) title: string;
  @ApiProperty({ example: 'wa' }) romaji: string;
  @ApiProperty({ example: 'N5' }) jlpt_level: string;
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        meaning: { type: 'string' },
        notes: { type: 'string', nullable: true },
      },
    },
    example: { en: { meaning: 'Topic marker particle', notes: null } },
  })
  translations: Record<string, { meaning: string; notes: string | null }>;
}
