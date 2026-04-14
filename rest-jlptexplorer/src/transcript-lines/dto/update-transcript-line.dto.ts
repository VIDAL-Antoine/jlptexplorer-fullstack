import { PartialType } from '@nestjs/swagger';
import { CreateTranscriptLineDto } from './create-transcript-line.dto';

export class UpdateTranscriptLineDto extends PartialType(
  CreateTranscriptLineDto,
) {}
