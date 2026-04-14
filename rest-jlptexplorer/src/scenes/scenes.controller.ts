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
import { ScenesService } from './scenes.service';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { QuerySceneDto } from './dto/query-scene.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { SceneEntity, PaginatedScenesEntity } from './entities/scene.entity';

@ApiTags('scenes')
@Controller('scenes')
export class ScenesController {
  constructor(private readonly scenesService: ScenesService) {}

  @ApiOperation({ summary: 'List all scenes' })
  @ApiOkResponse({ type: PaginatedScenesEntity })
  @Get()
  findAll(@Query() query: QuerySceneDto) {
    return this.scenesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a scene by id' })
  @ApiOkResponse({ type: SceneEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scenesService.findOne(+id);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Create a scene with transcript lines' })
  @ApiCreatedResponse({ type: SceneEntity })
  @Post()
  create(@Body() createSceneDto: CreateSceneDto) {
    return this.scenesService.create(createSceneDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Replace a scene (full update)' })
  @ApiOkResponse({ type: SceneEntity })
  @ApiNotFoundResponse()
  @Put(':id')
  replace(@Param('id') id: string, @Body() createSceneDto: CreateSceneDto) {
    return this.scenesService.update(+id, createSceneDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Partially update a scene' })
  @ApiOkResponse({ type: SceneEntity })
  @ApiNotFoundResponse()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSceneDto: UpdateSceneDto) {
    return this.scenesService.update(+id, updateSceneDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Delete a scene' })
  @ApiOkResponse({ type: SceneEntity })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scenesService.remove(+id);
  }
}
