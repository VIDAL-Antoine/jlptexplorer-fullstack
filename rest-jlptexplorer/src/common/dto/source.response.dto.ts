import { ApiProperty } from '@nestjs/swagger';
import {
  SourceResponseDto,
  GrammarPointResponseDto,
} from './base.response.dto';
import { SceneResponseDto } from './scene.response.dto';

export class PaginatedSourcesResponseDto {
  @ApiProperty({ type: [SourceResponseDto] }) sources: SourceResponseDto[];
  @ApiProperty({ example: 10 }) total: number;
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 1 }) totalPages: number;
  @ApiProperty({ type: [String], example: ['anime', 'game'] })
  available_types: string[];
}

export class SourceDetailResponseDto extends SourceResponseDto {
  @ApiProperty({ example: 5 }) scenes_count: number;
  @ApiProperty({ type: [GrammarPointResponseDto] })
  grammar_points: GrammarPointResponseDto[];
}

export class SourceScenesResponseDto {
  @ApiProperty({ type: [SceneResponseDto] }) scenes: SceneResponseDto[];
  @ApiProperty({ example: 5 }) total: number;
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 1 }) totalPages: number;
  @ApiProperty({ type: [GrammarPointResponseDto] })
  available_grammar_points: GrammarPointResponseDto[];
}

export class SourceAdminResponseDto {
  @ApiProperty() id: number;
  @ApiProperty({ example: 'dragon-ball-z' }) slug: string;
  @ApiProperty({ example: 'anime' }) type: string;
  @ApiProperty({ nullable: true }) cover_image_url: string | null;
  @ApiProperty({ example: 'ドラゴンボールZ', nullable: true })
  japanese_title: string | null;
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { en: 'Dragon Ball Z', fr: 'Dragon Ball Z' },
  })
  translations: Record<string, string>;
}
