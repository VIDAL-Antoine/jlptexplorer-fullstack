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
import { GrammarPointsService } from './grammar-points.service';
import {
  CreateGrammarPointDto,
  UpdateGrammarPointDto,
  PatchGrammarPointDto,
  ListGrammarPointsQueryDto,
  GrammarPointScenesQueryDto,
} from './dto/grammar-point.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  PaginatedGrammarPointsResponseDto,
  GrammarPointDetailResponseDto,
  GrammarPointScenesResponseDto,
  GrammarPointAdminResponseDto,
} from '../common/dto/grammar-point.response.dto';

@ApiTags('grammar-points')
@Controller()
export class GrammarPointsController {
  constructor(private readonly grammarPointsService: GrammarPointsService) {}

  // ─── Public ────────────────────────────────────────────────────────────────

  @Get(':locale/grammar-points')
  @ApiOperation({
    summary: 'List grammar points',
    operationId: 'listGrammarPoints',
  })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiOkResponse({ type: PaginatedGrammarPointsResponseDto })
  listGrammarPoints(
    @Param('locale') locale: string,
    @Query() query: ListGrammarPointsQueryDto,
  ) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(500, query.limit ?? 50));
    return this.grammarPointsService.listGrammarPoints(
      locale,
      { jlpt_level: query.jlpt_level, search: query.search },
      { page, limit },
    );
  }

  @Get(':locale/grammar-points/:slug')
  @ApiOperation({
    summary: 'Get a grammar point by slug',
    operationId: 'getGrammarPoint',
  })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiParam({ name: 'slug', example: 'wa-topic' })
  @ApiOkResponse({ type: GrammarPointDetailResponseDto })
  @ApiNotFoundResponse({ description: 'Grammar point not found' })
  async getGrammarPoint(
    @Param('locale') locale: string,
    @Param('slug') slug: string,
  ) {
    const result = await this.grammarPointsService.getGrammarPoint(
      slug,
      locale,
    );
    if (!result) throw new NotFoundException('Grammar point not found');
    return result;
  }

  @Get(':locale/grammar-points/:slug/scenes')
  @ApiOperation({
    summary: 'List scenes for a grammar point',
    operationId: 'getGrammarPointScenes',
  })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiParam({ name: 'slug', example: 'wa-topic' })
  @ApiOkResponse({ type: GrammarPointScenesResponseDto })
  @ApiNotFoundResponse({ description: 'Grammar point not found' })
  async getGrammarPointScenes(
    @Param('locale') locale: string,
    @Param('slug') slug: string,
    @Query() query: GrammarPointScenesQueryDto,
  ) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(50, query.limit ?? 12));
    const sourceSlugs =
      query.sources
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) ?? [];
    const result = await this.grammarPointsService.getGrammarPointScenes(
      slug,
      locale,
      {
        sourceSlugs,
        page,
        limit,
      },
    );
    if (!result) throw new NotFoundException('Grammar point not found');
    return result;
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────

  @Post('grammar-points')
  @UseGuards(ApiKeyGuard)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a grammar point',
    operationId: 'createGrammarPoint',
  })
  @ApiSecurity('x-api-key')
  @ApiCreatedResponse({ type: GrammarPointAdminResponseDto })
  createGrammarPoint(@Body() body: CreateGrammarPointDto) {
    return this.grammarPointsService.createGrammarPoint(body);
  }

  @Put('grammar-points/:slug')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Replace a grammar point',
    operationId: 'updateGrammarPoint',
  })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: GrammarPointAdminResponseDto })
  @ApiNotFoundResponse({ description: 'Grammar point not found' })
  async updateGrammarPoint(
    @Param('slug') slug: string,
    @Body() body: UpdateGrammarPointDto,
  ) {
    const result = await this.grammarPointsService.updateGrammarPoint(
      slug,
      body,
    );
    if (!result) throw new NotFoundException('Grammar point not found');
    return result;
  }

  @Patch('grammar-points/:slug')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Partially update a grammar point',
    operationId: 'patchGrammarPoint',
  })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: GrammarPointAdminResponseDto })
  @ApiNotFoundResponse({ description: 'Grammar point not found' })
  async patchGrammarPoint(
    @Param('slug') slug: string,
    @Body() body: PatchGrammarPointDto,
  ) {
    const result = await this.grammarPointsService.patchGrammarPoint(
      slug,
      body,
    );
    if (!result) throw new NotFoundException('Grammar point not found');
    return result;
  }

  @Delete('grammar-points/:slug')
  @UseGuards(ApiKeyGuard)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a grammar point',
    operationId: 'deleteGrammarPoint',
  })
  @ApiSecurity('x-api-key')
  @ApiNoContentResponse({ description: 'Grammar point deleted' })
  deleteGrammarPoint(@Param('slug') slug: string) {
    return this.grammarPointsService.deleteGrammarPoint(slug);
  }
}
