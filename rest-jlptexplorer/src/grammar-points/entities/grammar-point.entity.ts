import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { jlpt_level } from '@prisma/client';

export class GrammarPointTranslationEntity {
  @ApiProperty() id: number;
  @ApiProperty() grammar_point_id: number;
  @ApiProperty() locale: string;
  @ApiProperty() meaning: string;
  @ApiPropertyOptional({ nullable: true }) notes: string | null;
}

export class GrammarPointEntity {
  @ApiProperty() id: number;
  @ApiProperty() slug: string;
  @ApiProperty() title: string;
  @ApiProperty() romaji: string;
  @ApiProperty({ enum: jlpt_level }) jlpt_level: jlpt_level;
  @ApiProperty({ type: [GrammarPointTranslationEntity] })
  translations: GrammarPointTranslationEntity[];
}

export class GrammarPointWithHasScenesEntity extends GrammarPointEntity {
  @ApiProperty() has_scenes: boolean;
}

export class PaginatedGrammarPointsEntity {
  @ApiProperty({ type: [GrammarPointWithHasScenesEntity] })
  items: GrammarPointWithHasScenesEntity[];
  @ApiProperty() total: number;
}
