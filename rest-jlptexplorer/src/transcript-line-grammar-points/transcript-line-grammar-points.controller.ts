import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { TranscriptLineGrammarPointsService } from './transcript-line-grammar-points.service';
import { CreateTranscriptLineGrammarPointDto } from './dto/create-transcript-line-grammar-point.dto';
import { UpdateTranscriptLineGrammarPointDto } from './dto/update-transcript-line-grammar-point.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('transcript-line-grammar-points')
@UseGuards(ApiKeyGuard)
@ApiSecurity('x-api-key')
@Controller('transcript-line-grammar-points')
export class TranscriptLineGrammarPointsController {
  constructor(
    private readonly transcriptLineGrammarPointsService: TranscriptLineGrammarPointsService,
  ) {}

  @ApiOperation({ summary: 'List all grammar point annotations' })
  @Get()
  findAll() {
    return this.transcriptLineGrammarPointsService.findAll();
  }

  @ApiOperation({ summary: 'Get a grammar point annotation by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transcriptLineGrammarPointsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Annotate a transcript line with a grammar point' })
  @Post()
  create(
    @Body()
    createTranscriptLineGrammarPointDto: CreateTranscriptLineGrammarPointDto,
  ) {
    return this.transcriptLineGrammarPointsService.create(
      createTranscriptLineGrammarPointDto,
    );
  }

  @ApiOperation({ summary: 'Replace a grammar point annotation (full update)' })
  @Put(':id')
  replace(
    @Param('id') id: string,
    @Body()
    updateTranscriptLineGrammarPointDto: UpdateTranscriptLineGrammarPointDto,
  ) {
    return this.transcriptLineGrammarPointsService.update(
      +id,
      updateTranscriptLineGrammarPointDto,
    );
  }

  @ApiOperation({ summary: 'Partially update a grammar point annotation' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateTranscriptLineGrammarPointDto: UpdateTranscriptLineGrammarPointDto,
  ) {
    return this.transcriptLineGrammarPointsService.update(
      +id,
      updateTranscriptLineGrammarPointDto,
    );
  }

  @ApiOperation({ summary: 'Delete a grammar point annotation' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transcriptLineGrammarPointsService.remove(+id);
  }
}
