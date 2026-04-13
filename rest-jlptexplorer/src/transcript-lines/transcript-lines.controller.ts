import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { TranscriptLinesService } from './transcript-lines.service';
import {
  CreateTranscriptLineDto,
  UpdateTranscriptLineDto,
  PatchTranscriptLineDto,
  ListTranscriptLinesQueryDto,
} from './dto/transcript-line.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  PaginatedTranscriptLinesResponseDto,
  TranscriptLineFullResponseDto,
  TranscriptLineWriteResponseDto,
} from '../common/dto/transcript-line.response.dto';

@ApiTags('transcript-lines')
@Controller()
export class TranscriptLinesController {
  constructor(
    private readonly transcriptLinesService: TranscriptLinesService,
  ) {}

  // ─── Public ────────────────────────────────────────────────────────────────

  @Get(':locale/transcript-lines')
  @ApiOperation({
    summary: 'List transcript lines',
    operationId: 'listTranscriptLines',
  })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiOkResponse({ type: PaginatedTranscriptLinesResponseDto })
  listTranscriptLines(
    @Param('locale') locale: string,
    @Query() query: ListTranscriptLinesQueryDto,
  ) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(50, query.limit ?? 20));
    const grammarPointSlugs = query.grammar_points
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return this.transcriptLinesService.listTranscriptLines(locale, {
      sceneId: query.scene_id,
      speakerSlug: query.speaker_slug,
      startTime: query.start_time,
      grammarPointSlugs,
      page,
      limit,
    });
  }

  @Get(':locale/transcript-lines/:id')
  @ApiOperation({
    summary: 'Get a transcript line by id',
    operationId: 'getTranscriptLine',
  })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiOkResponse({ type: TranscriptLineFullResponseDto })
  @ApiNotFoundResponse({ description: 'Transcript line not found' })
  async getTranscriptLine(
    @Param('locale') locale: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.transcriptLinesService.getTranscriptLine(
      id,
      locale,
    );
    if (!result) throw new NotFoundException('Transcript line not found');
    return result;
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────

  @Post('transcript-lines')
  @UseGuards(ApiKeyGuard)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a transcript line',
    operationId: 'createTranscriptLine',
  })
  @ApiSecurity('x-api-key')
  @ApiCreatedResponse({ type: TranscriptLineWriteResponseDto })
  createTranscriptLine(@Body() body: CreateTranscriptLineDto) {
    return this.transcriptLinesService.createTranscriptLine(body);
  }

  @Put('transcript-lines/:id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Replace a transcript line',
    operationId: 'updateTranscriptLine',
  })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: TranscriptLineWriteResponseDto })
  @ApiNotFoundResponse({ description: 'Transcript line not found' })
  async updateTranscriptLine(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTranscriptLineDto,
  ) {
    const result = await this.transcriptLinesService.updateTranscriptLine(
      id,
      body,
    );
    if (!result) throw new NotFoundException('Transcript line not found');
    return result;
  }

  @Patch('transcript-lines/:id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Partially update a transcript line',
    operationId: 'patchTranscriptLine',
  })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: TranscriptLineWriteResponseDto })
  @ApiNotFoundResponse({ description: 'Transcript line not found' })
  async patchTranscriptLine(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchTranscriptLineDto,
  ) {
    const result = await this.transcriptLinesService.patchTranscriptLine(
      id,
      body,
    );
    if (!result) throw new NotFoundException('Transcript line not found');
    return result;
  }

  @Delete('transcript-lines/:id')
  @UseGuards(ApiKeyGuard)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a transcript line',
    operationId: 'deleteTranscriptLine',
  })
  @ApiSecurity('x-api-key')
  @ApiNoContentResponse({ description: 'Transcript line deleted' })
  async deleteTranscriptLine(@Param('id', ParseIntPipe) id: number) {
    const result = await this.transcriptLinesService.deleteTranscriptLine(id);
    if (!result) throw new NotFoundException('Transcript line not found');
  }
}
