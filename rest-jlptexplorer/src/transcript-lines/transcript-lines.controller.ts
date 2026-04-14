import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { TranscriptLinesService } from './transcript-lines.service';
import { CreateTranscriptLineDto } from './dto/create-transcript-line.dto';
import { UpdateTranscriptLineDto } from './dto/update-transcript-line.dto';
import { QueryTranscriptLineDto } from './dto/query-transcript-line.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('transcript-lines')
@Controller('transcript-lines')
export class TranscriptLinesController {
  constructor(
    private readonly transcriptLinesService: TranscriptLinesService,
  ) {}

  @ApiOperation({ summary: 'List all transcript lines' })
  @Get()
  findAll(@Query() query: QueryTranscriptLineDto) {
    return this.transcriptLinesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a transcript line by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transcriptLinesService.findOne(+id);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Create a transcript line' })
  @Post()
  create(@Body() createTranscriptLineDto: CreateTranscriptLineDto) {
    return this.transcriptLinesService.create(createTranscriptLineDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Replace a transcript line (full update)' })
  @Put(':id')
  replace(
    @Param('id') id: string,
    @Body() createTranscriptLineDto: CreateTranscriptLineDto,
  ) {
    return this.transcriptLinesService.update(+id, createTranscriptLineDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Partially update a transcript line' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTranscriptLineDto: UpdateTranscriptLineDto,
  ) {
    return this.transcriptLinesService.update(+id, updateTranscriptLineDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Delete a transcript line' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transcriptLinesService.remove(+id);
  }
}
