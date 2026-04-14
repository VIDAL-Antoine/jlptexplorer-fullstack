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
import { GrammarPointsService } from './grammar-points.service';
import { CreateGrammarPointDto } from './dto/create-grammar-point.dto';
import { UpdateGrammarPointDto } from './dto/update-grammar-point.dto';
import { QueryGrammarPointDto } from './dto/query-grammar-point.dto';
import { QueryGrammarPointScenesDto } from './dto/query-grammar-point-scenes.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('grammar-points')
@Controller('grammar-points')
export class GrammarPointsController {
  constructor(private readonly grammarPointsService: GrammarPointsService) {}

  @ApiOperation({ summary: 'List all grammar points' })
  @Get()
  findAll(@Query() query: QueryGrammarPointDto) {
    return this.grammarPointsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get scenes for a grammar point' })
  @Get(':slug/scenes')
  findScenes(
    @Param('slug') slug: string,
    @Query() query: QueryGrammarPointScenesDto,
  ) {
    return this.grammarPointsService.findScenes(slug, query);
  }

  @ApiOperation({ summary: 'Get a grammar point by slug' })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.grammarPointsService.findOne(slug);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Create a grammar point' })
  @Post()
  create(@Body() createGrammarPointDto: CreateGrammarPointDto) {
    return this.grammarPointsService.create(createGrammarPointDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Replace a grammar point (full update)' })
  @Put(':slug')
  replace(
    @Param('slug') slug: string,
    @Body() updateGrammarPointDto: UpdateGrammarPointDto,
  ) {
    return this.grammarPointsService.update(slug, updateGrammarPointDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Partially update a grammar point' })
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
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.grammarPointsService.remove(slug);
  }
}
