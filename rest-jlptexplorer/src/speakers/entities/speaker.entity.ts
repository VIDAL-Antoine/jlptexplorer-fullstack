import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SpeakerTranslationEntity {
  @ApiProperty() id: number;
  @ApiProperty() speaker_id: number;
  @ApiProperty() locale: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
}

export class SpeakerEntity {
  @ApiProperty() id: number;
  @ApiProperty() slug: string;
  @ApiPropertyOptional({ nullable: true }) name_japanese: string | null;
  @ApiPropertyOptional({ nullable: true }) image_url: string | null;
  @ApiProperty({ type: [SpeakerTranslationEntity] }) translations: SpeakerTranslationEntity[];
}

export class PaginatedSpeakersEntity {
  @ApiProperty({ type: [SpeakerEntity] }) items: SpeakerEntity[];
  @ApiProperty() total: number;
}
