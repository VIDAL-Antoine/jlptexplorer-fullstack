import { PartialType } from '@nestjs/swagger';
import { CreateTranscriptLineGrammarPointDto } from './create-transcript-line-grammar-point.dto';

export class UpdateTranscriptLineGrammarPointDto extends PartialType(
  CreateTranscriptLineGrammarPointDto,
) {}
