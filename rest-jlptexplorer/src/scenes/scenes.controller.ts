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
import { ScenesService } from './scenes.service';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { QuerySceneDto } from './dto/query-scene.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('scenes')
@Controller('scenes')
export class ScenesController {
  constructor(private readonly scenesService: ScenesService) {}

  @ApiOperation({ summary: 'List all scenes' })
  @Get()
  findAll(@Query() query: QuerySceneDto) {
    return this.scenesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a scene by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scenesService.findOne(+id);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Create a scene with transcript lines' })
  @Post()
  create(@Body() createSceneDto: CreateSceneDto) {
    return this.scenesService.create(createSceneDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Replace a scene (full update)' })
  @Put(':id')
  replace(@Param('id') id: string, @Body() updateSceneDto: UpdateSceneDto) {
    return this.scenesService.update(+id, updateSceneDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Partially update a scene' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSceneDto: UpdateSceneDto) {
    return this.scenesService.update(+id, updateSceneDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Delete a scene' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scenesService.remove(+id);
  }
}
