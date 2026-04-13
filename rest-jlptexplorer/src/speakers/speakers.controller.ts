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
import { SpeakersService } from './speakers.service';
import {
  CreateSpeakerDto,
  UpdateSpeakerDto,
  PatchSpeakerDto,
  ListSpeakersQueryDto,
} from './dto/speaker.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  PaginatedSpeakersResponseDto,
  SpeakerDetailResponseDto,
  SpeakerAdminResponseDto,
} from '../common/dto/speaker.response.dto';

@ApiTags('speakers')
@Controller()
export class SpeakersController {
  constructor(private readonly speakersService: SpeakersService) {}

  // ─── Public ────────────────────────────────────────────────────────────────

  @Get(':locale/speakers')
  @ApiOperation({ summary: 'List speakers', operationId: 'listSpeakers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiOkResponse({ type: PaginatedSpeakersResponseDto })
  listSpeakers(
    @Param('locale') locale: string,
    @Query() query: ListSpeakersQueryDto,
  ) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(200, query.limit ?? 100));
    return this.speakersService.listSpeakers(locale, {
      slug: query.slug,
      page,
      limit,
    });
  }

  @Get(':locale/speakers/:slug')
  @ApiOperation({ summary: 'Get a speaker by slug', operationId: 'getSpeaker' })
  @ApiParam({ name: 'locale', example: 'en' })
  @ApiParam({ name: 'slug', example: 'songoku' })
  @ApiOkResponse({ type: SpeakerDetailResponseDto })
  @ApiNotFoundResponse({ description: 'Speaker not found' })
  async getSpeaker(
    @Param('locale') locale: string,
    @Param('slug') slug: string,
  ) {
    const result = await this.speakersService.getSpeaker(slug, locale);
    if (!result) throw new NotFoundException('Speaker not found');
    return result;
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────

  @Post('speakers')
  @UseGuards(ApiKeyGuard)
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a speaker', operationId: 'createSpeaker' })
  @ApiSecurity('x-api-key')
  @ApiCreatedResponse({ type: SpeakerAdminResponseDto })
  createSpeaker(@Body() body: CreateSpeakerDto) {
    return this.speakersService.createSpeaker(body);
  }

  @Put('speakers/:slug')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Replace a speaker', operationId: 'updateSpeaker' })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: SpeakerAdminResponseDto })
  @ApiNotFoundResponse({ description: 'Speaker not found' })
  async updateSpeaker(
    @Param('slug') slug: string,
    @Body() body: UpdateSpeakerDto,
  ) {
    const result = await this.speakersService.updateSpeaker(slug, body);
    if (!result) throw new NotFoundException('Speaker not found');
    return result;
  }

  @Patch('speakers/:slug')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Partially update a speaker',
    operationId: 'patchSpeaker',
  })
  @ApiSecurity('x-api-key')
  @ApiOkResponse({ type: SpeakerAdminResponseDto })
  @ApiNotFoundResponse({ description: 'Speaker not found' })
  async patchSpeaker(
    @Param('slug') slug: string,
    @Body() body: PatchSpeakerDto,
  ) {
    const result = await this.speakersService.patchSpeaker(slug, body);
    if (!result) throw new NotFoundException('Speaker not found');
    return result;
  }

  @Delete('speakers/:slug')
  @UseGuards(ApiKeyGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a speaker', operationId: 'deleteSpeaker' })
  @ApiSecurity('x-api-key')
  @ApiNoContentResponse({ description: 'Speaker deleted' })
  deleteSpeaker(@Param('slug') slug: string) {
    return this.speakersService.deleteSpeaker(slug);
  }
}
