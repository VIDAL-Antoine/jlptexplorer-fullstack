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
  ApiSecurity,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { TranscriptLineGrammarPointsService } from './transcript-line-grammar-points.service';
import {
  CreateTranscriptLineGrammarPointDto,
  UpdateTranscriptLineGrammarPointDto,
  PatchTranscriptLineGrammarPointDto,
  ListTranscriptLineGrammarPointsQueryDto,
} from './dto/transcript-line-grammar-point.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { TlgpEntityResponseDto } from '../common/dto/tlgp.response.dto';

@ApiTags('transcript-line-grammar-points')
@Controller()
export class TranscriptLineGrammarPointsController {
  constructor(
    private readonly tlgpService: TranscriptLineGrammarPointsService,
  ) {}

  // ─── Admin (all routes are admin-only) ─────────────────────────────────────

  @Get('transcript-line-grammar-points')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'List transcript line grammar point links',
    operationId: 'listTranscriptLineGrammarPoints',
  })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: [TlgpEntityResponseDto] })
  listTranscriptLineGrammarPoints(
    @Query() query: ListTranscriptLineGrammarPointsQueryDto,
  ) {
    return this.tlgpService.listTranscriptLineGrammarPoints({
      transcriptLineId: query.transcript_line_id,
    });
  }

  @Get('transcript-line-grammar-points/:id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Get a transcript line grammar point link by id',
    operationId: 'getTranscriptLineGrammarPoint',
  })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: TlgpEntityResponseDto })
  @ApiNotFoundResponse({ description: 'Transcript line grammar point not found' })
  async getTranscriptLineGrammarPoint(@Param('id', ParseIntPipe) id: number) {
    const result = await this.tlgpService.getTranscriptLineGrammarPointById(id);
    if (!result)
      throw new NotFoundException('Transcript line grammar point not found');
    return result;
  }

  @Post('transcript-line-grammar-points')
  @UseGuards(ApiKeyGuard)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Link a grammar point to a transcript line',
    operationId: 'createTranscriptLineGrammarPoint',
  })
  @ApiSecurity('x-api-key')
  @ApiCreatedResponse({ type: TlgpEntityResponseDto })
  createTranscriptLineGrammarPoint(
    @Body() body: CreateTranscriptLineGrammarPointDto,
  ) {
    return this.tlgpService.createTranscriptLineGrammarPoint(body);
  }

  @Put('transcript-line-grammar-points/:id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Replace a transcript line grammar point link',
    operationId: 'updateTranscriptLineGrammarPoint',
  })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: TlgpEntityResponseDto })
  @ApiNotFoundResponse({ description: 'Transcript line grammar point not found' })
  async updateTranscriptLineGrammarPoint(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTranscriptLineGrammarPointDto,
  ) {
    const result = await this.tlgpService.updateTranscriptLineGrammarPoint(
      id,
      body,
    );
    if (!result)
      throw new NotFoundException('Transcript line grammar point not found');
    return result;
  }

  @Patch('transcript-line-grammar-points/:id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Update a transcript line grammar point link',
    operationId: 'patchTranscriptLineGrammarPoint',
  })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: TlgpEntityResponseDto })
  @ApiNotFoundResponse({ description: 'Transcript line grammar point not found' })
  async patchTranscriptLineGrammarPoint(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchTranscriptLineGrammarPointDto,
  ) {
    const result = await this.tlgpService.patchTranscriptLineGrammarPoint(
      id,
      body,
    );
    if (!result)
      throw new NotFoundException('Transcript line grammar point not found');
    return result;
  }

  @Delete('transcript-line-grammar-points/:id')
  @UseGuards(ApiKeyGuard)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove a grammar point link from a transcript line',
    operationId: 'deleteTranscriptLineGrammarPoint',
  })
  @ApiSecurity('x-api-key')
  @ApiNoContentResponse({ description: 'Link deleted' })
  async deleteTranscriptLineGrammarPoint(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.tlgpService.deleteTranscriptLineGrammarPoint(id);
    if (!result)
      throw new NotFoundException('Transcript line grammar point not found');
  }
}
