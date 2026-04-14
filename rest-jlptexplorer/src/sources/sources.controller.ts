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
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { SourcesService } from './sources.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { QuerySourceDto } from './dto/query-source.dto';
import { QuerySourceScenesDto } from './dto/query-source-scenes.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { SourceEntity, PaginatedSourcesEntity } from './entities/source.entity';
import { PaginatedSourceScenesEntity } from '../scenes/entities/scene.entity';

@ApiTags('sources')
@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @ApiOperation({ summary: 'List sources (only those with scenes)' })
  @ApiOkResponse({ type: PaginatedSourcesEntity })
  @Get()
  findAll(@Query() query: QuerySourceDto) {
    return this.sourcesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a source by slug' })
  @ApiOkResponse({ type: SourceEntity })
  @ApiNotFoundResponse()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.sourcesService.findOne(slug);
  }

  @ApiOperation({ summary: 'Get scenes for a source' })
  @ApiOkResponse({ type: PaginatedSourceScenesEntity })
  @ApiNotFoundResponse()
  @Get(':slug/scenes')
  findScenes(
    @Param('slug') slug: string,
    @Query() query: QuerySourceScenesDto,
  ) {
    return this.sourcesService.findScenes(slug, query);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Create a source' })
  @ApiCreatedResponse({ type: SourceEntity })
  @Post()
  create(@Body() createSourceDto: CreateSourceDto) {
    return this.sourcesService.create(createSourceDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Replace a source (full update)' })
  @ApiOkResponse({ type: SourceEntity })
  @ApiNotFoundResponse()
  @Put(':slug')
  replace(
    @Param('slug') slug: string,
    @Body() createSourceDto: CreateSourceDto,
  ) {
    return this.sourcesService.update(slug, createSourceDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Partially update a source' })
  @ApiOkResponse({ type: SourceEntity })
  @ApiNotFoundResponse()
  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Body() updateSourceDto: UpdateSourceDto,
  ) {
    return this.sourcesService.update(slug, updateSourceDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Delete a source' })
  @ApiOkResponse({ type: SourceEntity })
  @ApiNotFoundResponse()
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.sourcesService.remove(slug);
  }
}
