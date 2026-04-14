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
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { TranscriptLineGrammarPointsService } from './transcript-line-grammar-points.service';
import { CreateTranscriptLineGrammarPointDto } from './dto/create-transcript-line-grammar-point.dto';
import { UpdateTranscriptLineGrammarPointDto } from './dto/update-transcript-line-grammar-point.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { TranscriptLineGrammarPointEntity } from './entities/transcript-line-grammar-point.entity';

@ApiTags('transcript-line-grammar-points')
@UseGuards(ApiKeyGuard)
@ApiSecurity('x-api-key')
@Controller('transcript-line-grammar-points')
export class TranscriptLineGrammarPointsController {
  constructor(
    private readonly transcriptLineGrammarPointsService: TranscriptLineGrammarPointsService,
  ) {}

  @ApiOperation({ summary: 'List all grammar point annotations' })
  @ApiOkResponse({ type: [TranscriptLineGrammarPointEntity] })
  @Get()
  findAll() {
    return this.transcriptLineGrammarPointsService.findAll();
  }

  @ApiOperation({ summary: 'Get a grammar point annotation by id' })
  @ApiOkResponse({ type: TranscriptLineGrammarPointEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transcriptLineGrammarPointsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Annotate a transcript line with a grammar point' })
  @ApiCreatedResponse({ type: TranscriptLineGrammarPointEntity })
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
  @ApiOkResponse({ type: TranscriptLineGrammarPointEntity })
  @ApiNotFoundResponse()
  @Put(':id')
  replace(
    @Param('id') id: string,
    @Body()
    createTranscriptLineGrammarPointDto: CreateTranscriptLineGrammarPointDto,
  ) {
    return this.transcriptLineGrammarPointsService.update(
      +id,
      createTranscriptLineGrammarPointDto,
    );
  }

  @ApiOperation({ summary: 'Partially update a grammar point annotation' })
  @ApiOkResponse({ type: TranscriptLineGrammarPointEntity })
  @ApiNotFoundResponse()
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
  @ApiOkResponse({ type: TranscriptLineGrammarPointEntity })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transcriptLineGrammarPointsService.remove(+id);
  }
}
