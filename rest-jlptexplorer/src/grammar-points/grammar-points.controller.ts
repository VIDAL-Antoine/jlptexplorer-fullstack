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
import { GrammarPointsService } from './grammar-points.service';
import { CreateGrammarPointDto } from './dto/create-grammar-point.dto';
import { UpdateGrammarPointDto } from './dto/update-grammar-point.dto';
import { QueryGrammarPointDto } from './dto/query-grammar-point.dto';
import { QueryGrammarPointScenesDto } from './dto/query-grammar-point-scenes.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  GrammarPointEntity,
  PaginatedGrammarPointsEntity,
} from './entities/grammar-point.entity';
import { PaginatedGrammarPointScenesEntity } from '../scenes/entities/scene.entity';

@ApiTags('grammar-points')
@Controller('grammar-points')
export class GrammarPointsController {
  constructor(private readonly grammarPointsService: GrammarPointsService) {}

  @ApiOperation({ summary: 'List all grammar points' })
  @ApiOkResponse({ type: PaginatedGrammarPointsEntity })
  @Get()
  findAll(@Query() query: QueryGrammarPointDto) {
    return this.grammarPointsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a grammar point by slug' })
  @ApiOkResponse({ type: GrammarPointEntity })
  @ApiNotFoundResponse()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.grammarPointsService.findOne(slug);
  }

  @ApiOperation({ summary: 'Get scenes for a grammar point' })
  @ApiOkResponse({ type: PaginatedGrammarPointScenesEntity })
  @ApiNotFoundResponse()
  @Get(':slug/scenes')
  findScenes(
    @Param('slug') slug: string,
    @Query() query: QueryGrammarPointScenesDto,
  ) {
    return this.grammarPointsService.findScenes(slug, query);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Create a grammar point' })
  @ApiCreatedResponse({ type: GrammarPointEntity })
  @Post()
  create(@Body() createGrammarPointDto: CreateGrammarPointDto) {
    return this.grammarPointsService.create(createGrammarPointDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Replace a grammar point (full update)' })
  @ApiOkResponse({ type: GrammarPointEntity })
  @ApiNotFoundResponse()
  @Put(':slug')
  replace(
    @Param('slug') slug: string,
    @Body() createGrammarPointDto: CreateGrammarPointDto,
  ) {
    return this.grammarPointsService.update(slug, createGrammarPointDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Partially update a grammar point' })
  @ApiOkResponse({ type: GrammarPointEntity })
  @ApiNotFoundResponse()
  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Body() updateGrammarPointDto: UpdateGrammarPointDto,
  ) {
    return this.grammarPointsService.update(slug, updateGrammarPointDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Delete a grammar point' })
  @ApiOkResponse({ type: GrammarPointEntity })
  @ApiNotFoundResponse()
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.grammarPointsService.remove(slug);
  }
}
