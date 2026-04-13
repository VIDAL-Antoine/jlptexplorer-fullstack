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
  ApiBody,
} from '@nestjs/swagger';
import { ScenesService } from './scenes.service';
import {
  CreateSceneDto,
  PatchSceneDto,
  UpdateTranslationsBodyDto,
} from './dto/create-scene.dto';
import { ListScenesQueryDto } from './dto/query-scene.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  PaginatedScenesResponseDto,
  SceneResponseDto,
  SceneAdminResponseDto,
} from '../common/dto/scene.response.dto';

@ApiTags('scenes')
@Controller()
export class ScenesController {
  constructor(private readonly scenesService: ScenesService) {}

  // ─── Public ────────────────────────────────────────────────────────────────

  @Get(':locale/scenes')
  @ApiOperation({ summary: 'List scenes', operationId: 'listScenes' })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiOkResponse({ type: PaginatedScenesResponseDto })
  listScenes(
    @Param('locale') locale: string,
    @Query() query: ListScenesQueryDto,
  ) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(50, query.limit ?? 12));
    const sourceSlugs =
      query.sources
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) ?? [];
    const grammarPointSlugs =
      query.grammar_points
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) ?? [];
    return this.scenesService.listScenes(locale, {
      sourceSlugs,
      grammarPointSlugs,
      grammarMatch: query.grammar_match ?? 'scene',
      youtube_video_id: query.youtube_video_id,
      start_time: query.start_time,
      end_time: query.end_time,
      page,
      limit,
    });
  }

  @Get(':locale/scenes/:id')
  @ApiOperation({ summary: 'Get a scene by ID', operationId: 'getScene' })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiOkResponse({ type: SceneResponseDto })
  @ApiNotFoundResponse({ description: 'Scene not found' })
  async getScene(
    @Param('locale') locale: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.scenesService.getScene(id, locale);
    if (!result) throw new NotFoundException('Scene not found');
    return result;
  }

  @Patch(':locale/scenes/:id/translations')
  @ApiOperation({
    summary: 'Update scene translations',
    operationId: 'updateSceneTranslations',
  })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiOkResponse({ type: SceneAdminResponseDto })
  @ApiNotFoundResponse({ description: 'Scene not found' })
  async updateTranslations(
    @Param('locale') locale: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTranslationsBodyDto,
  ) {
    const result = await this.scenesService.updateTranslations(
      id,
      locale,
      body.transcript_lines,
    );
    if (!result) throw new NotFoundException('Scene not found');
    return result;
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────

  @Post('scenes')
  @UseGuards(ApiKeyGuard)
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a scene', operationId: 'createScene' })
  @ApiSecurity('x-api-key')
  @ApiBody({
    type: CreateSceneDto,
    examples: {
      dragonBallZ: {
        summary: 'Dragon Ball Z — オラは孫悟空だ。',
        description:
          'A scene from Dragon Ball Z where Goku introduces himself, illustrating は (wa-topic) and だ (da-desu).',
        value: {
          source_slug: 'dragon-ball-z',
          episode_number: 1,
          youtube_video_id: 'exYTvideo01',
          start_time: '0:10',
          end_time: '0:20',
          transcript_lines: [
            {
              start_time: '0:11',
              speaker_slug: 'songoku',
              japanese_text: 'オラは孫悟空だ。',
              translations: {
                en: "I'm Songoku.",
                fr: 'Je suis Songoku.',
              },
              grammar_points: [
                {
                  slug: 'wa-topic',
                  start_index: 2,
                  end_index: 3,
                  matched_form: 'は',
                },
                {
                  slug: 'da-desu',
                  start_index: 6,
                  end_index: 7,
                  matched_form: 'だ',
                },
              ],
            },
          ],
        },
      },
    },
  })
  @ApiCreatedResponse({ type: SceneAdminResponseDto })
  createScene(@Body() body: CreateSceneDto) {
    return this.scenesService.createScene(body);
  }

  @Put('scenes/:id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Replace a scene', operationId: 'updateScene' })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: SceneAdminResponseDto })
  updateScene(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateSceneDto,
  ) {
    return this.scenesService.updateScene(id, body);
  }

  @Patch('scenes/:id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Partially update a scene',
    operationId: 'patchScene',
  })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: SceneAdminResponseDto })
  @ApiNotFoundResponse({ description: 'Scene not found' })
  async patchScene(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchSceneDto,
  ) {
    const result = await this.scenesService.patchScene(id, body);
    if (!result) throw new NotFoundException('Scene not found');
    return result;
  }

  @Delete('scenes/:id')
  @UseGuards(ApiKeyGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a scene', operationId: 'deleteScene' })
  @ApiSecurity('x-api-key')
  @ApiNoContentResponse({ description: 'Scene deleted' })
  deleteScene(@Param('id', ParseIntPipe) id: number) {
    return this.scenesService.deleteScene(id);
  }
}
