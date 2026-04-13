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
import { SourcesService } from './sources.service';
import {
  CreateSourceDto,
  UpdateSourceDto,
  PatchSourceDto,
} from './dto/create-source.dto';
import {
  ListSourcesQueryDto,
  SourceScenesQueryDto,
} from './dto/query-source.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  PaginatedSourcesResponseDto,
  SourceDetailResponseDto,
  SourceScenesResponseDto,
  SourceAdminResponseDto,
} from '../common/dto/source.response.dto';

@ApiTags('sources')
@Controller()
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  // ─── Public ────────────────────────────────────────────────────────────────

  @Get(':locale/sources')
  @ApiOperation({ summary: 'List sources', operationId: 'listSources' })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiOkResponse({ type: PaginatedSourcesResponseDto })
  listSources(
    @Param('locale') locale: string,
    @Query() query: ListSourcesQueryDto,
  ) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(50, query.limit ?? 12));
    return this.sourcesService.listSources(locale, {
      type: query.type,
      page,
      limit,
    });
  }

  @Get(':locale/sources/:slug')
  @ApiOperation({ summary: 'Get a source by slug', operationId: 'getSource' })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiParam({ name: 'slug', example: 'dragon-ball-z' })
  @ApiOkResponse({ type: SourceDetailResponseDto })
  @ApiNotFoundResponse({ description: 'Source not found' })
  async getSource(
    @Param('locale') locale: string,
    @Param('slug') slug: string,
  ) {
    const result = await this.sourcesService.getSource(slug, locale);
    if (!result) throw new NotFoundException('Source not found');
    return result;
  }

  @Get(':locale/sources/:slug/scenes')
  @ApiOperation({
    summary: 'List scenes for a source',
    operationId: 'getSourceScenes',
  })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiParam({ name: 'slug', example: 'dragon-ball-z' })
  @ApiOkResponse({ type: SourceScenesResponseDto })
  @ApiNotFoundResponse({ description: 'Source not found' })
  async getSourceScenes(
    @Param('locale') locale: string,
    @Param('slug') slug: string,
    @Query() query: SourceScenesQueryDto,
  ) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(50, query.limit ?? 12));
    const grammarPointSlugs =
      query.grammar_points
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) ?? [];
    const result = await this.sourcesService.getSourceScenes(slug, locale, {
      grammarPointSlugs,
      grammarMatch: query.grammar_match ?? 'scene',
      page,
      limit,
    });
    if (!result) throw new NotFoundException('Source not found');
    return result;
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────

  @Post('sources')
  @UseGuards(ApiKeyGuard)
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a source', operationId: 'createSource' })
  @ApiSecurity('x-api-key')
  @ApiCreatedResponse({ type: SourceAdminResponseDto })
  createSource(@Body() body: CreateSourceDto) {
    return this.sourcesService.createSource(body);
  }

  @Put('sources/:slug')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Replace a source', operationId: 'updateSource' })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: SourceAdminResponseDto })
  @ApiNotFoundResponse({ description: 'Source not found' })
  async updateSource(
    @Param('slug') slug: string,
    @Body() body: UpdateSourceDto,
  ) {
    const result = await this.sourcesService.updateSource(slug, body);
    if (!result) throw new NotFoundException('Source not found');
    return result;
  }

  @Patch('sources/:slug')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Partially update a source',
    operationId: 'patchSource',
  })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: SourceAdminResponseDto })
  @ApiNotFoundResponse({ description: 'Source not found' })
  async patchSource(@Param('slug') slug: string, @Body() body: PatchSourceDto) {
    const result = await this.sourcesService.patchSource(slug, body);
    if (!result) throw new NotFoundException('Source not found');
    return result;
  }

  @Delete('sources/:slug')
  @UseGuards(ApiKeyGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a source', operationId: 'deleteSource' })
  @ApiSecurity('x-api-key')
  @ApiNoContentResponse({ description: 'Source deleted' })
  deleteSource(@Param('slug') slug: string) {
    return this.sourcesService.deleteSource(slug);
  }
}
