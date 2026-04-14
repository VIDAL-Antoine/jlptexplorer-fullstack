import { PartialType } from '@nestjs/swagger';
import { CreateGrammarPointDto } from './create-grammar-point.dto';

export class UpdateGrammarPointDto extends PartialType(CreateGrammarPointDto) {}
