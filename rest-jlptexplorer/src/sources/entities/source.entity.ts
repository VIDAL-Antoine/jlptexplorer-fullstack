import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { source_type } from '@prisma/client';

export class SourceTranslationEntity {
  @ApiProperty() id: number;
  @ApiProperty() source_id: number;
  @ApiProperty() locale: string;
  @ApiProperty() title: string;
}

export class SourceEntity {
  @ApiProperty() id: number;
  @ApiProperty() slug: string;
  @ApiProperty({ enum: source_type }) type: source_type;
  @ApiPropertyOptional({ nullable: true }) cover_image_url: string | null;
  @ApiPropertyOptional({ nullable: true }) japanese_title: string | null;
  @ApiProperty({ type: [SourceTranslationEntity] })
  translations: SourceTranslationEntity[];
}

export class PaginatedSourcesEntity {
  @ApiProperty({ type: [SourceEntity] }) items: SourceEntity[];
  @ApiProperty() total: number;
}
